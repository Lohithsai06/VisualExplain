import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ModelSelector } from '@/app/components/ModelSelector';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { Info, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [defaultModel, setDefaultModel] = useState('deepseek/deepseek-r1-0528:free');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load persisted settings on mount
    const storedKey = localStorage.getItem('OPENROUTER_API_KEY');
    const storedModel = localStorage.getItem('DEFAULT_MODEL');
    if (storedKey) setApiKey(storedKey);
    if (storedModel) setDefaultModel(storedModel);
  }, []);

  const handleSave = () => {
    // Persist settings to localStorage
    localStorage.setItem('OPENROUTER_API_KEY', apiKey);
    localStorage.setItem('DEFAULT_MODEL', defaultModel);
    setSaved(true);
    toast.success('Settings saved successfully!');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    localStorage.removeItem('OPENROUTER_API_KEY');
    localStorage.removeItem('DEFAULT_MODEL');
    setApiKey('');
    setDefaultModel('deepseek/deepseek-r1-0528:free');
    toast.success('Settings reset successfully!');
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and API configuration
        </p>
      </div>

      <div className="space-y-6">
        {/* API Key Section */}
        <Card>
          <CardHeader>
            <CardTitle>OpenRouter API Key</CardTitle>
            <CardDescription>
              Configure your OpenRouter API key for AI model access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-or-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Your API key is stored securely in your browser's local storage and is never sent to our servers.
              </AlertDescription>
            </Alert>
            <Button onClick={handleSave} disabled={!apiKey}>
              <Save className="w-4 h-4 mr-2" />
              {saved ? 'Saved!' : 'Save API Key'}
            </Button>
          </CardContent>
        </Card>

        {/* Model Preference */}
        <Card>
          <CardHeader>
            <CardTitle>Default Model</CardTitle>
            <CardDescription>
              Choose your preferred AI model for explanations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ModelSelector value={defaultModel} onChange={setDefaultModel} />
          </CardContent>
        </Card>

        {/* Theme Section */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how VisualExplain looks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark mode
                  </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Reset Section */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Reset all settings to default values
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleReset}>
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
