import { Body, Controller, Get, Headers, Inject, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DevAuthGuard } from "./dev-auth.guard.js";
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
import { FoobowService } from "./foobow.service.js";

@ApiTags("health")
@Controller()
export class HealthController {
  constructor(@Inject(FoobowService) private readonly service: FoobowService) {}

  @Get("health")
  @ApiOperation({ summary: "Return API health metadata" })
  health() {
    return this.service.health();
  }
}

@ApiTags("discovery")
@Controller("api/v1")
export class DiscoveryController {
  constructor(@Inject(FoobowService) private readonly service: FoobowService) {}

  @Get("deed-types")
  listDeedTypes(@Query("category") category?: string) {
    return this.service.listDeedTypes(category);
  }

  @Get("map-spots")
  listMapSpots(@Query("category") category?: string, @Query("region") region?: string) {
    return this.service.listMapSpots(category, region);
  }

  @Get("donation-campaigns")
  listDonationCampaigns() {
    return this.service.listDonationCampaigns();
  }

  @Get("blessings")
  listBlessings() {
    return this.service.listBlessings();
  }
}

@ApiTags("account")
@ApiBearerAuth()
@UseGuards(DevAuthGuard)
@Controller("api/v1")
export class AccountController {
  constructor(@Inject(FoobowService) private readonly service: FoobowService) {}

  @Get("me")
  me() {
    return this.service.me();
  }

  @Get("today")
  today() {
    return this.service.today();
  }

  @Post("sync")
  sync(@Body() body: SyncDto) {
    return this.service.sync(body);
  }
}

@ApiTags("ritual")
@ApiBearerAuth()
@UseGuards(DevAuthGuard)
@Controller("api/v1")
export class RitualController {
  constructor(@Inject(FoobowService) private readonly service: FoobowService) {}

  @Post("checkins")
  createCheckin(@Body() body: CheckinCreateDto) {
    return this.service.createCheckin(body);
  }

  @Post("deed-actions")
  createDeedAction(@Body() body: DeedActionCreateDto) {
    return this.service.createDeedAction(body);
  }

  @Post("focus-sessions")
  startFocusSession(@Body() body: FocusSessionStartDto) {
    return this.service.startFocusSession(body);
  }

  @Post("focus-sessions/:id/complete")
  completeFocusSession(
    @Param("id") id: string,
    @Body() body: FocusSessionCompleteDto,
    @Headers("idempotency-key") idempotencyKey?: string
  ) {
    return this.service.completeFocusSession(id, body, idempotencyKey);
  }
}

@ApiTags("community")
@Controller("api/v1")
export class CommunityController {
  constructor(@Inject(FoobowService) private readonly service: FoobowService) {}

  @Post("blessings")
  @ApiBearerAuth()
  @UseGuards(DevAuthGuard)
  createBlessing(@Body() body: BlessingCreateDto) {
    return this.service.createBlessing(body);
  }

  @Post("blessings/intentions")
  createBlessingIntention(@Body() body: BlessingIntentionCreateDto) {
    return this.service.createBlessingIntention(body);
  }

  @Post("reports")
  @ApiBearerAuth()
  @UseGuards(DevAuthGuard)
  createReport(@Body() body: ReportCreateDto) {
    return this.service.createReport(body);
  }
}

@ApiTags("donations")
@ApiBearerAuth()
@UseGuards(DevAuthGuard)
@Controller("api/v1")
export class DonationController {
  constructor(@Inject(FoobowService) private readonly service: FoobowService) {}

  @Post("donations")
  createDonation(@Headers("idempotency-key") idempotencyKey: string | undefined, @Body() body: DonationCreateDto) {
    return this.service.createDonation(idempotencyKey, body);
  }
}

@ApiTags("webhooks")
@Controller("api/v1/webhooks")
export class WebhookController {
  constructor(@Inject(FoobowService) private readonly service: FoobowService) {}

  @Post("stripe")
  stripeWebhook(@Headers("stripe-signature") signature: string | undefined, @Body() body: any) {
    return this.service.handleStripeWebhook(signature, body);
  }
}

@ApiTags("admin")
@Controller()
export class AdminController {
  constructor(@Inject(FoobowService) private readonly service: FoobowService) {}

  @Get("admin/overview")
  @Get("api/v1/admin/overview")
  adminOverview() {
    return this.service.adminOverview();
  }

  @Post("admin/orders/:id/action")
  @Post("api/v1/admin/orders/:id/action")
  moderateOrder(@Param("id") id: string, @Body() body: OrderActionDto) {
    return this.service.moderateOrder(id, body);
  }

  @Get("admin/moderation")
  @Get("api/v1/admin/moderation")
  listReports() {
    return this.service.listReports();
  }
}
