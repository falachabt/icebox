-- CreateTable
CREATE TABLE "ManualScore" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sessionId" TEXT NOT NULL,
    "campusId" TEXT NOT NULL,
    "criterionId" TEXT NOT NULL,

    CONSTRAINT "ManualScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManualScore_sessionId_campusId_criterionId_key" ON "ManualScore"("sessionId", "campusId", "criterionId");

-- AddForeignKey
ALTER TABLE "ManualScore" ADD CONSTRAINT "ManualScore_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VotingSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualScore" ADD CONSTRAINT "ManualScore_campusId_fkey" FOREIGN KEY ("campusId") REFERENCES "Campus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualScore" ADD CONSTRAINT "ManualScore_criterionId_fkey" FOREIGN KEY ("criterionId") REFERENCES "Criterion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
