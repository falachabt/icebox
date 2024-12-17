/*
  Warnings:

  - You are about to drop the column `showResult` on the `VotingSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VotingSession" DROP COLUMN "showResult",
ADD COLUMN     "showResults" BOOLEAN NOT NULL DEFAULT true;
