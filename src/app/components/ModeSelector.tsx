import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';

interface ModeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const modes = [
    {
      value: 'beginner',
      label: 'Beginner',
      description: 'Simple and easy-to-understand explanations'
    },
    {
      value: 'exam',
      label: 'Exam-Oriented',
      description: 'Focused on key points for exams'
    },
    {
      value: 'conceptual',
      label: 'Conceptual',
      description: 'Deep understanding of concepts'
    },
    {
      value: 'quick',
      label: 'Quick Revision',
      description: 'Brief summary for quick review'
    }
  ];

  return (
    <div className="space-y-4">
      <Label className="text-base">Explanation Mode</Label>
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modes.map((mode) => (
          <div key={mode.value} className="flex items-start space-x-3">
            <RadioGroupItem value={mode.value} id={mode.value} className="mt-1" />
            <div className="flex-1 cursor-pointer" onClick={() => onChange(mode.value)}>
              <Label htmlFor={mode.value} className="cursor-pointer font-medium">
                {mode.label}
              </Label>
              <p className="text-sm text-muted-foreground">{mode.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
