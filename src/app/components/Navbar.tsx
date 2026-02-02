import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { Button } from '@/app/components/ui/button';

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-lg hidden sm:block">VisualExplain</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explain"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/explain') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Explain
            </Link>
            <Link
              to="/settings"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/settings') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Settings
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
