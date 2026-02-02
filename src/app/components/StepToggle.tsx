import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';

interface StepToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function StepToggle({ enabled, onChange }: StepToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="step-toggle" checked={enabled} onCheckedChange={onChange} />
      <Label htmlFor="step-toggle" className="cursor-pointer text-foreground">
        Show step-by-step explanation
      </Label>
    </div>
  );
}
