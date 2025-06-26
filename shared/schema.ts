import { pgTable, text, serial, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const motorcycles = pgTable("motorcycles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull(), // Price in dollars
  category: text("category").notNull(), // Sport, Cruiser, Adventure, Touring, Naked
  
  // Engine specifications
  engineType: text("engine_type").notNull(),
  displacement: integer("displacement").notNull(), // in cc
  maxPower: integer("max_power").notNull(), // in hp
  maxPowerRpm: integer("max_power_rpm").notNull(),
  maxTorque: real("max_torque").notNull(), // in Nm
  maxTorqueRpm: integer("max_torque_rpm").notNull(),
  
  // Dimensions and weight
  length: integer("length").notNull(), // in mm
  width: integer("width").notNull(), // in mm
  height: integer("height").notNull(), // in mm
  wheelbase: integer("wheelbase").notNull(), // in mm
  dryWeight: integer("dry_weight").notNull(), // in kg
  
  // Performance
  topSpeed: integer("top_speed").notNull(), // in km/h
  
  // Fuel
  fuelCapacity: real("fuel_capacity").notNull(), // in liters
  fuelConsumption: real("fuel_consumption").notNull(), // in L/100km
  
  // Electronics and features
  ridingModes: integer("riding_modes").notNull(),
  abs: boolean("abs").notNull().default(true),
  tractionControl: integer("traction_control").notNull(), // number of levels
  
  // Additional info
  imageUrl: text("image_url"),
  tags: text("tags").array().default([]), // For search and filtering
});

export const insertMotorcycleSchema = createInsertSchema(motorcycles).omit({
  id: true,
});

export type InsertMotorcycle = z.infer<typeof insertMotorcycleSchema>;
export type Motorcycle = typeof motorcycles.$inferSelect;

// Search and filter schemas
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  brands: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minEngine: z.number().optional(),
  maxEngine: z.number().optional(),
  sortBy: z.enum(['relevance', 'price_asc', 'price_desc', 'engine_size', 'power']).optional(),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;
