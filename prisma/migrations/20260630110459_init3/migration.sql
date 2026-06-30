/*
  Warnings:

  - You are about to drop the column `rating` on the `BookUser` table. All the data in the column will be lost.
  - You are about to drop the column `ratingText` on the `BookUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN "totalPages" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookUser" (
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "pagesRead" INTEGER,
    "startDate" DATETIME,
    "readDate" DATETIME,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "bookId"),
    CONSTRAINT "BookUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookUser_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BookUser" ("bookId", "pagesRead", "readDate", "startDate", "updatedAt", "userId") SELECT "bookId", "pagesRead", "readDate", "startDate", "updatedAt", "userId" FROM "BookUser";
DROP TABLE "BookUser";
ALTER TABLE "new_BookUser" RENAME TO "BookUser";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
