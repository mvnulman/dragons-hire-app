-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "DragonStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'ON_MISSION', 'RESTING', 'IN_TRAINING', 'INJURED', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "Temperament" AS ENUM ('CALM', 'FRIENDLY', 'UNPREDICTABLE', 'AGGRESSIVE');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'EXTREME');

-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('TRANSPORT', 'CARGO', 'PATROL', 'EXPLORATION', 'RESCUE', 'CEREMONIAL');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('DRAFT', 'PENDING', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CargoType" AS ENUM ('NONE', 'GOODS', 'LIVESTOCK', 'VALUABLES', 'HAZARDOUS', 'PASSENGERS');

-- CreateEnum
CREATE TYPE "UnavailabilityReason" AS ENUM ('REST', 'INJURY', 'TRAINING', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dragon_species" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "namePt" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionPt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dragon_species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dragon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weightKg" INTEGER NOT NULL,
    "maxLoadKg" INTEGER NOT NULL,
    "passengerCapacity" INTEGER NOT NULL DEFAULT 1,
    "flightSpeedKmH" INTEGER NOT NULL,
    "flightRangeKm" INTEGER NOT NULL,
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "restHours" INTEGER NOT NULL DEFAULT 4,
    "healthScore" INTEGER NOT NULL DEFAULT 100,
    "traits" TEXT[],
    "imageUrl" TEXT,
    "temperament" "Temperament" NOT NULL,
    "maxRiskLevel" "RiskLevel" NOT NULL,
    "status" "DragonStatus" NOT NULL DEFAULT 'AVAILABLE',
    "baseCity" TEXT NOT NULL,
    "baseLat" DOUBLE PRECISION NOT NULL,
    "baseLng" DOUBLE PRECISION NOT NULL,
    "speciesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dragon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dragon_unavailability" (
    "id" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "reason" "UnavailabilityReason" NOT NULL,
    "notes" TEXT,
    "dragonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dragon_unavailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "MissionType" NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "status" "MissionStatus" NOT NULL DEFAULT 'DRAFT',
    "loadWeightKg" INTEGER,
    "passengerCount" INTEGER NOT NULL DEFAULT 0,
    "cargoType" "CargoType" NOT NULL DEFAULT 'NONE',
    "originName" TEXT NOT NULL,
    "originLat" DOUBLE PRECISION NOT NULL,
    "originLng" DOUBLE PRECISION NOT NULL,
    "destinationName" TEXT NOT NULL,
    "destinationLat" DOUBLE PRECISION NOT NULL,
    "destinationLng" DOUBLE PRECISION NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "hourlyRateSnapshot" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "holdExpiresAt" TIMESTAMP(3),
    "cancelledReason" TEXT,
    "missionId" TEXT NOT NULL,
    "dragonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "bookingId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "dragon_species_slug_key" ON "dragon_species"("slug");

-- CreateIndex
CREATE INDEX "dragon_speciesId_idx" ON "dragon"("speciesId");

-- CreateIndex
CREATE INDEX "dragon_status_idx" ON "dragon"("status");

-- CreateIndex
CREATE INDEX "dragon_unavailability_dragonId_startAt_endAt_idx" ON "dragon_unavailability"("dragonId", "startAt", "endAt");

-- CreateIndex
CREATE INDEX "mission_userId_idx" ON "mission"("userId");

-- CreateIndex
CREATE INDEX "mission_status_idx" ON "mission"("status");

-- CreateIndex
CREATE INDEX "mission_startAt_endAt_idx" ON "mission"("startAt", "endAt");

-- CreateIndex
CREATE INDEX "booking_dragonId_idx" ON "booking"("dragonId");

-- CreateIndex
CREATE INDEX "booking_missionId_idx" ON "booking"("missionId");

-- CreateIndex
CREATE INDEX "booking_status_holdExpiresAt_idx" ON "booking"("status", "holdExpiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "booking_missionId_dragonId_key" ON "booking"("missionId", "dragonId");

-- CreateIndex
CREATE UNIQUE INDEX "review_bookingId_key" ON "review"("bookingId");

-- CreateIndex
CREATE INDEX "review_authorId_idx" ON "review"("authorId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dragon" ADD CONSTRAINT "dragon_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "dragon_species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dragon_unavailability" ADD CONSTRAINT "dragon_unavailability_dragonId_fkey" FOREIGN KEY ("dragonId") REFERENCES "dragon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_dragonId_fkey" FOREIGN KEY ("dragonId") REFERENCES "dragon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

