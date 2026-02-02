import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { Toaster } from '@/app/components/ui/sonner';
import { MainLayout } from '@/app/layouts/MainLayout';
import { Home } from '@/app/pages/Home';
import { Explain } from '@/app/pages/Explain';
import { Result } from '@/app/pages/Result';
import { Settings } from '@/app/pages/Settings';
import { NotFound } from '@/app/pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explain" element={<Explain />} />
            <Route path="/result" element={<Result />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}
