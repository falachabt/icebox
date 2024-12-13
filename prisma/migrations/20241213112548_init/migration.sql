-- AlterTable
ALTER TABLE "_CampusToVotingSession" ADD CONSTRAINT "_CampusToVotingSession_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CampusToVotingSession_AB_unique";

-- AlterTable
ALTER TABLE "_CriterionToVotingSession" ADD CONSTRAINT "_CriterionToVotingSession_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CriterionToVotingSession_AB_unique";

-- AlterTable
ALTER TABLE "_SessionJury" ADD CONSTRAINT "_SessionJury_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_SessionJury_AB_unique";
