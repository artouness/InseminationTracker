import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertFarmerSchema, insertFarmSchema, insertCowSchema, insertActSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Farmers routes
  app.get("/api/farmers", async (_req, res) => {
    const farmers = await storage.getFarmers();
    res.json(farmers);
  });

  app.post("/api/farmers", async (req, res) => {
    const parsed = insertFarmerSchema.parse(req.body);
    const farmer = await storage.createFarmer(parsed);
    res.status(201).json(farmer);
  });

  app.patch("/api/farmers/:id", async (req, res) => {
    const parsed = insertFarmerSchema.partial().parse(req.body);
    const farmer = await storage.updateFarmer(Number(req.params.id), parsed);
    res.json(farmer);
  });

  app.delete("/api/farmers/:id", async (req, res) => {
    await storage.deleteFarmer(Number(req.params.id));
    res.sendStatus(204);
  });

  // Farms routes
  app.get("/api/farms", async (req, res) => {
    const ownerId = req.query.ownerId ? Number(req.query.ownerId) : undefined;
    const farms = await storage.getFarms(ownerId);
    res.json(farms);
  });

  app.post("/api/farms", async (req, res) => {
    const parsed = insertFarmSchema.parse(req.body);
    const farm = await storage.createFarm(parsed);
    res.status(201).json(farm);
  });

  app.patch("/api/farms/:id", async (req, res) => {
    const parsed = insertFarmSchema.partial().parse(req.body);
    const farm = await storage.updateFarm(Number(req.params.id), parsed);
    res.json(farm);
  });

  app.delete("/api/farms/:id", async (req, res) => {
    await storage.deleteFarm(Number(req.params.id));
    res.sendStatus(204);
  });

  // Cows routes
  app.get("/api/cows", async (req, res) => {
    const ownerId = req.query.ownerId ? Number(req.query.ownerId) : undefined;
    const cows = await storage.getCows(ownerId);
    res.json(cows);
  });

  app.post("/api/cows", async (req, res) => {
    const parsed = insertCowSchema.parse(req.body);
    const cow = await storage.createCow(parsed);
    res.status(201).json(cow);
  });

  app.patch("/api/cows/:id", async (req, res) => {
    const parsed = insertCowSchema.partial().parse(req.body);
    const cow = await storage.updateCow(req.params.id, parsed);
    res.json(cow);
  });

  app.delete("/api/cows/:id", async (req, res) => {
    await storage.deleteCow(req.params.id);
    res.sendStatus(204);
  });

  // Acts routes
  app.get("/api/acts", async (req, res) => {
    const nationalId = req.query.nationalId?.toString();
    const acts = await storage.getActs(nationalId);
    res.json(acts);
  });

  app.post("/api/acts", async (req, res) => {
    const parsed = insertActSchema.parse(req.body);
    const act = await storage.createAct(parsed);
    res.status(201).json(act);
  });

  app.delete("/api/acts/:id", async (req, res) => {
    await storage.deleteAct(Number(req.params.id));
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}
