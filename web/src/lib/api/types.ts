export type Temperament = 'CALM' | 'FRIENDLY' | 'UNPREDICTABLE' | 'AGGRESSIVE';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export type DragonStatus =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'ON_MISSION'
  | 'RESTING'
  | 'IN_TRAINING'
  | 'INJURED'
  | 'UNAVAILABLE';

export type DragonSpecies = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

export type Dragon = {
  id: string;
  name: string;
  age: number;
  weightKg: number;
  maxLoadKg: number;
  passengerCapacity: number;
  flightSpeedKmH: number;
  flightRangeKm: number;
  hourlyRate: string;
  restHours: number;
  healthScore: number;
  traits: string[];
  imageUrl: string | null;
  temperament: Temperament;
  maxRiskLevel: RiskLevel;
  status: DragonStatus;
  baseCity: string;
  species: DragonSpecies;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
