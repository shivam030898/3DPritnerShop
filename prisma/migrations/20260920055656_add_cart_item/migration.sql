-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "configKey" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "slug" TEXT,
    "imageId" TEXT,
    "name" TEXT NOT NULL,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "fileType" TEXT,
    "statsJson" TEXT,
    "material" TEXT,
    "color" TEXT,
    "quality" TEXT,
    "sizeCm" REAL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_userId_configKey_key" ON "CartItem"("userId", "configKey");
