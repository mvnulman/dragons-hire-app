import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { RiskLevel, Temperament } from '../../generated/prisma/enums.js';

export const DRAGON_SORTS = ['rate_asc', 'rate_desc', 'load_desc', 'name_asc'] as const;
export type DragonSort = (typeof DRAGON_SORTS)[number];

export class QueryDragonsDto {
  @ApiPropertyOptional({ enum: ['pt', 'en'], default: 'pt' })
  @IsOptional()
  @IsIn(['pt', 'en'])
  locale?: 'pt' | 'en';

  @ApiPropertyOptional({ example: 'ember-drake' })
  @IsOptional()
  @IsString()
  species?: string;

  @ApiPropertyOptional({ enum: Temperament })
  @IsOptional()
  @IsEnum(Temperament)
  temperament?: Temperament;

  @ApiPropertyOptional({ enum: RiskLevel, description: 'Minimum risk level the dragon must tolerate' })
  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minLoadKg?: number;

  @ApiPropertyOptional({ example: 400 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxHourlyRate?: number;

  @ApiPropertyOptional({ example: 'Porto' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'available', description: 'Only dragons currently AVAILABLE' })
  @IsOptional()
  @IsIn(['any', 'available'])
  availability?: 'any' | 'available';

  @ApiPropertyOptional({ enum: DRAGON_SORTS, default: 'name_asc' })
  @IsOptional()
  @IsIn(DRAGON_SORTS)
  sort?: DragonSort;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 12, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize?: number;
}
