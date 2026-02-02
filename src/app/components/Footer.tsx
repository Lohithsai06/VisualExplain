export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} VisualExplain. Built for students who want to learn better.
        </p>
      </div>
    </footer>
  );
}
