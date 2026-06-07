import { Module } from "@nestjs/common";
import {
  AccountController,
  CommunityController,
  DiscoveryController,
  DonationController,
  HealthController,
  RitualController
} from "./foobow.controller.js";
import { FoobowService } from "./foobow.service.js";
import { PrismaService } from "./prisma.service.js";

@Module({
  controllers: [
    HealthController,
    DiscoveryController,
    AccountController,
    RitualController,
    CommunityController,
    DonationController
  ],
  providers: [FoobowService, PrismaService]
})
export class AppModule {}
