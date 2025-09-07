import { useState, useCallback } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { EraSlider } from "@/components/EraSlider";
import { ImageComparison } from "@/components/ImageComparison";
import { useEraTransform } from "@/hooks/useEraTransform";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Info, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import heroBackground from "@/assets/hero-background.jpg";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [currentEra, setCurrentEra] = useState<number[]>([2000]);
  const [transformedImageUrl, setTransformedImageUrl] = useState<string | null>(null);
  
  const { transformImage, isTransforming, clearCache } = useEraTransform();

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    clearCache();
    setTransformedImageUrl(null);
  }, [clearCache]);

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
    setOriginalImageUrl(null);
    setTransformedImageUrl(null);
    clearCache();
  }, [clearCache]);

  const handleEraChange = useCallback(async (value: number[]) => {
    setCurrentEra(value);
    
    if (originalImageUrl && value[0] !== 2000) {
      const result = await transformImage({
        imageUrl: originalImageUrl,
        era: value[0]
      });
      
      if (result) {
        setTransformedImageUrl(result);
      }
    } else {
      setTransformedImageUrl(null);
    }
  }, [originalImageUrl, transformImage]);

  const handleDownload = useCallback(() => {
    if (transformedImageUrl) {
      const link = document.createElement('a');
      link.href = transformedImageUrl;
      link.download = `era-blend-${currentEra[0]}.jpg`;
      link.click();
    }
  }, [transformedImageUrl, currentEra]);

  const handleReset = useCallback(() => {
    setCurrentEra([2000]);
    setTransformedImageUrl(null);
    clearCache();
  }, [clearCache]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-primary/20 glow-primary">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Powered by AI
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
              Era Blender
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Transform any image across time periods with AI
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a modern image and watch as AI reimagines it through different eras - 
              from Victorian elegance to futuristic visions, maintaining perfect scene continuity.
            </p>
          </div>
        </div>
      </section>

      <Separator className="opacity-20" />

      {/* Main Application */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">1</span>
                Upload Reference Image
              </h2>
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onRemoveImage={handleRemoveImage}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">2</span>
                Choose Time Period
              </h2>
              <EraSlider
                value={currentEra}
                onValueChange={handleEraChange}
                isTransforming={isTransforming}
              />
            </div>

            {/* Backend Integration Notice */}
            <Card className="p-6 bg-amber-500/10 border-amber-500/20">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-amber-700 dark:text-amber-300">
                    Backend Integration Required
                  </h3>
                  <p className="text-sm text-amber-700/80 dark:text-amber-300/80">
                    This frontend is ready! You'll need to create a backend API that integrates with Google Gemini 2.5 Flash. 
                    Consider using Supabase Edge Functions instead of Node.js for seamless integration.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <a href="https://supabase.com/docs/guides/functions" target="_blank" rel="noopener noreferrer">
                      Learn about Edge Functions
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">3</span>
              Era Transformation
            </h2>
            <ImageComparison
              originalImage={originalImageUrl}
              transformedImage={transformedImageUrl}
              era={currentEra[0]}
              isLoading={isTransforming}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-border/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Era Blender (TimeLens) - AI-Powered Time Travel</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline">Demo Mode</Badge>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                View Code
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
