import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import type { RiskLevel, Temperament } from '../src/generated/prisma/enums.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required to seed the database');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const species = [
  {
    id: 'species_ember_drake',
    slug: 'ember-drake',
    nameEn: 'Ember Drake',
    namePt: 'Draco Ígneo',
    descriptionEn:
      'Small, nimble and warm-blooded. The courier of choice for short, high-value runs.',
    descriptionPt:
      'Pequeno, ágil e de sangue quente. O mensageiro preferido para entregas curtas e valiosas.',
  },
  {
    id: 'species_storm_wyrm',
    slug: 'storm-wyrm',
    nameEn: 'Storm Wyrm',
    namePt: 'Serpe da Tempestade',
    descriptionEn:
      'Long wings and a taste for altitude. Built for distance, patrol and rescue.',
    descriptionPt:
      'Asas longas e apreço por altitude. Feita para distância, patrulha e resgate.',
  },
  {
    id: 'species_iron_behemoth',
    slug: 'iron-behemoth',
    nameEn: 'Iron Behemoth',
    namePt: 'Beemote de Ferro',
    descriptionEn:
      'Slow to anger and slower to turn. Moves freight no other dragon can lift.',
    descriptionPt:
      'Difícil de irritar e ainda mais de manobrar. Carrega o que nenhum outro dragão levanta.',
  },
];

type SeedDragon = {
  id: string;
  name: string;
  speciesId: string;
  age: number;
  weightKg: number;
  maxLoadKg: number;
  passengerCapacity: number;
  flightSpeedKmH: number;
  flightRangeKm: number;
  hourlyRate: string;
  restHours: number;
  healthScore: number;
  temperament: Temperament;
  maxRiskLevel: RiskLevel;
  baseCity: string;
  baseLat: number;
  baseLng: number;
  traits: string[];
};

const dragons: SeedDragon[] = [
  {
    id: 'dragon_ignis',
    name: 'Ignis',
    speciesId: 'species_ember_drake',
    age: 3,
    weightKg: 180,
    maxLoadKg: 120,
    passengerCapacity: 1,
    flightSpeedKmH: 90,
    flightRangeKm: 400,
    hourlyRate: '180.00',
    restHours: 3,
    healthScore: 96,
    temperament: 'CALM',
    maxRiskLevel: 'LOW',
    baseCity: 'Porto',
    baseLat: 41.1579,
    baseLng: -8.6291,
    traits: ['night-vision', 'fireproof', 'gentle'],
  },
  {
    id: 'dragon_cinder',
    name: 'Cinder',
    speciesId: 'species_ember_drake',
    age: 4,
    weightKg: 240,
    maxLoadKg: 160,
    passengerCapacity: 2,
    flightSpeedKmH: 80,
    flightRangeKm: 550,
    hourlyRate: '150.00',
    restHours: 4,
    healthScore: 88,
    temperament: 'FRIENDLY',
    maxRiskLevel: 'LOW',
    baseCity: 'Porto',
    baseLat: 41.1579,
    baseLng: -8.6291,
    traits: ['night-vision', 'sociable'],
  },
  {
    id: 'dragon_pyrrha',
    name: 'Pyrrha',
    speciesId: 'species_ember_drake',
    age: 6,
    weightKg: 320,
    maxLoadKg: 210,
    passengerCapacity: 2,
    flightSpeedKmH: 85,
    flightRangeKm: 700,
    hourlyRate: '210.00',
    restHours: 5,
    healthScore: 74,
    temperament: 'UNPREDICTABLE',
    maxRiskLevel: 'MEDIUM',
    baseCity: 'Lisboa',
    baseLat: 38.7223,
    baseLng: -9.1393,
    traits: ['fireproof', 'hot-headed'],
  },
  {
    id: 'dragon_tempest',
    name: 'Tempest',
    speciesId: 'species_storm_wyrm',
    age: 9,
    weightKg: 900,
    maxLoadKg: 350,
    passengerCapacity: 3,
    flightSpeedKmH: 140,
    flightRangeKm: 1800,
    hourlyRate: '480.00',
    restHours: 6,
    healthScore: 91,
    temperament: 'CALM',
    maxRiskLevel: 'HIGH',
    baseCity: 'Lisboa',
    baseLat: 38.7223,
    baseLng: -9.1393,
    traits: ['storm-proof', 'long-range', 'night-vision'],
  },
  {
    id: 'dragon_zephyr',
    name: 'Zephyr',
    speciesId: 'species_storm_wyrm',
    age: 5,
    weightKg: 620,
    maxLoadKg: 280,
    passengerCapacity: 2,
    flightSpeedKmH: 130,
    flightRangeKm: 1500,
    hourlyRate: '390.00',
    restHours: 5,
    healthScore: 85,
    temperament: 'FRIENDLY',
    maxRiskLevel: 'MEDIUM',
    baseCity: 'Porto',
    baseLat: 41.1579,
    baseLng: -8.6291,
    traits: ['long-range', 'sociable'],
  },
  {
    id: 'dragon_nimbus',
    name: 'Nimbus',
    speciesId: 'species_storm_wyrm',
    age: 11,
    weightKg: 1100,
    maxLoadKg: 420,
    passengerCapacity: 4,
    flightSpeedKmH: 120,
    flightRangeKm: 2100,
    hourlyRate: '520.00',
    restHours: 7,
    healthScore: 68,
    temperament: 'UNPREDICTABLE',
    maxRiskLevel: 'HIGH',
    baseCity: 'Madrid',
    baseLat: 40.4168,
    baseLng: -3.7038,
    traits: ['storm-proof', 'long-range'],
  },
  {
    id: 'dragon_ferrum',
    name: 'Ferrum',
    speciesId: 'species_iron_behemoth',
    age: 14,
    weightKg: 4200,
    maxLoadKg: 2600,
    passengerCapacity: 0,
    flightSpeedKmH: 55,
    flightRangeKm: 900,
    hourlyRate: '610.00',
    restHours: 10,
    healthScore: 94,
    temperament: 'CALM',
    maxRiskLevel: 'HIGH',
    baseCity: 'Madrid',
    baseLat: 40.4168,
    baseLng: -3.7038,
    traits: ['heavy-lift', 'fireproof'],
  },
  {
    id: 'dragon_bastion',
    name: 'Bastion',
    speciesId: 'species_iron_behemoth',
    age: 18,
    weightKg: 5100,
    maxLoadKg: 3400,
    passengerCapacity: 0,
    flightSpeedKmH: 45,
    flightRangeKm: 1100,
    hourlyRate: '720.00',
    restHours: 12,
    healthScore: 82,
    temperament: 'FRIENDLY',
    maxRiskLevel: 'EXTREME',
    baseCity: 'Madrid',
    baseLat: 40.4168,
    baseLng: -3.7038,
    traits: ['heavy-lift', 'armored'],
  },
  {
    id: 'dragon_talos',
    name: 'Talos',
    speciesId: 'species_iron_behemoth',
    age: 12,
    weightKg: 3800,
    maxLoadKg: 2200,
    passengerCapacity: 0,
    flightSpeedKmH: 60,
    flightRangeKm: 800,
    hourlyRate: '540.00',
    restHours: 10,
    healthScore: 61,
    temperament: 'AGGRESSIVE',
    maxRiskLevel: 'EXTREME',
    baseCity: 'Porto',
    baseLat: 41.1579,
    baseLng: -8.6291,
    traits: ['heavy-lift', 'armored'],
  },
  {
    id: 'dragon_vesper',
    name: 'Vesper',
    speciesId: 'species_storm_wyrm',
    age: 7,
    weightKg: 780,
    maxLoadKg: 300,
    passengerCapacity: 1,
    flightSpeedKmH: 150,
    flightRangeKm: 1600,
    hourlyRate: '450.00',
    restHours: 6,
    healthScore: 57,
    temperament: 'AGGRESSIVE',
    maxRiskLevel: 'EXTREME',
    baseCity: 'Lisboa',
    baseLat: 38.7223,
    baseLng: -9.1393,
    traits: ['storm-proof', 'night-vision'],
  },
];

async function main() {
  for (const entry of species) {
    await prisma.dragonSpecies.upsert({
      where: { id: entry.id },
      update: entry,
      create: entry,
    });
  }

  for (const entry of dragons) {
    const imageUrl = `/dragons/${entry.id.replace('dragon_', '')}.jpg`;

    await prisma.dragon.upsert({
      where: { id: entry.id },
      update: { ...entry, imageUrl },
      create: { ...entry, imageUrl },
    });
  }

  const restingUntil = new Date(Date.now() + 1000 * 60 * 60 * 24);
  await prisma.dragonUnavailability.upsert({
    where: { id: 'unavailability_vesper_rest' },
    update: { endAt: restingUntil },
    create: {
      id: 'unavailability_vesper_rest',
      dragonId: 'dragon_vesper',
      startAt: new Date(),
      endAt: restingUntil,
      reason: 'REST',
      notes: 'Recovering from a high-altitude patrol.',
    },
  });

  console.log(`Seeded ${species.length} species and ${dragons.length} dragons.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
