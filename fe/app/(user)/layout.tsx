import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
      <Header />
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
