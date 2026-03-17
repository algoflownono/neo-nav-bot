import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products, categories, type Product } from "@/data/products";
import { ChevronRight, SlidersHorizontal } from "lucide-react";

const priceRanges = [
  { label: "Under Rs.10,000", min: 0, max: 10000 },
  { label: "Rs.10,000 - Rs.50,000", min: 10000, max: 50000 },
  { label: "Rs.50,000 - Rs.100,000", min: 50000, max: 100000 },
  { label: "Rs.100,000 - Rs.200,000", min: 100000, max: 200000 },
  { label: "Over Rs.200,000", min: 200000, max: Infinity },
];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState("latest");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = categories.find(c => c.slug === slug);
  const title = category?.name || slug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Products";

  let filtered = slug === "new-arrivals"
    ? products.filter(p => p.isNew)
    : slug === "best-price"
    ? products.filter(p => p.discount && p.discount > 0)
    : slug === "popular"
    ? [...products].sort((a, b) => b.reviews - a.reviews)
    : products.filter(p =>
        p.categorySlug === slug ||
        p.categorySlug.includes(slug || "") ||
        (category?.subcategories?.some(s => s.slug === p.categorySlug))
      );

  // Brand filter
  const availableBrands = [...new Set(filtered.map(p => p.brand))];
  if (selectedBrands.length > 0) {
    filtered = filtered.filter(p => selectedBrands.includes(p.brand));
  }

  // Price filter
  if (selectedPrice !== null) {
    const range = priceRanges[selectedPrice];
    filtered = filtered.filter(p => p.price >= range.min && p.price < range.max);
  }

  // Sort
  if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "name") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="neo-container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{title}</span>
        </nav>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`
            ${filtersOpen ? "fixed inset-0 z-50 bg-background p-6 overflow-auto" : "hidden"}
            lg:block lg:static lg:w-56 lg:shrink-0
          `}>
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h2 className="font-display font-semibold text-lg">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} className="text-sm text-primary">Close</button>
            </div>

            <h2 className="font-display font-semibold text-lg mb-6 hidden lg:block">Filters</h2>

            {/* Price */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Price</h3>
              <div className="space-y-2">
                {priceRanges.map((range, i) => (
                  <label key={i} className="filter-checkbox">
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPrice === i}
                      onChange={() => setSelectedPrice(selectedPrice === i ? null : i)}
                      className="w-3.5 h-3.5 rounded-sm border-border text-primary focus:ring-primary"
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            {availableBrands.length > 1 && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Brand</h3>
                <div className="space-y-2">
                  {availableBrands.map(brand => (
                    <label key={brand} className="filter-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-3.5 h-3.5 rounded-sm border-border text-primary focus:ring-primary"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-display font-semibold">{title}</h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 text-sm text-muted-foreground border border-border px-3 py-1.5 rounded-md"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm bg-accent border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="latest">Sort by latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24 text-muted-foreground">
                <p className="text-lg mb-2">No products found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
