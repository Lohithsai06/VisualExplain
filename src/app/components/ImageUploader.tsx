import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage?: string;
  onClear?: () => void;
}

export function ImageUploader({ onImageSelect, selectedImage, onClear }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelect(file, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  if (selectedImage) {
    return (
      <Card className="relative overflow-hidden">
        <div className="relative">
          <img
            src={selectedImage}
            alt="Uploaded preview"
            className="w-full h-auto max-h-96 object-contain rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClear}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`border-2 border-dashed transition-all cursor-pointer ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-accent/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          {isDragging ? (
            <ImageIcon className="w-8 h-8 text-primary animate-pulse" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="space-y-2">
          <p className="font-medium">
            {isDragging ? 'Drop your image here' : 'Drag and drop your image here'}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to browse (PNG, JPG, JPEG, GIF, WebP)
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
    </Card>
  );
}
