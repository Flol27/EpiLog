/*
  Warnings:

  - You are about to drop the column `readstreakEditDate` on the `BookUser` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `readstreak` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookUser" (
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "pagesRead" INTEGER,
    "startDate" DATETIME,
    "readDate" DATETIME,
    "rating" INTEGER,
    "ratingText" TEXT,

    PRIMARY KEY ("userId", "bookId"),
    CONSTRAINT "BookUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookUser_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BookUser" ("bookId", "pagesRead", "rating", "ratingText", "readDate", "startDate", "userId") SELECT "bookId", "pagesRead", "rating", "ratingText", "readDate", "startDate", "userId" FROM "BookUser";
DROP TABLE "BookUser";
ALTER TABLE "new_BookUser" RENAME TO "BookUser";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "firstname" TEXT NOT NULL,
    "lastname" TEXT,
    "readStreak" INTEGER NOT NULL DEFAULT 0,
    "readStreakUpdated" DATETIME,
    "profilePic" TEXT,
    "status" TEXT,
    "quote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("email", "firstname", "id", "lastname", "password", "profilePic", "quote", "role", "status", "username") SELECT "email", "firstname", "id", "lastname", "password", "profilePic", "quote", coalesce("role", 'user') AS "role", "status", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
