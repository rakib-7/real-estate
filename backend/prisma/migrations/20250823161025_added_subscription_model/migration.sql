/*
  Warnings:

  - You are about to drop the column `propertyLimit` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "propertyLimit",
ADD COLUMN     "listingResetDate" TIMESTAMP(3),
ADD COLUMN     "subscription" "SubscriptionType" NOT NULL DEFAULT 'FREE';
