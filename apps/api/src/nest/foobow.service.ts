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

  me() {
    return {
      user: { id: "user_demo", account_status: "registered", locale: "en", timezone: "America/Toronto" },
      profile: { id: "profile_demo", display_name: "Quiet Helper", privacy_mode: "private", quiet_ranking_enabled: true },
      subscription: { plan: "free", status: "active", ads_enabled: true }
    };
  }

  today() {
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

  createBlessing(body: BlessingCreateDto) {
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

  createCheckin(body: CheckinCreateDto) {
    const checkedInOn = new Date().toISOString().slice(0, 10);
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

  createDeedAction(body: DeedActionCreateDto) {
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

  createDonation(idempotencyKey: string | undefined, body: DonationCreateDto) {
    if (!idempotencyKey) {
      throw new UnprocessableEntityException("Donation creation requires an Idempotency-Key header.");
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

  createReport(body: ReportCreateDto) {
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

  private publicIdFromSlug(prefix: string, slug: string) {
    return `${prefix}_${slug.replaceAll("-", "_")}`;
  }
}
