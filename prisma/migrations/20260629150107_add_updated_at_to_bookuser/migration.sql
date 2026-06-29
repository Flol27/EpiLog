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
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "bookId"),
    CONSTRAINT "BookUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookUser_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BookUser" ("bookId", "pagesRead", "rating", "ratingText", "readDate", "startDate", "userId") SELECT "bookId", "pagesRead", "rating", "ratingText", "readDate", "startDate", "userId" FROM "BookUser";
DROP TABLE "BookUser";
ALTER TABLE "new_BookUser" RENAME TO "BookUser";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
