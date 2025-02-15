import { type InsertUser, type User, type Farmer, type InsertFarmer, type Farm, type InsertFarm, type Cow, type InsertCow, type Act, type InsertAct } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private farmers: Map<number, Farmer>;
  private farms: Map<number, Farm>;
  private cows: Map<string, Cow>;
  private acts: Map<number, Act>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.farmers = new Map();
    this.farms = new Map();
    this.cows = new Map();
    this.acts = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Farmer methods
  async getFarmers(): Promise<Farmer[]> {
    return Array.from(this.farmers.values());
  }

  async getFarmer(id: number): Promise<Farmer | undefined> {
    return this.farmers.get(id);
  }

  async createFarmer(farmer: InsertFarmer): Promise<Farmer> {
    const id = this.currentId++;
    const newFarmer: Farmer = { ...farmer, id };
    this.farmers.set(id, newFarmer);
    return newFarmer;
  }

  async updateFarmer(id: number, farmer: Partial<InsertFarmer>): Promise<Farmer> {
    const existing = await this.getFarmer(id);
    if (!existing) throw new Error("Farmer not found");
    const updated = { ...existing, ...farmer };
    this.farmers.set(id, updated);
    return updated;
  }

  async deleteFarmer(id: number): Promise<void> {
    this.farmers.delete(id);
  }

  // Farm methods
  async getFarms(ownerId?: number): Promise<Farm[]> {
    const farms = Array.from(this.farms.values());
    return ownerId ? farms.filter(f => f.ownerId === ownerId) : farms;
  }

  async getFarm(id: number): Promise<Farm | undefined> {
    return this.farms.get(id);
  }

  async createFarm(farm: InsertFarm): Promise<Farm> {
    const id = this.currentId++;
    const newFarm: Farm = { ...farm, id };
    this.farms.set(id, newFarm);
    return newFarm;
  }

  async updateFarm(id: number, farm: Partial<InsertFarm>): Promise<Farm> {
    const existing = await this.getFarm(id);
    if (!existing) throw new Error("Farm not found");
    const updated = { ...existing, ...farm };
    this.farms.set(id, updated);
    return updated;
  }

  async deleteFarm(id: number): Promise<void> {
    this.farms.delete(id);
  }

  // Cow methods
  async getCows(ownerId?: number): Promise<Cow[]> {
    const cows = Array.from(this.cows.values());
    return ownerId ? cows.filter(c => c.ownerId === ownerId) : cows;
  }

  async getCow(nationalId: string): Promise<Cow | undefined> {
    return this.cows.get(nationalId);
  }

  async createCow(cow: InsertCow): Promise<Cow> {
    if (await this.getCow(cow.nationalId)) {
      throw new Error("Cow with this national ID already exists");
    }
    this.cows.set(cow.nationalId, cow);
    return cow;
  }

  async updateCow(nationalId: string, cow: Partial<InsertCow>): Promise<Cow> {
    const existing = await this.getCow(nationalId);
    if (!existing) throw new Error("Cow not found");
    const updated = { ...existing, ...cow };
    this.cows.set(nationalId, updated);
    return updated;
  }

  async deleteCow(nationalId: string): Promise<void> {
    this.cows.delete(nationalId);
  }

  // Act methods
  async getActs(nationalId?: string): Promise<Act[]> {
    const acts = Array.from(this.acts.values());
    return nationalId ? acts.filter(a => a.nationalId === nationalId) : acts;
  }

  async getAct(id: number): Promise<Act | undefined> {
    return this.acts.get(id);
  }

  async createAct(act: InsertAct): Promise<Act> {
    const id = this.currentId++;
    const newAct: Act = { ...act, id };
    this.acts.set(id, newAct);
    return newAct;
  }

  async deleteAct(id: number): Promise<void> {
    this.acts.delete(id);
  }
}

export const storage = new MemStorage();
