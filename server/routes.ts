import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchFiltersSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all motorcycles
  app.get("/api/motorcycles", async (req, res) => {
    try {
      const motorcycles = await storage.getAllMotorcycles();
      res.json(motorcycles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch motorcycles" });
    }
  });

  // Get motorcycle by ID
  app.get("/api/motorcycles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const motorcycle = await storage.getMotorcycleById(id);
      
      if (!motorcycle) {
        return res.status(404).json({ message: "Motorcycle not found" });
      }
      
      res.json(motorcycle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch motorcycle" });
    }
  });

  // Search motorcycles by query string
  app.get("/api/motorcycles/search", async (req, res) => {
    try {
      const { query } = req.query;

      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Missing or invalid query parameter" });
      }

      const results = await storage.searchMotorcycles(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search motorcycles" });
    }
  });

  // Filter motorcycles
  app.post("/api/motorcycles/filter", async (req, res) => {
    try {
      const filters = searchFiltersSchema.parse(req.body);
      const motorcycles = await storage.filterMotorcycles(filters);
      res.json(motorcycles);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      console.error("Filter error:", error);
      res.status(500).json({ message: "Failed to filter motorcycles" });
    }
  });

  // Get brands
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  // Get categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Iniciar servidor HTTP
  const httpServer = createServer(app);
  return httpServer;
}