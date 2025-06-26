import { Settings, Ruler, Fuel, Zap, CheckCircle, ArrowUp, ArrowDown } from "lucide-react";
import type { Motorcycle } from "@shared/schema";

interface ComparisonTableProps {
  motorcycle1: Motorcycle;
  motorcycle2: Motorcycle;
}

export function ComparisonTable({ motorcycle1, motorcycle2 }: ComparisonTableProps) {
  const getBetterValue = (value1: number, value2: number, higherIsBetter: boolean = true) => {
    if (higherIsBetter) {
      return value1 > value2 ? 'motorcycle1' : value1 === value2 ? 'equal' : 'motorcycle2';
    } else {
      return value1 < value2 ? 'motorcycle1' : value1 === value2 ? 'equal' : 'motorcycle2';
    }
  };

  const SpecRow = ({ 
    label, 
    value1, 
    value2, 
    unit = '', 
    higherIsBetter = true, 
    isEven = false,
    numericCompare = true 
  }: {
    label: string;
    value1: string | number;
    value2: string | number;
    unit?: string;
    higherIsBetter?: boolean;
    isEven?: boolean;
    numericCompare?: boolean;
  }) => {
    const winner = numericCompare && typeof value1 === 'number' && typeof value2 === 'number' 
      ? getBetterValue(value1, value2, higherIsBetter) 
      : 'equal';

    return (
      <tr className={isEven ? 'bg-neutral-50' : ''}>
        <td className="px-6 py-4 text-sm text-neutral-700">{label}</td>
        <td className={`px-6 py-4 text-sm text-center ${
          winner === 'motorcycle1' ? 'bg-success-green bg-opacity-10 text-white' : 'text-neutral-900'
        }`}>
          <div className="flex items-center justify-center">
            <span className={winner === 'motorcycle1' ? 'font-semibold' : ''}>
              {value1}{unit}
            </span>
            {winner === 'motorcycle1' && (
              <ArrowUp className="text-white ml-2 h-4 w-4" />
            )}
          </div>
        </td>
        <td className={`px-6 py-4 text-sm text-center ${
          winner === 'motorcycle2' ? 'bg-success-green bg-opacity-10 text-white' : 'text-neutral-900'
        }`}>
          <div className="flex items-center justify-center">
            <span className={winner === 'motorcycle2' ? 'font-semibold' : ''}>
              {value2}{unit}
            </span>
            {winner === 'motorcycle2' && (
              <ArrowUp className="text-white ml-2 h-4 w-4" />
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-material-1 overflow-hidden">
      <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900">Detailed Comparison</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Specification</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">{motorcycle1.name}</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">{motorcycle2.name}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {/* Engine Specifications */}
            <tr className="bg-neutral-50">
              <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-neutral-700 bg-neutral-100">
                <Settings className="inline mr-2 h-4 w-4" />
                Engine & Performance
              </td>
            </tr>
            <SpecRow 
              label="Engine Type" 
              value1={motorcycle1.engineType} 
              value2={motorcycle2.engineType}
              numericCompare={false}
            />
            <SpecRow 
              label="Displacement" 
              value1={motorcycle1.displacement} 
              value2={motorcycle2.displacement}
              unit="cc"
              isEven
            />
            <SpecRow 
              label="Max Power" 
              value1={`${motorcycle1.maxPower} hp @ ${motorcycle1.maxPowerRpm.toLocaleString()} rpm`} 
              value2={`${motorcycle2.maxPower} hp @ ${motorcycle2.maxPowerRpm.toLocaleString()} rpm`}
              numericCompare={false}
            />
            <SpecRow 
              label="Max Torque" 
              value1={`${motorcycle1.maxTorque} Nm @ ${motorcycle1.maxTorqueRpm.toLocaleString()} rpm`} 
              value2={`${motorcycle2.maxTorque} Nm @ ${motorcycle2.maxTorqueRpm.toLocaleString()} rpm`}
              isEven
              numericCompare={false}
            />
            
            {/* Dimensions & Weight */}
            <tr className="bg-neutral-50">
              <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-neutral-700 bg-neutral-100">
                <Ruler className="inline mr-2 h-4 w-4" />
                Dimensions & Weight
              </td>
            </tr>
            <SpecRow 
              label="Length x Width x Height" 
              value1={`${motorcycle1.length} x ${motorcycle1.width} x ${motorcycle1.height} mm`} 
              value2={`${motorcycle2.length} x ${motorcycle2.width} x ${motorcycle2.height} mm`}
              numericCompare={false}
            />
            <SpecRow 
              label="Wheelbase" 
              value1={motorcycle1.wheelbase} 
              value2={motorcycle2.wheelbase}
              unit=" mm"
              isEven
            />
            <SpecRow 
              label="Dry Weight" 
              value1={motorcycle1.dryWeight} 
              value2={motorcycle2.dryWeight}
              unit=" kg"
              higherIsBetter={false}
            />
            
            {/* Fuel & Economy */}
            <tr className="bg-neutral-50">
              <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-neutral-700 bg-neutral-100">
                <Fuel className="inline mr-2 h-4 w-4" />
                Fuel System & Economy
              </td>
            </tr>
            <SpecRow 
              label="Fuel Tank Capacity" 
              value1={motorcycle1.fuelCapacity} 
              value2={motorcycle2.fuelCapacity}
              unit=" L"
              isEven
            />
            <SpecRow 
              label="Fuel Consumption" 
              value1={motorcycle1.fuelConsumption} 
              value2={motorcycle2.fuelConsumption}
              unit=" L/100km"
              higherIsBetter={false}
            />
            
            {/* Electronics */}
            <tr className="bg-neutral-50">
              <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-neutral-700 bg-neutral-100">
                <Zap className="inline mr-2 h-4 w-4" />
                Electronics & Features
              </td>
            </tr>
            <SpecRow 
              label="Riding Modes" 
              value1={motorcycle1.ridingModes} 
              value2={motorcycle2.ridingModes}
              unit=" Modes"
              isEven
            />
            <tr className="bg-neutral-50">
              <td className="px-6 py-4 text-sm text-neutral-700">ABS</td>
              <td className="px-6 py-4 text-sm text-center text-neutral-900">
                <CheckCircle className="inline text-success-green mr-2 h-4 w-4" />
                Standard
              </td>
              <td className="px-6 py-4 text-sm text-center text-neutral-900">
                <CheckCircle className="inline text-success-green mr-2 h-4 w-4" />
                Standard
              </td>
            </tr>
            <SpecRow 
              label="Traction Control" 
              value1={`${motorcycle1.tractionControl}-Level`} 
              value2={`${motorcycle2.tractionControl}-Level`}
              numericCompare={false}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}