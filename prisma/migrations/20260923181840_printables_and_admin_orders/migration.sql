/*
  Warnings:

  - You are about to drop the `StatusEvent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN "modelSourceType" TEXT;
ALTER TABLE "CartItem" ADD COLUMN "notes" TEXT;
ALTER TABLE "CartItem" ADD COLUMN "printablesUrl" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StatusEvent";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "OrderStatusHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designId" TEXT,
    "productSlug" TEXT,
    "itemName" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "modelSourceType" TEXT,
    "printablesUrl" TEXT,
    "notes" TEXT,
    "material" TEXT,
    "color" TEXT,
    "quality" TEXT,
    "sizeLabel" TEXT,
    "widthMm" REAL,
    "depthMm" REAL,
    "heightMm" REAL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "shipping" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PAID',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "addressId" TEXT,
    "addressSnapshot" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("addressId", "addressSnapshot", "carrier", "color", "createdAt", "depthMm", "designId", "heightMm", "id", "itemName", "itemType", "material", "orderNumber", "paymentMethod", "paymentStatus", "productSlug", "quality", "quantity", "shipping", "sizeLabel", "subtotal", "total", "trackingNumber", "unitPrice", "userId", "widthMm") SELECT "addressId", "addressSnapshot", "carrier", "color", "createdAt", "depthMm", "designId", "heightMm", "id", "itemName", "itemType", "material", "orderNumber", "paymentMethod", "paymentStatus", "productSlug", "quality", "quantity", "shipping", "sizeLabel", "subtotal", "total", "trackingNumber", "unitPrice", "userId", "widthMm" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "emailVerified", "id", "image", "name", "passwordHash", "phone") SELECT "createdAt", "email", "emailVerified", "id", "image", "name", "passwordHash", "phone" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
