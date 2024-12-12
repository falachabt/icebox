/*
  Warnings:

  - You are about to drop the column `campusId` on the `VotingSession` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "VotingSession" DROP CONSTRAINT "VotingSession_campusId_fkey";

-- AlterTable
ALTER TABLE "VotingSession" DROP COLUMN "campusId";

-- CreateTable
CREATE TABLE "_CampusToVotingSession" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CampusToVotingSession_AB_unique" ON "_CampusToVotingSession"("A", "B");

-- CreateIndex
CREATE INDEX "_CampusToVotingSession_B_index" ON "_CampusToVotingSession"("B");

-- AddForeignKey
ALTER TABLE "_CampusToVotingSession" ADD CONSTRAINT "_CampusToVotingSession_A_fkey" FOREIGN KEY ("A") REFERENCES "Campus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampusToVotingSession" ADD CONSTRAINT "_CampusToVotingSession_B_fkey" FOREIGN KEY ("B") REFERENCES "VotingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
