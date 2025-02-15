import { pgTable, text, serial, integer, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const farmers = pgTable("farmers", {
  id: serial("id").primaryKey(),
  fullName: text("nom_complet").notNull(),
  address: text("adresse").notNull(),
  phone: varchar("telephone", { length: 20 }).notNull(),
});

export const farms = pgTable("farms", {
  id: serial("id").primaryKey(),
  ownerId: integer("proprietaire_id").notNull().references(() => farmers.id),
  address: text("adresse").notNull(),
  zone: text("zone").notNull(),
  cowCount: integer("nombre_vaches").notNull().default(0),
});

export const cows = pgTable("cows", {
  nationalId: varchar("num_national", { length: 50 }).primaryKey(),
  ownerId: integer("proprietaire_id").notNull().references(() => farmers.id),
  farmId: integer("ferme_id").notNull().references(() => farms.id),
  breed: text("race").notNull(),
  birthDate: date("date_naissance").notNull(),
  lastCalvingDate: date("date_dernier_velage"),
  father: varchar("pere", { length: 50 }),
  mother: varchar("mere", { length: 50 }),
  origin: text("origine"),
  bullBreed: text("race_taureau"),
});

export const acts = pgTable("acts", {
  id: serial("id").primaryKey(),
  inseminationDate: date("date_insemination").notNull(),
  nationalId: varchar("num_national", { length: 50 }).notNull().references(() => cows.nationalId),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFarmerSchema = createInsertSchema(farmers);
export const insertFarmSchema = createInsertSchema(farms);
export const insertCowSchema = createInsertSchema(cows);
export const insertActSchema = createInsertSchema(acts);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Farmer = typeof farmers.$inferSelect;
export type InsertFarmer = z.infer<typeof insertFarmerSchema>;

export type Farm = typeof farms.$inferSelect;
export type InsertFarm = z.infer<typeof insertFarmSchema>;

export type Cow = typeof cows.$inferSelect;
export type InsertCow = z.infer<typeof insertCowSchema>;

export type Act = typeof acts.$inferSelect;
export type InsertAct = z.infer<typeof insertActSchema>;
