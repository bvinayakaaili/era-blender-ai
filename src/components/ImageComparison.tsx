import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ImageComparisonProps {
  originalImage: string | null;
  transformedImage: string | null;
  era: number;
  isLoading: boolean;
  onDownload?: () => void;
  onReset?: () => void;
}

const getEraLabel = (year: number) => {
  switch (year) {
    case 1900: return "Early 1900s";
    case 1950: return "Mid Century";
    case 2000: return "Modern";
    case 2050: return "Future";
    default: return `${year}s`;
  }
};

const getEraColor = (year: number) => {
  switch (year) {
    case 1900: return "hsl(30 30% 25%)";
    case 1950: return "hsl(45 93% 47%)";
    case 2000: return "hsl(217 91% 60%)";
    case 2050: return "hsl(191 91% 60%)";
    default: return "hsl(217 91% 60%)";
  }
};

export const ImageComparison = ({ 
  originalImage, 
  transformedImage, 
  era, 
  isLoading, 
  onDownload, 
  onReset 
}: ImageComparisonProps) => {
  const [showOriginal, setShowOriginal] = useState(false);

  if (!originalImage && !transformedImage && !isLoading) {
    return (
      <Card className="p-12 text-center glow-card">
        <div className="space-y-4">
          <div className="p-6 rounded-full bg-muted/50 mx-auto w-fit">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Ready for Time Travel</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Upload an image and use the era slider to see how it transforms across different time periods
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold">Era Transformation</h3>
          <Badge variant="outline" style={{ borderColor: getEraColor(era), color: getEraColor(era) }}>
            {getEraLabel(era)}
          </Badge>
        </div>
        <div className="flex gap-2">
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
          {transformedImage && onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Image */}
        <Card className="overflow-hidden glow-card">
          <div className="relative aspect-video bg-muted/20">
            {originalImage ? (
              <img 
                src={originalImage} 
                alt="Original" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-muted-foreground">No image selected</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h4 className="font-medium">Original Image</h4>
            <p className="text-sm text-muted-foreground">Reference image (Modern era)</p>
          </div>
        </Card>

        {/* Transformed Image */}
        <Card className="overflow-hidden glow-card">
          <div className="relative aspect-video bg-muted/20">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-medium">AI is transforming your image...</p>
                  <p className="text-xs text-muted-foreground">
                    Applying {getEraLabel(era)} styling and aesthetics
                  </p>
                </div>
              </div>
            ) : transformedImage ? (
              <img 
                src={transformedImage} 
                alt={`Transformed to ${getEraLabel(era)}`}
                className="w-full h-full object-cover era-transition"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-muted-foreground">
                  Move the era slider to generate transformation
                </span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h4 className="font-medium" style={{ color: getEraColor(era) }}>
              {getEraLabel(era)} Style
            </h4>
            <p className="text-sm text-muted-foreground">
              AI-transformed with era-appropriate styling
            </p>
          </div>
        </Card>
      </div>

      {originalImage && transformedImage && (
        <Card className="p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium mb-1">Quick Compare</h4>
              <p className="text-sm text-muted-foreground">
                Click to toggle between original and transformed image
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOriginal(!showOriginal)}
            >
              Show {showOriginal ? 'Transformed' : 'Original'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};