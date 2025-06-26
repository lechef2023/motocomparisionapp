import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, ArrowUpDown } from "lucide-react";
import { Header } from "@/components/header";
import { FilterSidebar } from "@/components/filter-sidebar";
import { MotorcycleCard } from "@/components/motorcycle-card";
import { ComparisonTable } from "@/components/comparison-table";
import { SimilarMotorcycles } from "@/components/similar-motorcycles";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import type { Motorcycle } from "@shared/schema";
import type { SearchFilters } from "@/lib/types";

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    brands: [],
    categories: [],
    sortBy: 'relevance'
  });
  const [comparison, setComparison] = useState<{motorcycle1?: Motorcycle, motorcycle2?: Motorcycle}>({});
  const queryClient = useQueryClient();

  const { data: motorcycles = [], isLoading } = useQuery<Motorcycle[]>({
    queryKey: ['/api/motorcycles'],
  });

  const filterMutation = useMutation({
    mutationFn: async (filterData: SearchFilters) => {
      const response = await apiRequest('POST', '/api/motorcycles/filter', filterData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/motorcycles/filtered'], data);
    }
  });

  const [filteredMotorcycles, setFilteredMotorcycles] = useState<Motorcycle[]>([]);

  useEffect(() => {
    if (hasActiveFilters()) {
      filterMutation.mutate(filters);
    } else {
      setFilteredMotorcycles(motorcycles);
    }
  }, [filters, motorcycles]);

  useEffect(() => {
    if (filterMutation.data) {
      setFilteredMotorcycles(filterMutation.data);
    }
  }, [filterMutation.data]);

  const hasActiveFilters = () => {
    return !!(
      filters.query ||
      filters.brands?.length ||
      filters.categories?.length ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.minEngine ||
      filters.sortBy !== 'relevance'
    );
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      brands: [],
      categories: [],
      sortBy: 'relevance'
    });
  };

  const handleAddToCompare = (motorcycle: Motorcycle) => {
    if (!comparison.motorcycle1) {
      setComparison({ motorcycle1: motorcycle });
    } else if (!comparison.motorcycle2) {
      setComparison(prev => ({ ...prev, motorcycle2: motorcycle }));
    } else {
      // Replace the first one if both slots are filled
      setComparison({ motorcycle1: motorcycle, motorcycle2: comparison.motorcycle2 });
    }
  };

  const handleRemoveFromComparison = (position: 'motorcycle1' | 'motorcycle2') => {
    setComparison(prev => ({ ...prev, [position]: undefined }));
  };

  const handleSortChange = (value: string) => {
    setFilters(prev => ({ ...prev, sortBy: value as any }));
  };

  const getActiveFilterTags = () => {
    const tags = [];
    if (filters.categories?.length) {
      tags.push(...filters.categories.map(cat => ({ type: 'category', value: cat })));
    }
    if (filters.brands?.length) {
      tags.push(...filters.brands.map(brand => ({ type: 'brand', value: brand })));
    }
    return tags;
  };

  const removeFilterTag = (type: string, value: string) => {
    if (type === 'category') {
      setFilters(prev => ({
        ...prev,
        categories: prev.categories?.filter(c => c !== value)
      }));
    } else if (type === 'brand') {
      setFilters(prev => ({
        ...prev,
        brands: prev.brands?.filter(b => b !== value)
      }));
    }
  };

  const displayedMotorcycles = comparison.motorcycle1 && comparison.motorcycle2 
    ? [comparison.motorcycle1, comparison.motorcycle2]
    : filteredMotorcycles.slice(0, 2);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header onSearch={handleSearch} searchQuery={filters.query || ''} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading motorcycles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onSearch={handleSearch} searchQuery={filters.query || ''} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar de filtros */}
          <aside className="md:w-64 lg:w-72 overflow-y-auto max-h-screen pb-20 md:pb-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          <main className="flex-1">
            
            {/* Comparador */}
            <div className="bg-white rounded-lg shadow-material-1 p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Motorcycle Comparison</h2>
                <div className="w-full sm:w-48">
                  <Select value={filters.sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Sort by Relevance</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                      <SelectItem value="engine_size">Engine Size</SelectItem>
                      <SelectItem value="power">Power Output</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Etiquetas activas */}
              <div className="flex flex-wrap gap-2">
                {getActiveFilterTags().map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary-blue text-white px-3 py-1 rounded-full text-sm font-medium flex items-center"
                  >
                    {tag.value}
                    <X
                      className="ml-2 h-3 w-3 cursor-pointer"
                      onClick={() => removeFilterTag(tag.type, tag.value)}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* Tarjetas de motos */}
            {displayedMotorcycles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {displayedMotorcycles.map((motorcycle, index) => (
                  <div key={motorcycle.id} className="relative">
                    <MotorcycleCard
                      motorcycle={motorcycle}
                      onAddToCompare={() => handleAddToCompare(motorcycle)}
                      isComparing={displayedMotorcycles.length === 2}
                      comparisonBike={displayedMotorcycles[1 - index]}
                    />
                    {/* Botón de eliminar */}
                    <button
                      onClick={() => handleRemoveFromComparison(index === 0 ? 'motorcycle1' : 'motorcycle2')}
                      className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1.5 shadow-sm z-10 hover:bg-gray-100 transition-colors"
                      aria-label="Remove motorcycle"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Estado vacío */}
            {displayedMotorcycles.length === 0 && (
              <div className="bg-white rounded-lg shadow-material-1 p-12 text-center">
                <ArrowUpDown className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No motorcycles found</h3>
                <p className="text-neutral-600 mb-4">Try adjusting your search filters to find motorcycles to compare.</p>
                <Button onClick={handleClearFilters}>Clear all filters</Button>
              </div>
            )}

            {/* Tabla comparativa (oculta en móviles) */}
            {comparison.motorcycle1 && comparison.motorcycle2 && (
              <>
                <div className="block md:hidden mb-6">
                  <p className="text-center text-neutral-600 py-4">Table not available on small screens</p>
                </div>
                <div className="hidden md:block">
                  <ComparisonTable
                    motorcycle1={comparison.motorcycle1}
                    motorcycle2={comparison.motorcycle2}
                  />
                </div>
              </>
            )}

            {/* Motocicletas similares */}
            {displayedMotorcycles.length > 0 && (
              <SimilarMotorcycles
                currentMotorcycles={displayedMotorcycles}
                onAddToCompare={handleAddToCompare}
              />
            )}

          </main>
        </div>
      </div>

      {/* Botón flotante en móvil */}
      <div className="fixed bottom-6 left-6 right-6 z-40 md:hidden">
        <Button className="w-full bg-primary-blue hover:bg-primary-blue-dark text-white py-3 rounded-lg shadow-material-3 flex items-center justify-center space-x-2">
          <ArrowUpDown className="h-5 w-5" />
          <span>Compare Motorcycles</span>
        </Button>
      </div>
    </div>
  );
}