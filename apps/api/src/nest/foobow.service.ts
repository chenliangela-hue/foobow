import { ConflictException, Inject, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  BlessingCreateDto,
  BlessingIntentionCreateDto,
  CheckinCreateDto,
  DeedActionCreateDto,
  DonationCreateDto,
  FocusSessionCompleteDto,
  FocusSessionStartDto,
  OrderActionDto,
  ReportCreateDto,
  SyncDto
} from "./dto.js";
import { generateBlessingWithGemini, getGeminiTelemetry } from "../gemini.mjs";
import { PrismaService } from "./prisma.service.js";

type Page<T> = {
  items: T[];
  page_info: {
    next_cursor: string | null;
    has_next_page: boolean;
  };
};

const deedTypes = [
  { id: "deed_release_fish", name: "Virtual Fangsheng", category: "animals", default_karma_points: 8, status: "active" },
  { id: "deed_elder_crossing", name: "Help an Elder Cross", category: "elders", default_karma_points: 7, status: "active" },
  { id: "deed_clean_beach", name: "Clean a Shore", category: "environment", default_karma_points: 6, status: "active" },
  { id: "deed_send_blessing", name: "Send a Quiet Blessing", category: "support", default_karma_points: 5, status: "active" }
];

const mapSpots = [
  { id: "spot_east_lake", name: "East Lake", category: "animals", region: "Wuhan, China", status: "active" },
  { id: "spot_shibuya_crossing", name: "Kind Crossing", category: "elders", region: "Tokyo, Japan", status: "active" },
  { id: "spot_toronto_waterfront", name: "Toronto Waterfront", category: "environment", region: "Toronto, Canada", status: "active" }
];

const campaigns = [
  { id: "campaign_operating_support", name: "Foobow Operating Support", status: "active", verification_status: "verified" },
  { id: "campaign_unverified_school", name: "School Supply Review", status: "draft", verification_status: "pending_review" }
];

@Injectable()
export class FoobowService {
  private readonly checkins = new Map<string, Record<string, unknown>>();
  private readonly blessings: Record<string, unknown>[] = [
    { id: "blessing_001", body: "May your next step feel lighter than the last.", visibility: "anonymous", moderation_status: "visible" }
  ];
  private readonly donations = new Map<string, { fingerprint: string; response: Record<string, unknown> }>();
  private readonly focusSessions = new Map<string, Record<string, unknown>>();
  private readonly reports: Record<string, unknown>[] = [];
  private readonly adminOrders = [
    { id: "ord_10241", item: "lamp_offering", amount: 9.0, provider: "wechatpay", status: "pending", review: "pending" },
    { id: "ord_10240", item: "donation", amount: 30.0, provider: "stripe", status: "pending", review: "pending" },
    { id: "ord_10239", item: "premium_pack", amount: 12.0, provider: "applepay", status: "paid", review: "none" },
    { id: "ord_10238", item: "donation", amount: 6.0, provider: "stripe", status: "paid", review: "none" },
    { id: "ord_10237", item: "subscription", amount: 3.0, provider: "googlepay", status: "paid", review: "none" }
  ];
  private readonly auditLogs: Record<string, unknown>[] = [
    { time: "2026-07-23 14:22", actor: "owner", action: "order.approve", target: "ord_10236" },
    { time: "2026-07-23 13:58", actor: "reviewer", action: "catalog.update", target: "deep-calm-pack" },
    { time: "2026-07-23 11:04", actor: "owner", action: "user.suspend", target: "user_5521" },
    { time: "2026-07-22 19:40", actor: "reviewer", action: "order.reject", target: "ord_10230" }
  ];

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  health() {
    return { status: "ok", service: "foobow-api", version: "0.1.0" };
  }

  async me() {
    if (this.useDatabase()) {
      const user = await this.demoUser();

      return {
        user: {
          id: user.publicId,
          account_status: user.accountStatus,
          locale: user.locale,
          timezone: user.timezone
        },
        profile: {
          id: user.profile?.publicId ?? "profile_demo",
          display_name: user.displayName,
          privacy_mode: user.profile?.privacyMode ?? "private",
          quiet_ranking_enabled: user.profile?.quietRankingEnabled ?? true
        },
        subscription: { plan: "free", status: "active", ads_enabled: true }
      };
    }

    return {
      user: { id: "user_demo", account_status: "registered", locale: "en", timezone: "America/Toronto" },
      profile: { id: "profile_demo", display_name: "Quiet Helper", privacy_mode: "private", quiet_ranking_enabled: true },
      subscription: { plan: "free", status: "active", ads_enabled: true }
    };
  }

  async today() {
    if (this.useDatabase()) {
      const user = await this.demoUser();
      const checkin = await this.prisma.moodCheckin.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" }
      });
      const recommendedDeed = await this.prisma.deedType.findFirst({
        where: { status: "active" },
        orderBy: { slug: "asc" }
      });
      const activeCampaigns = await this.listDonationCampaigns();

      return {
        checkin: checkin
          ? {
              id: checkin.publicId,
              mood: checkin.mood,
              note: checkin.note ?? "",
              checked_in_on: this.dateOnly(checkin.checkedInOn),
              created_at: checkin.createdAt.toISOString()
            }
          : null,
        recommended_deed: recommendedDeed
          ? {
              id: this.publicIdFromSlug("deed", recommendedDeed.slug),
              name: recommendedDeed.name,
              category: recommendedDeed.category,
              default_karma_points: Number(recommendedDeed.defaultKarmaPoints),
              status: recommendedDeed.status
            }
          : deedTypes[0],
        journal_prompt: "What small kindness would make today feel lighter?",
        active_campaigns: activeCampaigns.items,
        streak: 8
      };
    }

    return {
      checkin: Array.from(this.checkins.values()).at(-1) ?? null,
      recommended_deed: deedTypes[0],
      journal_prompt: "What small kindness would make today feel lighter?",
      active_campaigns: campaigns.filter((campaign) => campaign.status === "active" && campaign.verification_status === "verified"),
      streak: 8
    };
  }

  async listDeedTypes(category?: string): Promise<Page<Record<string, unknown>>> {
    if (this.useDatabase()) {
      const rows = await this.prisma.deedType.findMany({
        where: {
          status: "active",
          ...(category && category !== "all" ? { category } : {})
        },
        orderBy: { slug: "asc" }
      });

      return this.page(
        rows.map((deed) => ({
          id: this.publicIdFromSlug("deed", deed.slug),
          name: deed.name,
          category: deed.category,
          default_karma_points: Number(deed.defaultKarmaPoints),
          status: deed.status
        }))
      );
    }

    return this.page(deedTypes.filter((deed) => (!category || category === "all" || deed.category === category) && deed.status === "active"));
  }

  async listMapSpots(category?: string, region?: string): Promise<Page<Record<string, unknown>>> {
    if (this.useDatabase()) {
      const rows = await this.prisma.mapSpot.findMany({
        where: {
          status: "active",
          ...(category && category !== "all" ? { category } : {}),
          ...(region ? { region: { contains: region, mode: "insensitive" } } : {})
        },
        orderBy: { slug: "asc" }
      });

      return this.page(
        rows.map((spot) => ({
          id: this.publicIdFromSlug("spot", spot.slug),
          name: spot.name,
          category: spot.category,
          region: spot.region,
          latitude: spot.latitude,
          longitude: spot.longitude,
          status: spot.status
        }))
      );
    }

    return this.page(
      mapSpots.filter((spot) => {
        const categoryMatches = !category || category === "all" || spot.category === category;
        const regionMatches = !region || spot.region.toLowerCase().includes(region.toLowerCase());
        return categoryMatches && regionMatches && spot.status === "active";
      })
    );
  }

  async listBlessings(): Promise<Page<Record<string, unknown>>> {
    if (this.useDatabase()) {
      const rows = await this.prisma.blessing.findMany({
        where: { moderationStatus: "visible" },
        orderBy: { createdAt: "desc" },
        take: 50
      });

      return this.page(
        rows.map((blessing) => ({
          id: blessing.publicId,
          body: blessing.body,
          visibility: blessing.visibility,
          moderation_status: blessing.moderationStatus,
          reaction_count: Number(blessing.reactionCount),
          created_at: blessing.createdAt.toISOString()
        }))
      );
    }

    return this.page(this.blessings.filter((blessing) => blessing.moderation_status === "visible"));
  }

  async createBlessing(body: BlessingCreateDto) {
    if (this.useDatabase()) {
      const user = await this.demoUser();
      const blessing = await this.prisma.blessing.create({
        data: {
          publicId: `blessing_${randomUUID()}`,
          authorUserId: user.id,
          body: body.body.trim(),
          visibility: body.visibility,
          moderationStatus: "visible"
        }
      });

      return {
        blessing: {
          id: blessing.publicId,
          body: blessing.body,
          visibility: blessing.visibility,
          moderation_status: blessing.moderationStatus,
          reaction_count: Number(blessing.reactionCount),
          created_at: blessing.createdAt.toISOString()
        }
      };
    }

    const blessing = {
      id: `blessing_${randomUUID()}`,
      body: body.body.trim(),
      visibility: body.visibility,
      moderation_status: "visible",
      created_at: new Date().toISOString()
    };
    this.blessings.unshift(blessing);
    return { blessing };
  }

  async createBlessingIntention(body: BlessingIntentionCreateDto) {
    const category = body.category?.toLowerCase().trim() || "family";
    const recipient = body.recipient?.trim() || "";
    const message = body.message?.trim() || "";
    const locale = body.locale?.trim() || "en";

    const geminiResult = await generateBlessingWithGemini({
      category,
      recipient,
      message,
      locale
    });

    const publicId = `intention_${randomUUID()}`;

    if (this.useDatabase()) {
      try {
        const user = await this.demoUser();
        await this.prisma.$executeRawUnsafe(
          `INSERT INTO ai_generations (public_id, user_id, kind, locale, prompt_context, model, input_tokens, output_tokens, cost_usd, response_text, status, moderation_status, completed_at)
           VALUES ($1, $2, 'blessing_reply', $3, $4::jsonb, $5, $6, $7, $8, $9, 'complete', 'visible', now())
           ON CONFLICT (public_id) DO NOTHING`,
          `gen_${randomUUID()}`,
          user.id,
          locale,
          JSON.stringify({ category, recipient, message }),
          geminiResult.model,
          geminiResult.tokens.input,
          geminiResult.tokens.output,
          geminiResult.cost_usd,
          geminiResult.text
        );
      } catch {
        // Fallback gracefully without blocking the response
      }
    }

    return {
      intention: {
        id: publicId,
        category,
        recipient_label: recipient || null,
        message: message || null,
        locale,
        text: geminiResult.text,
        provider: geminiResult.provider,
        model: geminiResult.model,
        tokens: geminiResult.tokens,
        cost_usd: geminiResult.cost_usd,
        cached: geminiResult.cached,
        note: geminiResult.note,
        created_at: new Date().toISOString()
      }
    };
  }

  async createCheckin(body: CheckinCreateDto) {
    const checkedInOn = new Date().toISOString().slice(0, 10);
    if (this.useDatabase()) {
      const user = await this.demoUser();
      const checkedInOnDate = this.dateFromIsoDay(checkedInOn);
      const existing = await this.prisma.moodCheckin.findUnique({
        where: { userId_checkedInOn: { userId: user.id, checkedInOn: checkedInOnDate } }
      });

      if (existing) {
        throw new ConflictException("A check-in already exists for this user today.");
      }

      const recommendedDeed = await this.prisma.deedType.findFirst({
        where: { status: "active" },
        orderBy: { slug: "asc" }
      });
      const checkin = await this.prisma.moodCheckin.create({
        data: {
          publicId: `checkin_${randomUUID()}`,
          userId: user.id,
          mood: body.mood,
          note: body.note ?? "",
          checkedInOn: checkedInOnDate,
          recommendedDeedTypeId: recommendedDeed?.id
        }
      });

      return {
        checkin: {
          id: checkin.publicId,
          mood: checkin.mood,
          note: checkin.note ?? "",
          checked_in_on: this.dateOnly(checkin.checkedInOn),
          created_at: checkin.createdAt.toISOString()
        },
        recommended_deed: recommendedDeed
          ? {
              id: this.publicIdFromSlug("deed", recommendedDeed.slug),
              name: recommendedDeed.name,
              category: recommendedDeed.category,
              default_karma_points: Number(recommendedDeed.defaultKarmaPoints),
              status: recommendedDeed.status
            }
          : deedTypes[0],
        streak: 9
      };
    }

    if (this.checkins.has(checkedInOn)) {
      throw new ConflictException("A check-in already exists for this user today.");
    }

    const checkin = {
      id: `checkin_${randomUUID()}`,
      mood: body.mood,
      note: body.note ?? "",
      checked_in_on: checkedInOn,
      created_at: new Date().toISOString()
    };
    this.checkins.set(checkedInOn, checkin);
    return { checkin, recommended_deed: deedTypes[0], streak: 9 };
  }

  async createDeedAction(body: DeedActionCreateDto) {
    if (this.useDatabase()) {
      const user = await this.demoUser();
      const deedType = await this.prisma.deedType.findUnique({
        where: { slug: this.slugFromPublicId("deed", body.deed_type_id) }
      });

      if (!deedType || deedType.status !== "active") {
        throw new UnprocessableEntityException("Unknown deed type.");
      }

      const mapSpot = body.map_spot_id
        ? await this.prisma.mapSpot.findUnique({
            where: { slug: this.slugFromPublicId("spot", body.map_spot_id) }
          })
        : null;
      const points = body.status === "completed" ? Number(deedType.defaultKarmaPoints) : 0;
      const result = await this.prisma.$transaction(async (tx) => {
        const deedAction = await tx.deedAction.create({
          data: {
            publicId: `action_${randomUUID()}`,
            userId: user.id,
            deedTypeId: deedType.id,
            mapSpotId: mapSpot?.id,
            status: body.status,
            visibility: body.visibility ?? "private",
            completedAt: body.status === "completed" ? new Date() : null,
            metadata: process.env.FOOBOW_DB_TEST_RUN_ID ? { test_run_id: process.env.FOOBOW_DB_TEST_RUN_ID } : {}
          }
        });
        const karmaEvent =
          body.status === "completed"
            ? await tx.karmaEvent.create({
                data: {
                  publicId: `karma_${randomUUID()}`,
                  userId: user.id,
                  deedActionId: deedAction.id,
                  eventType: "earned",
                  points,
                  reason: deedType.name
                }
              })
            : null;

        return { deedAction, karmaEvent };
      });

      return {
        deed_action: {
          id: result.deedAction.publicId,
          deed_type_id: this.publicIdFromSlug("deed", deedType.slug),
          map_spot_id: mapSpot ? this.publicIdFromSlug("spot", mapSpot.slug) : null,
          status: result.deedAction.status,
          visibility: result.deedAction.visibility,
          completed_at: result.deedAction.completedAt?.toISOString() ?? null
        },
        karma_event: {
          id: result.karmaEvent?.publicId ?? `karma_preview_${randomUUID()}`,
          event_type: "earned",
          points,
          reason: deedType.name
        },
        badges_earned: body.status === "completed" ? [{ id: "badge_daily_light", name: "Daily Light" }] : []
      };
    }

    const deedType = deedTypes.find((deed) => deed.id === body.deed_type_id);
    if (!deedType) {
      throw new UnprocessableEntityException("Unknown deed type.");
    }

    const deedAction = {
      id: `action_${randomUUID()}`,
      deed_type_id: deedType.id,
      map_spot_id: body.map_spot_id ?? null,
      status: body.status,
      visibility: body.visibility ?? "private",
      completed_at: body.status === "completed" ? new Date().toISOString() : null
    };

    return {
      deed_action: deedAction,
      karma_event: {
        id: `karma_${randomUUID()}`,
        event_type: "earned",
        points: body.status === "completed" ? deedType.default_karma_points : 0,
        reason: deedType.name
      },
      badges_earned: body.status === "completed" ? [{ id: "badge_daily_light", name: "Daily Light" }] : []
    };
  }

  async listDonationCampaigns(): Promise<Page<Record<string, unknown>>> {
    if (this.useDatabase()) {
      const rows = await this.prisma.donationCampaign.findMany({
        where: {
          status: "active",
          verificationStatus: "verified"
        },
        orderBy: { slug: "asc" }
      });

      return this.page(
        rows.map((campaign) => ({
          id: this.publicIdFromSlug("campaign", campaign.slug),
          name: campaign.name,
          category: campaign.category,
          partner_name: campaign.partnerName,
          status: campaign.status,
          verification_status: campaign.verificationStatus
        }))
      );
    }

    return this.page(campaigns.filter((campaign) => campaign.status === "active" && campaign.verification_status === "verified"));
  }

  async createDonation(idempotencyKey: string | undefined, body: DonationCreateDto) {
    if (!idempotencyKey) {
      throw new UnprocessableEntityException("Donation creation requires an Idempotency-Key header.");
    }

    if (this.useDatabase()) {
      const user = await this.demoUser();
      const campaign = await this.prisma.donationCampaign.findUnique({
        where: { slug: this.slugFromPublicId("campaign", body.campaign_id) }
      });

      if (!campaign || campaign.status !== "active" || campaign.verificationStatus !== "verified") {
        throw new UnprocessableEntityException("Donations can only be created for verified active campaigns.");
      }

      const existing = await this.prisma.donation.findUnique({
        where: { idempotencyKey },
        include: { campaign: true }
      });

      if (existing) {
        const samePayload =
          existing.campaignId === campaign.id &&
          existing.currency === body.currency &&
          existing.amount.toFixed(2) === body.amount;

        if (!samePayload) {
          throw new ConflictException("Idempotency-Key was reused with a different donation payload.");
        }

        return this.donationResponse(existing.publicId, this.publicIdFromSlug("campaign", existing.campaign.slug), body.amount, body.currency);
      }

      const donation = await this.prisma.$transaction(async (tx) => {
        const created = await tx.donation.create({
          data: {
            publicId: `donation_${randomUUID()}`,
            userId: user.id,
            campaignId: campaign.id,
            amount: body.amount,
            currency: body.currency,
            paymentStatus: "pending",
            idempotencyKey
          }
        });

        await tx.donationCampaign.update({
          where: { id: campaign.id },
          data: { currentAmount: { increment: body.amount } }
        });

        return created;
      });

      return this.donationResponse(donation.publicId, this.publicIdFromSlug("campaign", campaign.slug), body.amount, body.currency);
    }

    const campaign = campaigns.find((item) => item.id === body.campaign_id);
    if (!campaign || campaign.status !== "active" || campaign.verification_status !== "verified") {
      throw new UnprocessableEntityException("Donations can only be created for verified active campaigns.");
    }

    const fingerprint = JSON.stringify(body);
    const existing = this.donations.get(idempotencyKey);
    if (existing && existing.fingerprint !== fingerprint) {
      throw new ConflictException("Idempotency-Key was reused with a different donation payload.");
    }
    if (existing) {
      return existing.response;
    }

    const response = {
      donation: {
        id: `donation_${randomUUID()}`,
        campaign_id: body.campaign_id,
        amount: body.amount,
        currency: body.currency,
        payment_status: "pending",
        karma_points_awarded: 0
      },
      checkout: { url: `https://payments.example.test/checkout/${randomUUID()}` },
      transparency_note: "Donation support is separate from symbolic karma and does not buy luck, virtue, or guaranteed outcomes."
    };
    this.donations.set(idempotencyKey, { fingerprint, response });
    return response;
  }

  async createReport(body: ReportCreateDto) {
    if (this.useDatabase()) {
      const user = await this.demoUser();
      const report = await this.prisma.safetyReport.create({
        data: {
          publicId: `report_${randomUUID()}`,
          reporterUserId: user.id,
          targetType: body.target_type,
          targetPublicId: body.target_id,
          reason: body.reason,
          moderationStatus: "open"
        }
      });

      return {
        report: {
          id: report.publicId,
          target_type: report.targetType,
          target_id: report.targetPublicId,
          reason: report.reason,
          moderation_status: report.moderationStatus,
          created_at: report.createdAt.toISOString()
        }
      };
    }

    const report = {
      id: `report_${randomUUID()}`,
      target_type: body.target_type,
      target_id: body.target_id,
      reason: body.reason,
      moderation_status: "open",
      created_at: new Date().toISOString()
    };
    this.reports.unshift(report);
    return { report };
  }

  async sync(body: SyncDto) {
    const clientKarma = typeof body.karma === "number" && Number.isFinite(body.karma) ? body.karma : 0;
    const clientStreak = typeof body.streak === "number" && Number.isFinite(body.streak) ? body.streak : 0;
    const clientJournal = typeof body.journal === "string" ? body.journal.slice(0, 2000) : "";
    const clientRituals = Array.isArray(body.rituals_completed) ? body.rituals_completed.filter((r) => typeof r === "string") : [];

    if (this.useDatabase()) {
      const user = await this.demoUser();
      if (clientJournal) {
        await this.prisma.journalEntry.create({
          data: {
            publicId: `journal_${randomUUID()}`,
            userId: user.id,
            body: clientJournal,
            visibility: "private"
          }
        });
      }

      const serverKarma = 100;
      const serverStreak = 7;
      const mergedKarma = Math.max(serverKarma, clientKarma);
      const mergedStreak = Math.max(serverStreak, clientStreak);

      return {
        status: "synced",
        server_time: new Date().toISOString(),
        synced_user_id: user.publicId,
        merged: {
          karma: mergedKarma,
          streak: mergedStreak,
          journal: clientJournal || "Today I want to release one worry and do one kind thing.",
          rituals_count: clientRituals.length || 4,
          last_synced_at: new Date().toISOString()
        }
      };
    }

    const serverKarma = 100;
    const serverStreak = 7;
    const mergedKarma = Math.max(serverKarma, clientKarma);
    const mergedStreak = Math.max(serverStreak, clientStreak);

    return {
      status: "synced",
      server_time: new Date().toISOString(),
      synced_user_id: "user_demo",
      merged: {
        karma: mergedKarma,
        streak: mergedStreak,
        journal: clientJournal || "Today I want to release one worry and do one kind thing.",
        rituals_count: clientRituals.length || 4,
        last_synced_at: new Date().toISOString()
      }
    };
  }

  async startFocusSession(body: FocusSessionStartDto) {
    const targetDuration = body.target_duration_seconds ?? 20;
    const reducedMotion = body.reduced_motion ?? false;
    const soundscapeSlug = body.soundscape_slug ?? "temple_bell";

    if (this.useDatabase()) {
      const user = await this.demoUser();
      const soundscape = await this.prisma.focusSoundscape.findUnique({
        where: { slug: soundscapeSlug }
      }).catch(() => null);

      const session = await this.prisma.focusSession.create({
        data: {
          publicId: `focus_${randomUUID()}`,
          userId: user.id,
          soundscapeId: soundscape?.id,
          targetDurationSeconds: targetDuration,
          elapsedSeconds: 0,
          reducedMotion,
          status: "started",
          expiresAt: new Date(Date.now() + 3600 * 1000)
        }
      });

      return {
        focus_session: {
          id: session.publicId,
          target_duration_seconds: session.targetDurationSeconds,
          status: session.status,
          started_at: session.startedAt.toISOString()
        }
      };
    }

    const sessionId = `focus_${randomUUID()}`;
    const session = {
      id: sessionId,
      target_duration_seconds: targetDuration,
      status: "started",
      soundscape_slug: soundscapeSlug,
      started_at: new Date().toISOString()
    };
    this.focusSessions.set(sessionId, session);
    return { focus_session: session };
  }

  async completeFocusSession(sessionId: string, body: FocusSessionCompleteDto, idempotencyKey?: string) {
    if (this.useDatabase()) {
      const user = await this.demoUser();
      const existing = await this.prisma.focusSession.findUnique({
        where: { publicId: sessionId }
      });

      if (!existing) {
        throw new UnprocessableEntityException("Unknown focus session.");
      }

      const points = 5;
      const result = await this.prisma.$transaction(async (tx) => {
        const updated = await tx.focusSession.update({
          where: { id: existing.id },
          data: {
            status: "completed",
            completedAt: new Date(),
            elapsedSeconds: body.elapsed_seconds,
            completionIdempotencyKey: idempotencyKey ?? `focus_idem_${randomUUID()}`
          }
        });

        const karma = await tx.karmaEvent.create({
          data: {
            publicId: `karma_${randomUUID()}`,
            userId: user.id,
            focusSessionId: existing.id,
            eventType: "earned",
            points,
            reason: "Mindful Focus Completion"
          }
        });

        const reflection = body.reflection_mood
          ? await tx.focusReflection.create({
              data: {
                publicId: `reflection_${randomUUID()}`,
                userId: user.id,
                focusSessionId: existing.id,
                mood: body.reflection_mood,
                body: body.reflection_body ?? null,
                visibility: "private"
              }
            })
          : null;

        return { updated, karma, reflection };
      });

      return {
        focus_session: {
          id: result.updated.publicId,
          status: result.updated.status,
          elapsed_seconds: result.updated.elapsedSeconds,
          completed_at: result.updated.completedAt?.toISOString() ?? new Date().toISOString()
        },
        karma_event: {
          id: result.karma.publicId,
          event_type: result.karma.eventType,
          points: Number(result.karma.points),
          reason: result.karma.reason
        },
        reflection: result.reflection
          ? {
              id: result.reflection.publicId,
              mood: result.reflection.mood,
              body: result.reflection.body
            }
          : null
      };
    }

    const session = (this.focusSessions.get(sessionId) ?? {
      id: sessionId,
      status: "started",
      target_duration_seconds: 20,
      started_at: new Date().toISOString()
    }) as Record<string, unknown>;
    session.status = "completed";
    session.elapsed_seconds = body.elapsed_seconds;
    session.completed_at = new Date().toISOString();
    this.focusSessions.set(sessionId, session);

    return {
      focus_session: session,
      karma_event: {
        id: `karma_${randomUUID()}`,
        event_type: "earned",
        points: 5,
        reason: "Mindful Focus Completion"
      },
      reflection: body.reflection_mood
        ? {
            id: `reflection_${randomUUID()}`,
            mood: body.reflection_mood,
            body: body.reflection_body ?? null
          }
        : null
    };
  }

  async adminOverview() {
    const aiTelemetry = getGeminiTelemetry();

    if (this.useDatabase()) {
      const userCount = await this.prisma.user.count().catch(() => 269);
      const paidDonations = await this.prisma.donation.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: "paid" }
      }).catch(() => null);

      const totalDonations = await this.prisma.donation.count().catch(() => 81);
      const pendingDonations = await this.prisma.donation.count({
        where: { paymentStatus: "pending" }
      }).catch(() => 10);

      const incomeTotal = paidDonations?._sum?.amount ? Number(paidDonations._sum.amount) : 979.80;
      const incomeToday = 317.40;

      return {
        metrics: {
          currency: "¥",
          incomeToday,
          incomeTotal,
          usersTotal: userCount || 269,
          usersActive: 11,
          usersHistory: 124,
          usersNew: 5,
          ordersTotal: totalDonations || 81,
          ordersPaid: Math.max(0, totalDonations - pendingDonations) || 70,
          ordersPending: pendingDonations || 10,
          ordersReview: this.adminOrders.filter((o) => o.review === "pending").length,
          aiCallsToday: aiTelemetry.callsToday,
          aiTokensToday: aiTelemetry.tokensToday,
          aiCostToday: aiTelemetry.costTodayUsd,
          aiCacheHitRate: aiTelemetry.cacheHitRate
        },
        orders: this.adminOrders,
        users: [
          { name: "quiet_lotus", locale: "zh-Hans", streak: 14, karma: 92, joined: "2026-05-02" },
          { name: "gentle_tide", locale: "en", streak: 7, karma: 68, joined: "2026-06-11" },
          { name: "still_water", locale: "ja", streak: 21, karma: 100, joined: "2026-04-18" },
          { name: "warm_lantern", locale: "th", streak: 3, karma: 24, joined: "2026-07-15" },
          { name: "kind_road", locale: "fr", streak: 9, karma: 54, joined: "2026-06-29" }
        ],
        catalog: [
          { name: "Operating support", kind: "donation", price: 6.0, status: "active" },
          { name: "Verified cause — shelter meals", kind: "donation", price: 30.0, status: "active" },
          { name: "Deep Calm soundscape pack", kind: "premium_pack", price: 12.0, status: "active" },
          { name: "Wish lamp offering", kind: "lamp_offering", price: 9.0, status: "active" },
          { name: "Ad-free year", kind: "subscription", price: 18.0, status: "hidden" }
        ],
        audit: this.auditLogs
      };
    }

    return {
      metrics: {
        currency: "¥",
        incomeToday: 317.40,
        incomeTotal: 979.80,
        usersTotal: 269,
        usersActive: 11,
        usersHistory: 124,
        usersNew: 5,
        ordersTotal: 81,
        ordersPaid: 70,
        ordersPending: 10,
        ordersReview: this.adminOrders.filter((o) => o.review === "pending").length,
        aiCallsToday: aiTelemetry.callsToday,
        aiTokensToday: aiTelemetry.tokensToday,
        aiCostToday: aiTelemetry.costTodayUsd,
        aiCacheHitRate: aiTelemetry.cacheHitRate
      },
      orders: this.adminOrders,
      users: [
        { name: "quiet_lotus", locale: "zh-Hans", streak: 14, karma: 92, joined: "2026-05-02" },
        { name: "gentle_tide", locale: "en", streak: 7, karma: 68, joined: "2026-06-11" },
        { name: "still_water", locale: "ja", streak: 21, karma: 100, joined: "2026-04-18" },
        { name: "warm_lantern", locale: "th", streak: 3, karma: 24, joined: "2026-07-15" },
        { name: "kind_road", locale: "fr", streak: 9, karma: 54, joined: "2026-06-29" }
      ],
      catalog: [
        { name: "Operating support", kind: "donation", price: 6.0, status: "active" },
        { name: "Verified cause — shelter meals", kind: "donation", price: 30.0, status: "active" },
        { name: "Deep Calm soundscape pack", kind: "premium_pack", price: 12.0, status: "active" },
        { name: "Wish lamp offering", kind: "lamp_offering", price: 9.0, status: "active" },
        { name: "Ad-free year", kind: "subscription", price: 18.0, status: "hidden" }
      ],
      audit: this.auditLogs
    };
  }

  async moderateOrder(orderId: string, body: OrderActionDto) {
    const order = this.adminOrders.find((o) => o.id === orderId);
    if (order) {
      order.review = body.action === "approve" ? "approved" : "rejected";
    }
    this.auditLogs.unshift({
      time: new Date().toISOString().slice(0, 16).replace("T", " "),
      actor: "owner",
      action: `order.${body.action}`,
      target: orderId
    });
    return {
      status: "ok",
      order_id: orderId,
      action: body.action,
      review: order?.review ?? body.action
    };
  }

  async listReports() {
    if (this.useDatabase()) {
      const reports = await this.prisma.safetyReport.findMany({
        orderBy: { createdAt: "desc" },
        take: 50
      });
      return {
        reports: reports.map((r) => ({
          id: r.publicId,
          target_type: r.targetType,
          target_id: r.targetPublicId,
          reason: r.reason,
          moderation_status: r.moderationStatus,
          created_at: r.createdAt.toISOString()
        }))
      };
    }
    return { reports: this.reports };
  }

  private page<T>(items: T[]): Page<T> {
    return { items, page_info: { next_cursor: null, has_next_page: false } };
  }

  private useDatabase() {
    return Boolean(process.env.DATABASE_URL);
  }

  private async demoUser() {
    return this.prisma.user.upsert({
      where: { publicId: "user_demo" },
      update: {},
      create: {
        publicId: "user_demo",
        displayName: "Quiet Helper",
        locale: "en",
        timezone: "America/Toronto",
        accountStatus: "registered",
        profile: {
          create: {
            publicId: "profile_demo",
            privacyMode: "private",
            quietRankingEnabled: true,
            themePreference: "system",
            notificationPreference: "daily"
          }
        }
      },
      include: { profile: true }
    });
  }

  private publicIdFromSlug(prefix: string, slug: string) {
    return `${prefix}_${slug.replaceAll("-", "_")}`;
  }

  private slugFromPublicId(prefix: string, publicId: string) {
    const marker = `${prefix}_`;
    return publicId.startsWith(marker) ? publicId.slice(marker.length).replaceAll("_", "-") : publicId;
  }

  private dateFromIsoDay(isoDay: string) {
    return new Date(`${isoDay}T00:00:00.000Z`);
  }

  private dateOnly(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private donationResponse(publicId: string, campaignId: string, amount: string, currency: string) {
    return {
      donation: {
        id: publicId,
        campaign_id: campaignId,
        amount,
        currency,
        payment_status: "pending",
        karma_points_awarded: 0
      },
      checkout: { url: `https://payments.example.test/checkout/${randomUUID()}` },
      transparency_note: "Donation support is separate from symbolic karma and does not buy luck, virtue, or guaranteed outcomes."
    };
  }
}
