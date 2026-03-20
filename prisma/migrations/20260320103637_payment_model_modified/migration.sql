/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "transactionId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactionId_key" ON "payment"("transactionId");
