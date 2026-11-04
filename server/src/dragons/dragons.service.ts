import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import type { Dragon, DragonSpecies } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { DragonDto } from './dto/dragon.dto.js';
import type { QueryDragonsDto } from './dto/query-dragons.dto.js';

type DragonWithSpecies = Dragon & { species: DragonSpecies };

const ORDER_BY: Record<string, Prisma.DragonOrderByWithRelationInput> = {
  rate_asc: { hourlyRate: 'asc' },
  rate_desc: { hourlyRate: 'desc' },
  load_desc: { maxLoadKg: 'desc' },
  name_asc: { name: 'asc' },
};

@Injectable()
export class DragonsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryDragonsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 12;
    const where = this.buildWhere(query);

    const [total, dragons] = await this.prisma.$transaction([
      this.prisma.dragon.count({ where }),
      this.prisma.dragon.findMany({
        where,
        include: { species: true },
        orderBy: ORDER_BY[query.sort ?? 'name_asc'],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items: dragons.map((dragon) => this.toDto(dragon, query.locale ?? 'pt')),
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: string, locale: 'pt' | 'en' = 'pt') {
    const dragon = await this.prisma.dragon.findUnique({
      where: { id },
      include: { species: true },
    });

    if (!dragon) {
      throw new NotFoundException(`Dragon ${id} not found`);
    }

    return this.toDto(dragon, locale);
  }

  private buildWhere(query: QueryDragonsDto): Prisma.DragonWhereInput {
    const where: Prisma.DragonWhereInput = {};

    if (query.species) where.species = { slug: query.species };
    if (query.temperament) where.temperament = query.temperament;
    if (query.riskLevel) where.maxRiskLevel = query.riskLevel;
    if (query.city) where.baseCity = { equals: query.city, mode: 'insensitive' };
    if (query.availability === 'available') where.status = 'AVAILABLE';
    if (query.minLoadKg !== undefined) where.maxLoadKg = { gte: query.minLoadKg };
    if (query.maxHourlyRate !== undefined) {
      where.hourlyRate = { lte: new Prisma.Decimal(query.maxHourlyRate) };
    }

    return where;
  }

  private toDto(dragon: DragonWithSpecies, locale: 'pt' | 'en'): DragonDto {
    return {
      id: dragon.id,
      name: dragon.name,
      age: dragon.age,
      weightKg: dragon.weightKg,
      maxLoadKg: dragon.maxLoadKg,
      passengerCapacity: dragon.passengerCapacity,
      flightSpeedKmH: dragon.flightSpeedKmH,
      flightRangeKm: dragon.flightRangeKm,
      hourlyRate: dragon.hourlyRate.toString(),
      restHours: dragon.restHours,
      healthScore: dragon.healthScore,
      traits: dragon.traits,
      imageUrl: dragon.imageUrl,
      temperament: dragon.temperament,
      maxRiskLevel: dragon.maxRiskLevel,
      status: dragon.status,
      baseCity: dragon.baseCity,
      species: {
        id: dragon.species.id,
        slug: dragon.species.slug,
        name: locale === 'pt' ? dragon.species.namePt : dragon.species.nameEn,
        description:
          locale === 'pt' ? dragon.species.descriptionPt : dragon.species.descriptionEn,
      },
    };
  }
}
