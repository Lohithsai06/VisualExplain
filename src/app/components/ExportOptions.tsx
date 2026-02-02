import { Button } from '@/app/components/ui/button';
import { FileDown, Image, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ExportOptionsProps {
  onExportPDF: () => Promise<void> | void;
  onExportImage: () => Promise<void> | void;
  disabled?: boolean;
}

export function ExportOptions({ onExportPDF, onExportImage, disabled }: ExportOptionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyText = async () => {
    try {
      const text = sessionStorage.getItem('explanationText') || '';
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={onExportPDF} disabled={disabled} className="text-foreground">
        <FileDown className="w-4 h-4 mr-2" />
        Export as PDF
      </Button>
      <Button variant="outline" onClick={onExportImage} disabled={disabled} className="text-foreground">
        <Image className="w-4 h-4 mr-2" />
        Export as Image
      </Button>
      <Button variant="outline" onClick={handleCopyText} className="text-foreground">
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy Text
          </>
        )}
      </Button>
    </div>
  );
}
