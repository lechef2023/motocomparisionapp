import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Motorcycle } from "@shared/schema";

interface SimilarMotorcyclesProps {
  currentMotorcycles: Motorcycle[];
  onAddToCompare: (motorcycle: Motorcycle) => void;
}

export function SimilarMotorcycles({ currentMotorcycles, onAddToCompare }: SimilarMotorcyclesProps) {
  const { data: allMotorcycles } = useQuery<Motorcycle[]>({
    queryKey: ['/api/motorcycles'],
  });

  const getSimilarMotorcycles = () => {
    if (!allMotorcycles || currentMotorcycles.length === 0) return [];
    
    const currentIds = currentMotorcycles.map(m => m.id);
    const currentCategories = currentMotorcycles.map(m => m.category);
    const avgDisplacement = currentMotorcycles.reduce((sum, m) => sum + m.displacement, 0) / currentMotorcycles.length;
    
    return allMotorcycles
      .filter(m => !currentIds.includes(m.id))
      .filter(m => currentCategories.includes(m.category))
      .map(m => ({
        ...m,
        matchPercentage: calculateMatchPercentage(m, currentMotorcycles[0])
      }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 3);
  };

  const calculateMatchPercentage = (motorcycle: Motorcycle, reference: Motorcycle): number => {
    let score = 0;
    
    // Category match (40%)
    if (motorcycle.category === reference.category) score += 40;
    
    // Engine size similarity (30%)
    const engineDiff = Math.abs(motorcycle.displacement - reference.displacement);
    const engineSimilarity = Math.max(0, 1 - (engineDiff / 500));
    score += engineSimilarity * 30;
    
    // Power similarity (20%)
    const powerDiff = Math.abs(motorcycle.maxPower - reference.maxPower);
    const powerSimilarity = Math.max(0, 1 - (powerDiff / 100));
    score += powerSimilarity * 20;
    
    // Price similarity (10%)
    const priceDiff = Math.abs(motorcycle.price - reference.price);
    const priceSimilarity = Math.max(0, 1 - (priceDiff / 20000));
    score += priceSimilarity * 10;
    
    return Math.round(score);
  };

  const similarMotorcycles = getSimilarMotorcycles();

  if (similarMotorcycles.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-material-1 p-6">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Similar Motorcycles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {similarMotorcycles.map((motorcycle) => (
          <div 
            key={motorcycle.id}
            className="border border-neutral-200 rounded-lg p-4 hover:shadow-material-1 transition-shadow duration-200 cursor-pointer hover-lift"
          >
            <img
              src={motorcycle.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
              alt={motorcycle.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h4 className="font-semibold text-neutral-900">{motorcycle.name}</h4>
            <p className="text-sm text-neutral-600 mb-2">
              {motorcycle.displacement}cc • {motorcycle.maxPower}hp • ${motorcycle.price.toLocaleString()}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-secondary-orange bg-opacity-10 text-secondary-orange px-2 py-1 rounded">
                {motorcycle.matchPercentage}% Match
              </span>
              <Button
                onClick={() => onAddToCompare(motorcycle)}
                variant="ghost"
                size="sm"
                className="text-primary-blue hover:text-primary-blue-dark text-sm font-medium"
              >
                <Plus className="mr-1 h-3 w-3" />
                Compare
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
