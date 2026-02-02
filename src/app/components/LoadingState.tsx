import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

export function LoadingState() {
  return (
    <div className="w-full space-y-6">
      <Card>
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
              <Loader2 className="w-24 h-24 text-primary absolute -top-2 -left-2 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">AI is explaining your image...</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                This usually takes a few seconds. We're analyzing the image and generating a clear explanation for you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton for explanation */}
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded-md w-3/4 animate-pulse" />
        <div className="h-4 bg-muted rounded-md w-full animate-pulse" />
        <div className="h-4 bg-muted rounded-md w-5/6 animate-pulse" />
        <div className="h-4 bg-muted rounded-md w-4/6 animate-pulse" />
      </div>
    </div>
  );
}
