import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
import FallingLeaves from '@/components/home/FallingLeaves';
import HeroSection from '@/components/home/HeroSection';
import FeaturedApps from '@/components/home/FeaturedApps';
import CategoriesSection from '@/components/home/CategoriesSection';
import TrendingSection from '@/components/home/TrendingSection';
import AutumnSaleBanner from '@/components/home/AutumnSaleBanner';
import NewsSection from '@/components/home/NewsSection';

export const metadata = {
  title: 'AppDistribution - Discover Amazing Software',
  description: 'Browse, buy and download the best apps with exclusive autumn deals.',
};

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden text-stone-100"
      style={{ background: 'linear-gradient(180deg,#0d0907 0%,#100b05 100%)' }}
    >
      <FallingLeaves />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <FeaturedApps />
          <CategoriesSection />
          <TrendingSection />
          <AutumnSaleBanner />
          <NewsSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
