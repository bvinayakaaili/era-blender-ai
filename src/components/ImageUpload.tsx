import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onRemoveImage: () => void;
}

export const ImageUpload = ({ onImageSelect, selectedImage, onRemoveImage }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false
  });

  const handleRemove = () => {
    onRemoveImage();
    setPreview(null);
  };

  if (selectedImage && preview) {
    return (
      <Card className="relative overflow-hidden glow-card">
        <div className="relative">
          <img 
            src={preview} 
            alt="Selected reference" 
            className="w-full h-64 object-cover"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            Reference image loaded - adjust the era slider to see transformations
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      {...getRootProps()} 
      className={`
        border-2 border-dashed cursor-pointer smooth-transition glow-card
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}
        hover:border-primary hover:bg-primary/5
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 p-4 rounded-full bg-primary/10">
          {isDragActive ? (
            <Upload className="h-8 w-8 text-primary animate-bounce" />
          ) : (
            <ImageIcon className="h-8 w-8 text-primary" />
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold">
          {isDragActive ? "Drop your image here" : "Upload Reference Image"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose a modern image to see how it looks across different eras
        </p>
        <Button variant="outline" className="smooth-transition">
          Select Image
        </Button>
      </div>
    </Card>
  );
};