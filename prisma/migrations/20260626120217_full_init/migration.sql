-- AlterTable
ALTER TABLE "User" ADD COLUMN "role" TEXT;

-- CreateTable
CREATE TABLE "Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isbn" TEXT NOT NULL,
    "title" TEXT
);

-- CreateTable
CREATE TABLE "BookUser" (
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "pagesRead" INTEGER,
    "readstreakEditDate" DATETIME,
    "startDate" DATETIME,
    "readDate" DATETIME,
    "rating" INTEGER,
    "ratingText" TEXT,

    PRIMARY KEY ("userId", "bookId"),
    CONSTRAINT "BookUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookUser_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
