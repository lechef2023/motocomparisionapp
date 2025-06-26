import { useState, useEffect } from "react";
import { X, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import type { SearchFilters } from "@/lib/types";

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export function FilterSidebar({ filters, onFiltersChange, onClearFilters }: FilterSidebarProps) {
  const [engineRange, setEngineRange] = useState([filters.minEngine || 125]);
  
  const { data: brands } = useQuery<string[]>({
    queryKey: ['/api/brands'],
  });

  const { data: categories } = useQuery<string[]>({
    queryKey: ['/api/categories'],
  });

  const availableCategories = ['Sport', 'Cruiser', 'Adventure', 'Touring', 'Naked'];

  useEffect(() => {
    setEngineRange([filters.minEngine || 125]);
  }, [filters.minEngine]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = filters.categories || [];
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const currentBrands = filters.brands || [];
    const newBrands = checked
      ? [...currentBrands, brand]
      : currentBrands.filter(b => b !== brand);
    
    onFiltersChange({ ...filters, brands: newBrands });
  };

  const handleEngineRangeChange = (value: number[]) => {
    setEngineRange(value);
    onFiltersChange({ ...filters, minEngine: value[0], maxEngine: 1300 });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    onFiltersChange({ ...filters, [field]: numValue });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.brands?.length) count += filters.brands.length;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.minEngine && filters.minEngine > 125) count++;
    return count;
  };

  return (
    <aside className="lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-material-1 p-6 sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Filters</h2>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary-blue text-white px-2 py-1 rounded-full text-xs">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        
        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-700 mb-3 uppercase tracking-wide">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category, !filters.categories?.includes(category))}
                className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                  filters.categories?.includes(category)
                    ? 'bg-primary-blue text-white'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-700 mb-3 uppercase tracking-wide">Brands</h3>
          <div className="space-y-2">
            {brands?.map((brand) => (
              <label key={brand} className="flex items-center">
                <Checkbox
                  checked={filters.brands?.includes(brand) || false}
                  onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
                  className="rounded border-neutral-300 text-primary-blue focus:ring-primary-blue"
                />
                <span className="ml-3 text-neutral-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Engine Size */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-700 mb-3 uppercase tracking-wide">Engine Size</h3>
          <div className="px-3">
            <Slider
              value={engineRange}
              onValueChange={handleEngineRangeChange}
              max={1300}
              min={125}
              step={25}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-neutral-600 mt-1">
              <span>125cc</span>
              <span className="font-medium text-primary-blue">{engineRange[0]}cc</span>
              <span>1300cc</span>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-700 mb-3 uppercase tracking-wide">Price Range</h3>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            />
          </div>
        </div>

        <Button
          onClick={onClearFilters}
          variant="outline"
          className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      </div>
    </aside>
  );
}
