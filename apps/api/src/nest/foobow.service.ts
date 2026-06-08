import { ConflictException, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  BlessingCreateDto,
  CheckinCreateDto,
  DeedActionCreateDto,
  DonationCreateDto,
  ReportCreateDto
} from "./dto.js";
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

  constructor(private readonly prisma: PrismaService) {}

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
            completedAt: body.status === "completed" ? new Date() : null
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

    return {
      report: {
        id: `report_${randomUUID()}`,
        target_type: body.target_type,
        target_id: body.target_id,
        reason: body.reason,
        moderation_status: "open",
        created_at: new Date().toISOString()
      }
    };
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
