import { X, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Motorcycle } from "@shared/schema";

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onAddToCompare?: () => void;
  isComparing?: boolean;
  comparisonBike?: Motorcycle;
  onRemove?: () => void; // Nueva prop para eliminar la tarjeta
}

export function MotorcycleCard({
  motorcycle,
  onAddToCompare,
  isComparing,
  comparisonBike,
  onRemove
}: MotorcycleCardProps) {
  const getBetterSpec = (
    current: number,
    comparison?: number,
    higherIsBetter: boolean = true
  ) => {
    if (!comparison || !isComparing) return false;
    return higherIsBetter ? current > comparison : current < comparison;
  };

  return (
    <Card className="bg-white rounded-lg shadow-material-1 overflow-hidden hover:shadow-material-2 hover-lift transition-all duration-200 relative">
      {/* Botón para cerrar/eliminar */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full p-1.5 shadow-sm z-10 hover:bg-gray-100 transition-colors"
          aria-label="Remove motorcycle"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>
      )}

      {/* Imagen con fallback */}
      <img
        src={motorcycle.imageUrl || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
        alt={motorcycle.name || "Motorcycle image"}
        className="w-full h-48 object-cover"
      />

      <CardContent className="p-6">
        {/* Título y año */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-900">{motorcycle.name || "Unknown Model"}</h3>
            <p className="text-neutral-600">{motorcycle.year || "N/A"} Model Year</p>
          </div>

          {/* Precio con validación */}
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-blue">
              ${motorcycle.price ? motorcycle.price.toLocaleString() : "N/A"}
            </p>
            <p className="text-sm text-neutral-600">MSRP</p>
          </div>
        </div>

        {/* Especificaciones clave */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Cilindrada */}
          <div
            className={`text-center p-3 rounded-lg ${
              getBetterSpec(motorcycle.displacement, comparisonBike?.displacement)
                ? "bg-success-green bg-opacity-50 border border-success-green border-opacity-70 text-white"
                : "bg-neutral-50"
            }`}
          >
            <p
              className={`text-2xl font-bold ${
                getBetterSpec(motorcycle.displacement, comparisonBike?.displacement)
                  ? "text-white"
                  : "text-neutral-900"
              }`}
            >
              {motorcycle.displacement || 0}cc
            </p>
            <p
              className={`text-sm ${
                getBetterSpec(motorcycle.displacement, comparisonBike?.displacement)
                  ? "text-white font-medium"
                  : "text-neutral-600"
              }`}
            >
              Engine
            </p>
          </div>

          {/* Potencia */}
          <div
            className={`text-center p-3 rounded-lg ${
              getBetterSpec(motorcycle.maxPower, comparisonBike?.maxPower)
                ? "bg-success-green bg-opacity-50 border border-success-green border-opacity-70 text-white"
                : "bg-neutral-50"
            }`}
          >
            <p
              className={`text-2xl font-bold ${
                getBetterSpec(motorcycle.maxPower, comparisonBike?.maxPower)
                  ? "text-white"
                  : "text-neutral-900"
              }`}
            >
              {motorcycle.maxPower || 0}hp
            </p>
            <p
              className={`text-sm ${
                getBetterSpec(motorcycle.maxPower, comparisonBike?.maxPower)
                  ? "text-white font-medium"
                  : "text-neutral-600"
              }`}
            >
              Power
            </p>
          </div>

          {/* Peso */}
          <div
            className={`text-center p-3 rounded-lg ${
              getBetterSpec(motorcycle.dryWeight, comparisonBike?.dryWeight, false)
                ? "bg-success-green bg-opacity-50 border border-success-green border-opacity-70 text-white"
                : "bg-neutral-50"
            }`}
          >
            <p
              className={`text-2xl font-bold ${
                getBetterSpec(motorcycle.dryWeight, comparisonBike?.dryWeight, false)
                  ? "text-white"
                  : "text-neutral-900"
              }`}
            >
              {motorcycle.dryWeight || 0}kg
            </p>
            <p
              className={`text-sm ${
                getBetterSpec(motorcycle.dryWeight, comparisonBike?.dryWeight, false)
                  ? "text-white font-medium"
                  : "text-neutral-600"
              }`}
            >
              Weight
            </p>
          </div>

          {/* Velocidad máxima */}
          <div
            className={`text-center p-3 rounded-lg ${
              getBetterSpec(motorcycle.topSpeed, comparisonBike?.topSpeed)
                ? "bg-success-green bg-opacity-50 border border-success-green border-opacity-70 text-white"
                : "bg-neutral-50"
            }`}
          >
            <p
              className={`text-2xl font-bold ${
                getBetterSpec(motorcycle.topSpeed, comparisonBike?.topSpeed)
                  ? "text-white"
                  : "text-neutral-900"
              }`}
            >
              {motorcycle.topSpeed || 0}
            </p>
            <p
              className={`text-sm ${
                getBetterSpec(motorcycle.topSpeed, comparisonBike?.topSpeed)
                  ? "text-white font-medium"
                  : "text-neutral-600"
              }`}
            >
              Top Speed (km/h)
            </p>
          </div>
        </div>

        {/* Botones inferiores */}
        <div className="flex space-x-2">
          <Button
            onClick={onAddToCompare}
            className="flex-1 bg-primary-blue hover:bg-primary-blue-dark text-white py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add to Compare
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}