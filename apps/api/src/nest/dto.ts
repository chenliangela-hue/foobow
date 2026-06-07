import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export const moods = ["calm", "heavy", "lonely", "grateful", "hopeful", "anxious"] as const;
export const visibilityValues = ["public", "friends_only", "anonymous", "private"] as const;
export const blessingVisibilityValues = ["anonymous", "public", "private"] as const;
export const deedStatuses = ["started", "completed"] as const;
export const donationCurrencies = ["USD", "CAD"] as const;

export class CheckinCreateDto {
  @ApiProperty({ enum: moods })
  @IsIn(moods)
  mood!: (typeof moods)[number];

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class DeedActionCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deed_type_id!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  map_spot_id?: string;

  @ApiProperty({ enum: deedStatuses })
  @IsIn(deedStatuses)
  status!: (typeof deedStatuses)[number];

  @ApiPropertyOptional({ enum: visibilityValues })
  @IsOptional()
  @IsIn(visibilityValues)
  visibility?: (typeof visibilityValues)[number];
}

export class BlessingCreateDto {
  @ApiProperty({ minLength: 1, maxLength: 140 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  body!: string;

  @ApiProperty({ enum: blessingVisibilityValues })
  @IsIn(blessingVisibilityValues)
  visibility!: (typeof blessingVisibilityValues)[number];
}

export class ReportCreateDto {
  @ApiProperty({ enum: ["profile", "blessing", "campaign", "deed_action", "group_mission"] })
  @IsIn(["profile", "blessing", "campaign", "deed_action", "group_mission"])
  target_type!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  target_id!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  reason!: string;
}

export class DonationCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  campaign_id!: string;

  @ApiProperty({ pattern: "^[0-9]+(\\.[0-9]{2})$" })
  @Matches(/^[0-9]+(\.[0-9]{2})$/)
  amount!: string;

  @ApiProperty({ enum: donationCurrencies })
  @IsIn(donationCurrencies)
  currency!: (typeof donationCurrencies)[number];
}
