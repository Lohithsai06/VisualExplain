import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface SubjectInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SubjectInput({ value, onChange }: SubjectInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="subject">Subject (optional)</Label>
      <Input
        id="subject"
        placeholder="e.g. Computer Networks, Anatomy, DBMS"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-muted-foreground">
        Helps the AI provide more context-specific explanations
      </p>
    </div>
  );
}
