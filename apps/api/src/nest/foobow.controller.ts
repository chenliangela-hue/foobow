import { Body, Controller, Get, Headers, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DevAuthGuard } from "./dev-auth.guard.js";
import {
  BlessingCreateDto,
  CheckinCreateDto,
  DeedActionCreateDto,
  DonationCreateDto,
  ReportCreateDto
} from "./dto.js";
import { FoobowService } from "./foobow.service.js";

@ApiTags("health")
@Controller()
export class HealthController {
  constructor(private readonly service: FoobowService) {}

  @Get("health")
  @ApiOperation({ summary: "Return API health metadata" })
  health() {
    return this.service.health();
  }
}

@ApiTags("discovery")
@Controller("api/v1")
export class DiscoveryController {
  constructor(private readonly service: FoobowService) {}

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
  constructor(private readonly service: FoobowService) {}

  @Get("me")
  me() {
    return this.service.me();
  }

  @Get("today")
  today() {
    return this.service.today();
  }
}

@ApiTags("ritual")
@ApiBearerAuth()
@UseGuards(DevAuthGuard)
@Controller("api/v1")
export class RitualController {
  constructor(private readonly service: FoobowService) {}

  @Post("checkins")
  createCheckin(@Body() body: CheckinCreateDto) {
    return this.service.createCheckin(body);
  }

  @Post("deed-actions")
  createDeedAction(@Body() body: DeedActionCreateDto) {
    return this.service.createDeedAction(body);
  }
}

@ApiTags("community")
@Controller("api/v1")
export class CommunityController {
  constructor(private readonly service: FoobowService) {}

  @Post("blessings")
  @ApiBearerAuth()
  @UseGuards(DevAuthGuard)
  createBlessing(@Body() body: BlessingCreateDto) {
    return this.service.createBlessing(body);
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
  constructor(private readonly service: FoobowService) {}

  @Post("donations")
  createDonation(@Headers("idempotency-key") idempotencyKey: string | undefined, @Body() body: DonationCreateDto) {
    return this.service.createDonation(idempotencyKey, body);
  }
}
