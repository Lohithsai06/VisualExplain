import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PromptInput({ value, onChange }: PromptInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="prompt">What do you want to understand?</Label>
      <Textarea
        id="prompt"
        placeholder="Explain this diagram in simple terms..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="resize-none"
      />
      <p className="text-xs text-muted-foreground">
        Be specific about what you want to learn from this image
      </p>
    </div>
  );
}
