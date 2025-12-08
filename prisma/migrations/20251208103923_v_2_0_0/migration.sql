/*
  Warnings:

  - You are about to alter the column `amount` on the `Subscription` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to drop the column `customavatar` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAUSED');

-- AlterEnum
ALTER TYPE "BillingCycle" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "interval" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "reminderBefore" DROP NOT NULL,
ALTER COLUMN "reminderBefore" SET DEFAULT 3;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "customavatar";

-- CreateTable
CREATE TABLE "SubscriptionHistory" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plan" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL,
    "endedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reminderDaysBefore" INTEGER NOT NULL DEFAULT 3,
    "emailReminders" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubscriptionHistory_userId_endedAt_idx" ON "SubscriptionHistory"("userId", "endedAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_userId_key" ON "NotificationSettings"("userId");

-- CreateIndex
CREATE INDEX "Subscription_userId_nextBillingDate_idx" ON "Subscription"("userId", "nextBillingDate");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

-- AddForeignKey
ALTER TABLE "SubscriptionHistory" ADD CONSTRAINT "SubscriptionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionHistory" ADD CONSTRAINT "SubscriptionHistory_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
