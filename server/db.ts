import { eq, and, gte, lte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, transactions, settings, authorizedUsers, accessLogs } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
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
