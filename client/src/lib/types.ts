export interface SearchFilters {
  query?: string;
  brands?: string[];
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  minEngine?: number;
  maxEngine?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'engine_size' | 'power';
}

export interface MotorcycleComparison {
  motorcycle1?: number;
  motorcycle2?: number;
}
