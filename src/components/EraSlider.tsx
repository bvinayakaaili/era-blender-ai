import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Clock, Camera, Zap } from "lucide-react";

interface EraSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  isTransforming: boolean;
}

const eras = [
  { year: 1900, label: "Early 1900s", description: "Victorian Era", icon: Clock, color: "hsl(30 30% 25%)" },
  { year: 1950, label: "Mid Century", description: "Golden Age", icon: Camera, color: "hsl(45 93% 47%)" },
  { year: 2000, label: "Modern", description: "Digital Age", icon: Camera, color: "hsl(217 91% 60%)" },
  { year: 2050, label: "Future", description: "AI Era", icon: Zap, color: "hsl(191 91% 60%)" }
];

export const EraSlider = ({ value, onValueChange, isTransforming }: EraSliderProps) => {
  const currentValue = value[0];
  const currentEra = eras.find(era => era.year === currentValue) || eras[2];

  return (
    <Card className="p-8 glow-card">
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/20" style={{ backgroundColor: `${currentEra.color}20` }}>
              <currentEra.icon 
                className="h-6 w-6" 
                style={{ color: currentEra.color }}
              />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: currentEra.color }}>
            {currentEra.label}
          </h3>
          <p className="text-muted-foreground">{currentEra.description}</p>
        </div>

        <div className="space-y-4">
          <Slider
            value={value}
            onValueChange={onValueChange}
            min={1900}
            max={2050}
            step={50}
            className="era-transition"
            disabled={isTransforming}
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            {eras.map((era) => (
              <div 
                key={era.year} 
                className={`text-center ${era.year === currentValue ? 'font-semibold' : ''}`}
                style={{ color: era.year === currentValue ? era.color : undefined }}
              >
                <div>{era.year}</div>
                <div className="hidden sm:block">{era.label}</div>
              </div>
            ))}
          </div>
        </div>

        {isTransforming && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Transforming to {currentEra.label}...</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};