import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  description: text("description").notNull(),
  type: mysqlEnum("type", ["revenue", "expense"]).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "click", "visa", "bank"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

export const settings = mysqlTable("settings", {
  id: int("id").autoincrement().primaryKey(),
  shopName: varchar("shopName", { length: 255 }).default("حلويات الشيخ").notNull(),
  whatsappNumber: varchar("whatsappNumber", { length: 20 }),
  enableNotifications: boolean("enableNotifications").default(true).notNull(),
});

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = typeof settings.$inferInsert;
