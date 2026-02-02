import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ImageUploader } from '@/app/components/ImageUploader';
import { SubjectInput } from '@/app/components/SubjectInput';
import { PromptInput } from '@/app/components/PromptInput';
import { ModeSelector } from '@/app/components/ModeSelector';
import { ModelSelector } from '@/app/components/ModelSelector';
import { Sparkles, Info } from 'lucide-react';

export function Explain() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('beginner');
  const [model, setModel] = useState('deepseek/deepseek-r1-0528:free');

  // Load default model from localStorage if present
  useEffect(() => {
    const stored = localStorage.getItem('DEFAULT_MODEL');
    if (stored) setModel(stored);
  }, []);

  const handleImageSelect = (_file: File, preview: string) => {
    setSelectedImage(preview);
  };

  const handleClearImage = () => {
    setSelectedImage('');
  };

  const handleExplain = () => {
    // Store the data and navigate to result page
    const explanationData = {
      image: selectedImage,
      subject,
      prompt: prompt || 'Explain this image in detail',
      mode,
      model
    };
    
    // In a real app, you'd call an API here
    // For demo, we'll store in sessionStorage and navigate
    sessionStorage.setItem('explanationData', JSON.stringify(explanationData));
    navigate('/result');
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explain Your Image</h1>
        <p className="text-muted-foreground">
          Upload an image and configure how you'd like it explained
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>Select the diagram, chart, or note you want explained</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onClear={handleClearImage}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Customize how the AI explains your image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SubjectInput value={subject} onChange={setSubject} />
              <PromptInput value={prompt} onChange={setPrompt} />
              <ModeSelector value={mode} onChange={setMode} />
              <ModelSelector value={model} onChange={setModel} />
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            disabled={!selectedImage}
            onClick={handleExplain}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Explain Image
          </Button>
        </div>

        {/* Right Column - Info Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">How It Works</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI will analyze your image and provide explanations based on your selected mode.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Export Options</h4>
                <p className="text-sm text-muted-foreground">
                  After getting your explanation, you can export it as PDF, image, or copy the text for your notes.
                </p>
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Your images are processed securely and are not stored on our servers.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
