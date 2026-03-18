import { useParams, Link, useSearchParams } from "react-router-dom";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ProductCard } from "@/components/ProductCard";
import { products, categories, type Product, formatPrice } from "@/data/products";
import { ChevronRight, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const SORT_OPTIONS = [
  { value: "latest", label: "Sort by latest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Rating" },
];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters from URL
  const sortBy = searchParams.get("sort") || "latest";
  const selectedBrands = searchParams.getAll("brand");
  const urlMinPrice = searchParams.get("minPrice");
  const urlMaxPrice = searchParams.get("maxPrice");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const category = categories.find(c => c.slug === slug);
  const title = category?.name || slug?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Products";

  // Base products for this category
  const baseProducts = useMemo(() => {
    if (slug === "new-arrivals") return products.filter(p => p.isNew);
    if (slug === "best-price") return products.filter(p => p.discount && p.discount > 0);
    if (slug === "popular") return [...products].sort((a, b) => b.reviews - a.reviews);
    return products.filter(p =>
      p.categorySlug === slug ||
      p.categorySlug.includes(slug || "") ||
      (category?.subcategories?.some(s => s.slug === p.categorySlug))
    );
  }, [slug, category]);

  // Price range from base products
  const priceRange = useMemo(() => {
    const prices = baseProducts.map(p => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [baseProducts]);

  const [priceSlider, setPriceSlider] = useState<[number, number]>([
    urlMinPrice ? Number(urlMinPrice) : priceRange.min,
    urlMaxPrice ? Number(urlMaxPrice) : priceRange.max,
  ]);

  // Sync slider with URL on slug change
  useEffect(() => {
    setPriceSlider([
      urlMinPrice ? Number(urlMinPrice) : priceRange.min,
      urlMaxPrice ? Number(urlMaxPrice) : priceRange.max,
    ]);
  }, [slug, priceRange.min, priceRange.max]);

  const availableBrands = useMemo(() => [...new Set(baseProducts.map(p => p.brand))].sort(), [baseProducts]);

  // Update URL params
  const updateParams = useCallback((key: string, value: string | string[] | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (key === "brand") {
        next.delete("brand");
        if (Array.isArray(value)) value.forEach(v => next.append("brand", v));
      } else if (value === null || value === "") {
        next.delete(key);
      } else {
        next.set(key, value as string);
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const toggleBrand = (brand: string) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    updateParams("brand", next);
  };

  const applyPriceFilter = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (priceSlider[0] > priceRange.min) next.set("minPrice", String(priceSlider[0]));
      else next.delete("minPrice");
      if (priceSlider[1] < priceRange.max) next.set("maxPrice", String(priceSlider[1]));
      else next.delete("maxPrice");
      return next;
    }, { replace: true });
  };

  const clearAllFilters = () => {
    setSearchParams({}, { replace: true });
    setPriceSlider([priceRange.min, priceRange.max]);
  };

  const hasActiveFilters = selectedBrands.length > 0 || urlMinPrice || urlMaxPrice || sortBy !== "latest";

  // Apply filters
  const filtered = useMemo(() => {
    let result = [...baseProducts];

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    const minP = urlMinPrice ? Number(urlMinPrice) : priceRange.min;
    const maxP = urlMaxPrice ? Number(urlMaxPrice) : priceRange.max;
    result = result.filter(p => p.price >= minP && p.price <= maxP);

    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "popularity": result.sort((a, b) => b.reviews - a.reviews); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return result;
  }, [baseProducts, selectedBrands, urlMinPrice, urlMaxPrice, sortBy, priceRange]);

  const displayBrands = showAllBrands ? availableBrands : availableBrands.slice(0, 5);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear all */}
      {hasActiveFilters && (
        <button onClick={clearAllFilters} className="text-xs text-destructive hover:underline font-medium">
          Clear all filters
        </button>
      )}

      {/* Price Range Slider */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceSlider}
            onValueChange={(val) => setPriceSlider(val as [number, number])}
            onValueCommit={applyPriceFilter}
            min={priceRange.min}
            max={priceRange.max}
            step={Math.max(100, Math.floor((priceRange.max - priceRange.min) / 100))}
            minStepsBetweenThumbs={1}
          />
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>{formatPrice(priceSlider[0])}</span>
            <span>{formatPrice(priceSlider[1])}</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      {availableBrands.length > 1 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Brand</h3>
          <div className="space-y-2">
            {displayBrands.map(brand => (
              <label key={brand} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-3.5 h-3.5 rounded-sm border-border text-primary focus:ring-primary accent-primary"
                />
                <span className="text-xs">{brand}</span>
                <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                  ({baseProducts.filter(p => p.brand === brand).length})
                </span>
              </label>
            ))}
            {availableBrands.length > 5 && (
              <button
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="flex items-center gap-1 text-xs text-primary hover:underline font-medium mt-1"
              >
                {showAllBrands ? "Show less" : `Show more (${availableBrands.length - 5})`}
                <ChevronDown size={12} className={`transition-transform ${showAllBrands ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      {category?.subcategories && category.subcategories.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Subcategories</h3>
          <div className="space-y-1.5">
            {category.subcategories.map(sub => (
              <Link
                key={sub.slug}
                to={`/category/${sub.slug}`}
                className="block text-xs text-muted-foreground hover:text-primary transition-colors py-1"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <Header />
      <main className="neo-container py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground mb-4 sm:mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-foreground">{title}</span>
        </nav>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {selectedBrands.map(brand => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                {brand} <X size={12} />
              </button>
            ))}
            {(urlMinPrice || urlMaxPrice) && (
              <button
                onClick={() => {
                  setSearchParams(prev => {
                    const next = new URLSearchParams(prev);
                    next.delete("minPrice");
                    next.delete("maxPrice");
                    return next;
                  }, { replace: true });
                  setPriceSlider([priceRange.min, priceRange.max]);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                {formatPrice(Number(urlMinPrice || priceRange.min))} – {formatPrice(Number(urlMaxPrice || priceRange.max))}
                <X size={12} />
              </button>
            )}
            <button onClick={clearAllFilters} className="text-xs text-destructive hover:underline ml-2 font-medium">
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-6 sm:gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-56 lg:shrink-0">
            <div className="bg-card border border-border rounded-[var(--radius-outer)] p-4 shadow-[var(--shadow-sm)] lg:sticky lg:top-32">
              <h2 className="font-display font-semibold text-sm mb-4">Filters</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setFiltersOpen(false)}>
              <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
              <div
                className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card shadow-[var(--shadow-xl)] p-6 overflow-auto animate-slide-in-left"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-semibold text-lg">Filters</h2>
                  <button onClick={() => setFiltersOpen(false)} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent">
                    <X size={20} />
                  </button>
                </div>
                <FilterContent />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-display font-bold truncate">{title}</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} products found</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
                >
                  <SlidersHorizontal size={14} /> Filters
                  {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
                <select
                  value={sortBy}
                  onChange={e => updateParams("sort", e.target.value === "latest" ? null : e.target.value)}
                  className="text-xs sm:text-sm bg-accent border border-border rounded-lg px-2 sm:px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 sm:py-24 text-muted-foreground">
                <p className="text-base sm:text-lg mb-2">No products found</p>
                <p className="text-xs sm:text-sm">Try adjusting your filters</p>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="mt-4 btn-outline text-xs">Clear all filters</button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default CategoryPage;
