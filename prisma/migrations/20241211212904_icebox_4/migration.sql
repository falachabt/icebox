-- AlterTable
ALTER TABLE "Campus" ADD COLUMN     "imageKey" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
