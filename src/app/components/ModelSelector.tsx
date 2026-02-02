import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const models = [
    {
      value: 'deepseek/deepseek-r1-0528:free',
      label: 'DeepSeek R1',
      description: 'Reasoning-focused model (recommended)'
    },
    {
      value: 'google/gemma-3-27b-it:free',
      label: 'Google Gemma 3 27B (it)',
      description: 'High-quality text generation'
    }
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="model-select">AI Model</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="model-select">
          <SelectValue>
            {models.find((m) => m.value === value)?.label || <span className="text-muted-foreground">Select an AI model</span>}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              <div className="flex flex-col">
                <span className="font-medium">{model.label}</span>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
