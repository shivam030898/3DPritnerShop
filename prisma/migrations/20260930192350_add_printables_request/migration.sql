-- CreateTable
CREATE TABLE "PrintablesRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrintablesRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrintablesRequest" ADD CONSTRAINT "PrintablesRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
