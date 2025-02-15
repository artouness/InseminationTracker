import { type InsertUser, type User, type Farmer, type InsertFarmer, type Farm, type InsertFarm, type Cow, type InsertCow, type Act, type InsertAct } from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Farmers
  getFarmers(): Promise<Farmer[]>;
  getFarmer(id: number): Promise<Farmer | undefined>;
  createFarmer(farmer: InsertFarmer): Promise<Farmer>;
  updateFarmer(id: number, farmer: Partial<InsertFarmer>): Promise<Farmer>;
  deleteFarmer(id: number): Promise<void>;

  // Farms
  getFarms(ownerId?: number): Promise<Farm[]>;
  getFarm(id: number): Promise<Farm | undefined>;
  createFarm(farm: InsertFarm): Promise<Farm>;
  updateFarm(id: number, farm: Partial<InsertFarm>): Promise<Farm>;
  deleteFarm(id: number): Promise<void>;

  // Cows
  getCows(ownerId?: number): Promise<Cow[]>;
  getCow(nationalId: string): Promise<Cow | undefined>;
  createCow(cow: InsertCow): Promise<Cow>;
  updateCow(nationalId: string, cow: Partial<InsertCow>): Promise<Cow>;
  deleteCow(nationalId: string): Promise<void>;

  // Acts
  getActs(nationalId?: string): Promise<Act[]>;
  getAct(id: number): Promise<Act | undefined>;
  createAct(act: InsertAct): Promise<Act>;
  deleteAct(id: number): Promise<void>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Farmers
  async getFarmers(): Promise<Farmer[]> {
    return await db.select().from(farmers);
  }

  async getFarmer(id: number): Promise<Farmer | undefined> {
    const [farmer] = await db.select().from(farmers).where(eq(farmers.id, id));
    return farmer;
  }

  async createFarmer(farmer: InsertFarmer): Promise<Farmer> {
    const [newFarmer] = await db.insert(farmers).values(farmer).returning();
    return newFarmer;
  }

  async updateFarmer(id: number, farmer: Partial<InsertFarmer>): Promise<Farmer> {
    const [updatedFarmer] = await db
      .update(farmers)
      .set(farmer)
      .where(eq(farmers.id, id))
      .returning();
    return updatedFarmer;
  }

  async deleteFarmer(id: number): Promise<void> {
    await db.delete(farmers).where(eq(farmers.id, id));
  }

  // Farms
  async getFarms(ownerId?: number): Promise<Farm[]> {
    if (ownerId) {
      return await db.select().from(farms).where(eq(farms.ownerId, ownerId));
    }
    return await db.select().from(farms);
  }

  async getFarm(id: number): Promise<Farm | undefined> {
    const [farm] = await db.select().from(farms).where(eq(farms.id, id));
    return farm;
  }

  async createFarm(farm: InsertFarm): Promise<Farm> {
    const [newFarm] = await db.insert(farms).values(farm).returning();
    return newFarm;
  }

  async updateFarm(id: number, farm: Partial<InsertFarm>): Promise<Farm> {
    const [updatedFarm] = await db
      .update(farms)
      .set(farm)
      .where(eq(farms.id, id))
      .returning();
    return updatedFarm;
  }

  async deleteFarm(id: number): Promise<void> {
    await db.delete(farms).where(eq(farms.id, id));
  }

  // Cows
  async getCows(ownerId?: number): Promise<Cow[]> {
    if (ownerId) {
      return await db.select().from(cows).where(eq(cows.ownerId, ownerId));
    }
    return await db.select().from(cows);
  }

  async getCow(nationalId: string): Promise<Cow | undefined> {
    const [cow] = await db.select().from(cows).where(eq(cows.nationalId, nationalId));
    return cow;
  }

  async createCow(cow: InsertCow): Promise<Cow> {
    const [newCow] = await db.insert(cows).values(cow).returning();
    return newCow;
  }

  async updateCow(nationalId: string, cow: Partial<InsertCow>): Promise<Cow> {
    const [updatedCow] = await db
      .update(cows)
      .set(cow)
      .where(eq(cows.nationalId, nationalId))
      .returning();
    return updatedCow;
  }

  async deleteCow(nationalId: string): Promise<void> {
    await db.delete(cows).where(eq(cows.nationalId, nationalId));
  }

  // Acts
  async getActs(nationalId?: string): Promise<Act[]> {
    if (nationalId) {
      return await db.select().from(acts).where(eq(acts.nationalId, nationalId));
    }
    return await db.select().from(acts);
  }

  async getAct(id: number): Promise<Act | undefined> {
    const [act] = await db.select().from(acts).where(eq(acts.id, id));
    return act;
  }

  async createAct(act: InsertAct): Promise<Act> {
    const [newAct] = await db.insert(acts).values(act).returning();
    return newAct;
  }

  async deleteAct(id: number): Promise<void> {
    await db.delete(acts).where(eq(acts.id, id));
  }
}

export const storage = new DatabaseStorage();