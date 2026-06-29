-- CreateTable
CREATE TABLE "ReadingActivity" (
    "userId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "pagesRead" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "date"),
    CONSTRAINT "ReadingActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
