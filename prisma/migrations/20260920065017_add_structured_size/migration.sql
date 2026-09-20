/*
  Warnings:

  - You are about to drop the column `sizeCm` on the `CartItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN "depthMm" REAL;
ALTER TABLE "Order" ADD COLUMN "heightMm" REAL;
ALTER TABLE "Order" ADD COLUMN "sizeLabel" TEXT;
ALTER TABLE "Order" ADD COLUMN "widthMm" REAL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CartItem" (
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
    "sizeLabel" TEXT,
    "widthMm" REAL,
    "depthMm" REAL,
    "heightMm" REAL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CartItem" ("color", "configKey", "createdAt", "fileName", "fileType", "fileUrl", "id", "imageId", "material", "name", "quality", "quantity", "slug", "statsJson", "type", "unitPrice", "updatedAt", "userId") SELECT "color", "configKey", "createdAt", "fileName", "fileType", "fileUrl", "id", "imageId", "material", "name", "quality", "quantity", "slug", "statsJson", "type", "unitPrice", "updatedAt", "userId" FROM "CartItem";
DROP TABLE "CartItem";
ALTER TABLE "new_CartItem" RENAME TO "CartItem";
CREATE UNIQUE INDEX "CartItem_userId_configKey_key" ON "CartItem"("userId", "configKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
