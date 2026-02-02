import { Outlet } from 'react-router-dom';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#020617]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
