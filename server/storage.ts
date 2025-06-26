import { motorcycles, type Motorcycle, type InsertMotorcycle } from "@shared/schema";

export interface IStorage {
  getAllMotorcycles(): Promise<Motorcycle[]>;
  getMotorcycleById(id: number): Promise<Motorcycle | undefined>;
  searchMotorcycles(query: string): Promise<Motorcycle[]>;
  filterMotorcycles(filters: any): Promise<Motorcycle[]>;
  createMotorcycle(motorcycle: InsertMotorcycle): Promise<Motorcycle>;
  getBrands(): Promise<string[]>;
  getCategories(): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private motorcycles: Map<number, Motorcycle>;
  private currentId: number;

  constructor() {
    this.motorcycles = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    const seedMotorcycles: InsertMotorcycle[] = [
      {
        name: "Bera SBR 150cc",
        brand: "Bera",
        model: "SBR 150cc",
        year: 2025,
        price: 980,
        category: "Classic",
        engineType: "1-Cylinder, 4-Stroke",
        displacement: 124,
        maxPower: 12,
        maxPowerRpm: 7000,
        maxTorque: 9.5,
        maxTorqueRpm: 7500,
        length: 1925,
        width: 735,
        height: 950,
        wheelbase: 1235,
        dryWeight: 98,
        topSpeed: 137,
        fuelCapacity: 12.5,
        fuelConsumption: 2.5,
        ridingModes: 0,
        abs: false,
        tractionControl: 0,
        imageUrl: "https://i.postimg.cc/Vv6wVhW2/bera-sbr.png",
        tags: ["classic", "urban", "economical"]
      },
      {
      name: "Bera BRF 150cc",
      brand: "Bera",
      model: "BRF 150cc",
      year: 2025,
      price: 950,
      category: "Classic",
      engineType: "1-Cylinder, 4-Stroke",
      displacement: 149,
      maxPower: 12,
      maxPowerRpm: 7000,
      maxTorque: 9.5,
      maxTorqueRpm: 7500,
      length: 2010,
      width: 790,
      height: 1070,
      wheelbase: 1275,
      dryWeight: 109,
      topSpeed: 90,
      fuelCapacity: 13.0,
      fuelConsumption: 2.9,
      ridingModes: 0,
      abs: false,
      tractionControl: 0,
      imageUrl: "https://i.postimg.cc/kM6JcFDQ/bera-brf.png",
      tags: ["classic", "urban", "economical"]
      },
      {
        name: "Bera BR 200cc",
        brand: "Bera",
        model: "BR 200cc",
        year: 2025,
        price: 1360,
        category: "Classic",
        engineType: "1-Cylinder, 4-Stroke",
        displacement: 200,
        maxPower: 15,
        maxPowerRpm: 8500,
        maxTorque: 6500,
        maxTorqueRpm: 12500,
        length: 2000,
        width: 790,
        height: 1020,
        wheelbase: 1290,
        dryWeight: 110,
        topSpeed: 110,
        fuelCapacity: 15,
        fuelConsumption: 2.9,
        ridingModes: 0,
        abs: false,
        tractionControl: 0,
        imageUrl: "https://i.postimg.cc/j5k12FfL/bera-br-200.png",
        tags: ["classic", "urban", "economical", "commuter"]
      },
      {
        name: "AVA Tigrito 175cc",
        brand: "AVA",
        model: "Tigrito 175cc",
        year: 2025,
        price: 1250,
        category: "Off-Road",
        engineType: "1-Cylinder, 4-Stroke",
        displacement: 175,
        maxPower: 11.8,
        maxPowerRpm: 7500,
        maxTorque: 18,
        maxTorqueRpm: 8000,
        length: 2130,
        width: 870,
        height: 1220,
        wheelbase: 1410,
        dryWeight: 130,
        topSpeed: 110,
        fuelCapacity: 11,
        fuelConsumption: 3.2,
        ridingModes: 0,
        abs: false,
        tractionControl: 0,
        imageUrl: "https://i.postimg.cc/FHQPfGrV/ava-tigrito-175.png",
        tags: ["offroad", "trail", "rural", "adventure"]
      },
      {
        name: "Kawasaki Ninja ZX-10R",
        brand: "Kawasaki",
        model: "Ninja ZX-10R",
        year: 2023,
        price: 16399,
        category: "Sport",
        engineType: "4-Cylinder, 4-Stroke",
        displacement: 998,
        maxPower: 203,
        maxPowerRpm: 13000,
        maxTorque: 114.9,
        maxTorqueRpm: 11400,
        length: 2085,
        width: 750,
        height: 1185,
        wheelbase: 1450,
        dryWeight: 207,
        topSpeed: 300,
        fuelCapacity: 17.0,
        fuelConsumption: 7.5,
        ridingModes: 4,
        abs: true,
        tractionControl: 3,
        imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        tags: ["sport", "track", "racing", "aggressive"]
      },
      {
        name: "Ducati Panigale V4",
        brand: "Ducati",
        model: "Panigale V4",
        year: 2023,
        price: 22595,
        category: "Sport",
        engineType: "V4, 4-Stroke",
        displacement: 1103,
        maxPower: 214,
        maxPowerRpm: 13000,
        maxTorque: 124.0,
        maxTorqueRpm: 10000,
        length: 2056,
        width: 730,
        height: 1145,
        wheelbase: 1469,
        dryWeight: 195,
        topSpeed: 300,
        fuelCapacity: 16.0,
        fuelConsumption: 8.1,
        ridingModes: 4,
        abs: true,
        tractionControl: 8,
        imageUrl: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        tags: ["sport", "italian", "v4", "premium"]
      },
      {
        name: "BMW S1000RR",
        brand: "BMW",
        model: "S1000RR",
        year: 2023,
        price: 17895,
        category: "Sport",
        engineType: "4-Cylinder, 4-Stroke",
        displacement: 999,
        maxPower: 205,
        maxPowerRpm: 13500,
        maxTorque: 113.0,
        maxTorqueRpm: 11000,
        length: 2073,
        width: 848,
        height: 1138,
        wheelbase: 1441,
        dryWeight: 197,
        topSpeed: 299,
        fuelCapacity: 16.5,
        fuelConsumption: 7.3,
        ridingModes: 4,
        abs: true,
        tractionControl: 8,
        imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        tags: ["sport", "german", "technology", "premium"]
      }
    ];

    seedMotorcycles.forEach(motorcycle => {
      const id = this.currentId++;
      const fullMotorcycle: Motorcycle = { ...motorcycle, id };
      this.motorcycles.set(id, fullMotorcycle);
    });
  }

  async getAllMotorcycles(): Promise<Motorcycle[]> {
    return Array.from(this.motorcycles.values());
  }

  async getMotorcycleById(id: number): Promise<Motorcycle | undefined> {
    return this.motorcycles.get(id);
  }

  async searchMotorcycles(query: string): Promise<Motorcycle[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.motorcycles.values()).filter(motorcycle => 
      motorcycle.name.toLowerCase().includes(lowercaseQuery) ||
      motorcycle.brand.toLowerCase().includes(lowercaseQuery) ||
      motorcycle.model.toLowerCase().includes(lowercaseQuery) ||
      motorcycle.category.toLowerCase().includes(lowercaseQuery) ||
      (motorcycle.tags ?? []).some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async filterMotorcycles(filters: any): Promise<Motorcycle[]> {
    let results = Array.from(this.motorcycles.values());

    if (filters.query) {
      const lowercaseQuery = filters.query.toLowerCase();
      results = results.filter(motorcycle => 
        motorcycle.name.toLowerCase().includes(lowercaseQuery) ||
        motorcycle.brand.toLowerCase().includes(lowercaseQuery) ||
        motorcycle.model.toLowerCase().includes(lowercaseQuery) ||
        motorcycle.category.toLowerCase().includes(lowercaseQuery) ||
        (motorcycle.tags ?? []).some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    }

    if (filters.brands && filters.brands.length > 0) {
      results = results.filter(motorcycle => filters.brands.includes(motorcycle.brand));
    }

    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(motorcycle => filters.categories.includes(motorcycle.category));
    }

    if (filters.minPrice !== undefined) {
      results = results.filter(motorcycle => motorcycle.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter(motorcycle => motorcycle.price <= filters.maxPrice);
    }

    if (filters.minEngine !== undefined) {
      results = results.filter(motorcycle => motorcycle.displacement >= filters.minEngine);
    }

    if (filters.maxEngine !== undefined) {
      results = results.filter(motorcycle => motorcycle.displacement <= filters.maxEngine);
    }

    // Sort results
    switch (filters.sortBy) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'engine_size':
        results.sort((a, b) => b.displacement - a.displacement);
        break;
      case 'power':
        results.sort((a, b) => b.maxPower - a.maxPower);
        break;
      default:
        // relevance - keep original order
        break;
    }

    return results;
  }

  async createMotorcycle(insertMotorcycle: InsertMotorcycle): Promise<Motorcycle> {
    const id = this.currentId++;
    const motorcycle: Motorcycle = { ...insertMotorcycle, id };
    this.motorcycles.set(id, motorcycle);
    return motorcycle;
  }

  async getBrands(): Promise<string[]> {
    const brands = new Set<string>();
    this.motorcycles.forEach(motorcycle => brands.add(motorcycle.brand));
    return Array.from(brands).sort();
  }

  async getCategories(): Promise<string[]> {
    const categories = new Set<string>();
    this.motorcycles.forEach(motorcycle => categories.add(motorcycle.category));
    return Array.from(categories).sort();
  }
}

export const storage = new MemStorage();
