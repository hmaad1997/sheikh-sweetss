import { eq, and, gte, lte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, transactions, settings, authorizedUsers, accessLogs } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  role?: "owner" | "manager" | "employee";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(users).values({
    email: data.email,
    name: data.name,
    password: data.password,
    role: data.role || "employee",
  });
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserLastSignedIn(email: string) {
  const db = await getDb();
  if (!db) return null;

  return await db.update(users)
    .set({ lastSignedIn: new Date() })
    .where(eq(users.email, email));
}

export async function addTransaction(data: {
  date: Date;
  description: string;
  type: "revenue" | "expense";
  paymentMethod: "cash" | "click" | "visa" | "bank";
  amount: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(transactions).values({
    date: data.date,
    description: data.description,
    type: data.type,
    paymentMethod: data.paymentMethod,
    amount: data.amount,
    notes: data.notes,
  });
}

export async function getTransactionsByDate(date: Date) {
  const db = await getDb();
  if (!db) return [];
  
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return await db.select().from(transactions)
    .where(and(gte(transactions.date, startOfDay), lte(transactions.date, endOfDay)))
    .orderBy(desc(transactions.createdAt));
}

export async function getTransactionsByMonth(year: number, month: number) {
  const db = await getDb();
  if (!db) return [];
  
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  
  return await db.select().from(transactions)
    .where(and(gte(transactions.date, startDate), lte(transactions.date, endDate)))
    .orderBy(desc(transactions.date));
}

export async function getTransactionsByYear(year: number) {
  const db = await getDb();
  if (!db) return [];
  
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);
  
  return await db.select().from(transactions)
    .where(and(gte(transactions.date, startDate), lte(transactions.date, endDate)))
    .orderBy(desc(transactions.date));
}

export async function getAllTransactions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(transactions).orderBy(desc(transactions.date));
}

export async function getSettings() {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(settings).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function isUserAuthorized(email: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select().from(authorizedUsers)
    .where(and(eq(authorizedUsers.email, email), eq(authorizedUsers.isActive, true)))
    .limit(1);
  
  return result.length > 0;
}

export async function getAuthorizedUser(email: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(authorizedUsers)
    .where(eq(authorizedUsers.email, email))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function addAuthorizedUser(data: {
  email: string;
  name: string;
  role: "owner" | "manager" | "employee";
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(authorizedUsers).values(data);
}

export async function getAllAuthorizedUsers() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(authorizedUsers).orderBy(desc(authorizedUsers.createdAt));
}

export async function logAccessAttempt(data: {
  email: string;
  status: "allowed" | "denied";
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const db = await getDb();
  if (!db) return null;
  
  return await db.insert(accessLogs).values(data);
}

export async function getAccessLogs(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(accessLogs)
    .orderBy(desc(accessLogs.createdAt))
    .limit(limit);
}
