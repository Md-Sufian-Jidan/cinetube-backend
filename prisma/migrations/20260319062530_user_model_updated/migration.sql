-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
