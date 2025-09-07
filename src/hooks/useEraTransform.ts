import { useState, useCallback } from "react";
import { toast } from "sonner";

interface TransformRequest {
  imageUrl: string;
  era: number;
}

interface TransformResponse {
  imageUrl: string;
  era: number;
}

export const useEraTransform = () => {
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformedImages, setTransformedImages] = useState<Map<number, string>>(new Map());

  const transformImage = useCallback(async (request: TransformRequest): Promise<string | null> => {
    setIsTransforming(true);
    
    try {
      // Check if we already have this transformation cached
      const cached = transformedImages.get(request.era);
      if (cached) {
        return cached;
      }

      // In a real implementation, this would call your backend API
      // For now, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Replace with actual API call to your backend
      /*
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to transform image');
      }

      const result: TransformResponse = await response.json();
      */
      
      // For demo purposes, return the original image
      // In production, this would be the AI-transformed image URL
      const result = {
        imageUrl: request.imageUrl,
        era: request.era
      };

      // Cache the result
      setTransformedImages(prev => new Map(prev).set(request.era, result.imageUrl));
      
      toast.success(`Image transformed to ${getEraLabel(request.era)} style!`);
      return result.imageUrl;
      
    } catch (error) {
      console.error('Error transforming image:', error);
      toast.error('Failed to transform image. Please try again.');
      return null;
    } finally {
      setIsTransforming(false);
    }
  }, [transformedImages]);

  const clearCache = useCallback(() => {
    setTransformedImages(new Map());
  }, []);

  return {
    transformImage,
    isTransforming,
    clearCache,
  };
};

const getEraLabel = (year: number) => {
  switch (year) {
    case 1900: return "Early 1900s";
    case 1950: return "Mid Century";
    case 2000: return "Modern";
    case 2050: return "Future";
    default: return `${year}s`;
  }
};