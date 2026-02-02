import { Link } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button size="lg">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button size="lg" variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
