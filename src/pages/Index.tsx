import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { CategorySidebar } from "@/components/CategorySidebar";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductSection } from "@/components/ProductSection";
import { BrandStrip } from "@/components/BrandStrip";
import { DealCountdown } from "@/components/DealCountdown";
import {
  getNewArrivals,
  getBestPrice,
  getDealOfTheWeek,
  getPopular,
  products,
} from "@/data/products";

const Index = () => {
  const newArrivals = getNewArrivals();
  const bestPrice = getBestPrice().slice(0, 4);
  const deals = getDealOfTheWeek();
  const popular = getPopular();
  const laptops = products.filter(p => p.categorySlug.includes("laptop")).slice(0, 4);
  const mobiles = products.filter(p => p.categorySlug.includes("mobil")).slice(0, 6);

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <Header />
      <main className="neo-container">
        {/* Hero + Categories */}
        <div className="flex gap-4 sm:gap-6 py-4 sm:py-8">
          <div className="hidden lg:block">
            <CategorySidebar />
          </div>
          <div className="flex-1 min-w-0">
            <HeroBanner />
          </div>
        </div>

        {/* New Arrivals + Best Price */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-8">
          <div className="lg:col-span-3">
            <ProductSection title="New Arrivals" products={newArrivals.slice(0, 4)} viewAllLink="/category/new-arrivals" />
          </div>
          <div className="lg:col-span-2">
            <ProductSection title="Best Price" products={bestPrice.slice(0, 3)} viewAllLink="/category/best-price" columns={3} />
          </div>
        </div>

        {/* Deal of the Week */}
        <section className="py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-destructive rounded-full" />
              <h2 className="section-title">Deal Of The Week</h2>
            </div>
            <DealCountdown />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {deals.map((p, i) => (
              <div key={p.id}>
                <ProductSection title="" products={[p]} />
              </div>
            ))}
          </div>
        </section>

        {/* Laptops */}
        <ProductSection title="Laptops" products={laptops} viewAllLink="/category/laptops-computers" />

        {/* Mobiles */}
        <ProductSection title="Mobiles And Tablets" products={mobiles} viewAllLink="/category/mobiles-tablets" columns={6} />

        {/* Popular */}
        <ProductSection title="Popular" products={popular.slice(0, 6)} viewAllLink="/category/popular" columns={6} />

        {/* Brand Strip */}
        <BrandStrip />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
