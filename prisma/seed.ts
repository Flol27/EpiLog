import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
// @ts-ignore
import { PrismaClient } from "../generated/prisma/client.js";
import * as argon2 from "argon2";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter } as any);

const FIRST_NAMES = [
  "Max", "Lena", "Felix", "Sophie", "Jonas", "Laura", "Tim", "Anna", "Paul", "Emma",
  "Luis", "Mia", "Noah", "Hannah", "Leon", "Sara", "Elias", "Leonie", "Finn", "Klara",
  "Ben", "Marie", "Jan", "Lea", "Lukas", "Nina", "David", "Julia", "Tom", "Lara",
  "Niklas", "Amelie", "Moritz", "Johanna", "Philipp", "Charlotte", "Simon", "Pia", "Jakob", "Frieda",
  "Vincent", "Greta", "Henry", "Ida", "Oskar", "Mathilda", "Anton", "Clara", "Theo", "Romy",
];

const LAST_NAMES = [
  "Mueller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann",
  "Koch", "Bauer", "Richter", "Klein", "Wolf", "Schroeder", "Neumann", "Schwarz", "Zimmermann", "Braun",
  "Krueger", "Hofmann", "Hartmann", "Lange", "Schmitt", "Werner", "Krause", "Meier", "Lehmann", "Schmid",
  "Schulze", "Maier", "Koehler", "Herrmann", "Koenig", "Walter", "Mayer", "Huber", "Kaiser", "Fuchs",
];

const TEST_BOOKS = [
  { isbn: "9780747532743", title: "Harry Potter and the Philosopher's Stone" },
  { isbn: "9780261103573", title: "The Lord of the Rings" },
  { isbn: "9780743273565", title: "The Great Gatsby" },
  { isbn: "9780062315007", title: "The Alchemist" },
  { isbn: "9780141439518", title: "Pride and Prejudice" },
];

const TOTAL_USERS = 500;

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log(`Seeding database with ${TOTAL_USERS} users...`);

  // Hash one password for all test users (much faster than hashing 500 times)
  const sharedHash = await argon2.hash("Test1234!");
  const adminHash = await argon2.hash("admin");

  const createdUsers: any[] = [];

  // Admin first
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      firstname: "Admin", lastname: null, username: "admin",
      email: "admin@example.com", password: adminHash, role: "admin",
      readStreak: 0, status: "Admin account",
    },
  });
  createdUsers.push(admin);

  // Generate unique usernames/emails
  const usedUsernames = new Set<string>(["admin"]);
  const usedEmails = new Set<string>(["admin@example.com"]);

  let created = 0;
  let attempts = 0;
  while (created < TOTAL_USERS && attempts < TOTAL_USERS * 5) {
    attempts++;
    const first = rand(FIRST_NAMES);
    const last = rand(LAST_NAMES);
    const num = Math.floor(Math.random() * 9999);
    const username = `${first.toLowerCase()}${last.toLowerCase()}${num}`;
    const email = `${username}@example.com`;

    if (usedUsernames.has(username) || usedEmails.has(email)) continue;
    usedUsernames.add(username);
    usedEmails.add(email);

    const user = await prisma.user.create({
      data: {
        firstname: first,
        lastname: last,
        username,
        email,
        password: sharedHash,
        role: "user",
        readStreak: Math.floor(Math.random() * 60),
        status: `Hi, I'm ${first}! I love reading.`,
        quote: Math.random() > 0.5 ? "A reader lives a thousand lives before he dies." : null,
      },
    });
    createdUsers.push(user);
    created++;

    if (created % 50 === 0) console.log(`  ${created} / ${TOTAL_USERS} users created...`);
  }

  // Create books
  const createdBooks: any[] = [];
  for (const b of TEST_BOOKS) {
    const book = await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {},
      create: { isbn: b.isbn, title: b.title },
    });
    createdBooks.push(book);
  }
  console.log(`  ${createdBooks.length} books created`);

  // Give the first 100 users some books on their shelf
  const normalUsers = createdUsers.filter((u: any) => u.role === "user");
  for (let i = 0; i < Math.min(100, normalUsers.length); i++) {
    const user = normalUsers[i];
    const count = (i % 3) + 1;
    for (let j = 0; j < count; j++) {
      const book = createdBooks[(i + j) % createdBooks.length];
      await prisma.bookUser.upsert({
        where: { userId_bookId: { userId: user.id, bookId: book.id } },
        update: {},
        create: { userId: user.id, bookId: book.id, pagesRead: Math.floor(Math.random() * 150) },
      }).catch(() => {});
    }
  }
  console.log("  Shelves populated for first 100 users");

  // Random friendships among first 50 users
  let friendCount = 0;
  for (let i = 0; i < 50; i++) {
    const numFriends = Math.floor(Math.random() * 5);
    for (let j = 0; j < numFriends; j++) {
      const target = normalUsers[Math.floor(Math.random() * 50)];
      if (target && target.id !== normalUsers[i].id) {
        await prisma.friendship.upsert({
          where: { fromId_toId: { fromId: normalUsers[i].id, toId: target.id } },
          update: {},
          create: { fromId: normalUsers[i].id, toId: target.id },
        }).catch(() => {});
        friendCount++;
      }
    }
  }
  console.log(`  ~${friendCount} friendships created`);

  console.log("\nSeed complete!");
  console.log(`  ${createdUsers.length} users total | ${createdBooks.length} books`);
  console.log("\nLogin: admin / admin");
  console.log("All other users: password = Test1234!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
