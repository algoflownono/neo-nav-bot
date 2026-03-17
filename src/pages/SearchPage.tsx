import { useSearchParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { ChevronRight } from "lucide-react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = query
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="neo-container py-6">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight size={12} />
          <span className="text-foreground">Search results for "{query}"</span>
        </nav>

        <h1 className="text-xl font-display font-semibold mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-sm text-muted-foreground mb-8">{results.length} products found</p>

        {results.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <p className="text-lg mb-2">No products found</p>
            <p className="text-sm">Try different keywords</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
