-- CreateTable
CREATE TABLE "AllowedEmails" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "allowedCodeId" TEXT NOT NULL,

    CONSTRAINT "AllowedEmails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AddAllowEmailCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "AddAllowEmailCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AllowedEmails" ADD CONSTRAINT "AllowedEmails_allowedCodeId_fkey" FOREIGN KEY ("allowedCodeId") REFERENCES "AddAllowEmailCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
