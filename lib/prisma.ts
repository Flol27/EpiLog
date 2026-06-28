import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

// Sicherstellen, dass wir nicht den String "undefined" bauen.
// Fallback direkt auf deine echte SQLite-Datei, falls die ENV (noch) leer ist.
const connectionString = process.env.DATABASE_URL || "file:./epilog.sqlite";

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };