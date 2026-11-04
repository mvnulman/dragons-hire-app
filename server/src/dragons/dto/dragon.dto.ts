import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RiskLevel, Temperament } from '../../generated/prisma/enums.js';

export class DragonSpeciesDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'ember-drake' })
  slug!: string;

  @ApiProperty({ example: 'Draco Ígneo' })
  name!: string;

  @ApiProperty({ nullable: true, type: String })
  description!: string | null;
}

export class DragonDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Ignis' })
  name!: string;

  @ApiProperty({ example: 3 })
  age!: number;

  @ApiProperty({ example: 180 })
  weightKg!: number;

  @ApiProperty({ example: 120 })
  maxLoadKg!: number;

  @ApiProperty({ example: 1 })
  passengerCapacity!: number;

  @ApiProperty({ example: 90 })
  flightSpeedKmH!: number;

  @ApiProperty({ example: 400 })
  flightRangeKm!: number;

  @ApiProperty({ example: '180.00', description: 'Hourly rate in EUR' })
  hourlyRate!: string;

  @ApiProperty({ example: 3 })
  restHours!: number;

  @ApiProperty({ example: 96 })
  healthScore!: number;

  @ApiProperty({ type: [String], example: ['night-vision', 'fireproof'] })
  traits!: string[];

  @ApiProperty({ nullable: true, type: String })
  imageUrl!: string | null;

  @ApiProperty({ enum: Temperament })
  temperament!: Temperament;

  @ApiProperty({ enum: RiskLevel })
  maxRiskLevel!: RiskLevel;

  @ApiProperty({ example: 'AVAILABLE' })
  status!: string;

  @ApiProperty({ example: 'Porto' })
  baseCity!: string;

  @ApiProperty({ type: DragonSpeciesDto })
  species!: DragonSpeciesDto;
}

export class PaginatedDragonsDto {
  @ApiProperty({ type: [DragonDto] })
  items!: DragonDto[];

  @ApiProperty({ example: 10 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 12 })
  pageSize!: number;
}

export class DragonQueryDto {
  @ApiPropertyOptional({ enum: ['pt', 'en'], default: 'pt' })
  locale?: 'pt' | 'en';
}
