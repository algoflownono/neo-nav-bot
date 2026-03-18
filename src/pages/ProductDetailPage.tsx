import { useParams, Link } from "react-router-dom";
import { useState, useSyncExternalStore } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { wishlistStore } from "@/data/wishlist";
import { compareStore } from "@/data/compare";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, products, formatPrice } from "@/data/products";
import { cartStore } from "@/data/cart";
import { ChevronRight, ShoppingCart, Truck, Shield, RotateCcw, Star, CheckCircle, Heart, GitCompareArrows } from "lucide-react";
import { toast } from "sonner";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="neo-container py-24 text-center">
          <h1 className="text-2xl font-display font-semibold mb-4">Product Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = products
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    cartStore.addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <Header />
      <main className="neo-container py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground mb-6 sm:mb-8 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to={`/category/${product.categorySlug}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-foreground truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="bg-gradient-to-br from-accent to-muted rounded-[var(--radius-outer)] p-6 sm:p-8 flex items-center justify-center aspect-square border border-border/50 shadow-[var(--shadow-sm)]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="spec-label mb-2">{product.brand}</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold tracking-tight">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-border"}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Specs */}
            <div className="flex gap-2 flex-wrap">
              {product.specs.map((spec, i) => (
                <span key={i} className="px-3 py-1.5 bg-accent border border-border/50 rounded-lg text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {spec}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 bg-accent/50 border border-border/50 rounded-xl p-4">
              <span className="price-display text-2xl sm:text-3xl">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="price-original text-base sm:text-lg">{formatPrice(product.originalPrice)}</span>
              )}
              {product.discount && (
                <span className="neo-badge-sale ml-auto">{product.discount}% off</span>
              )}
            </div>

            {/* Stock */}
            <div className="text-sm flex items-center gap-2">
              {product.inStock ? (
                <>
                  <CheckCircle size={16} className="text-success" />
                  <span className="text-success font-medium font-mono">
                    In Stock{product.stockCount ? `: ${product.stockCount} Units` : ""}
                  </span>
                </>
              ) : (
                <span className="text-destructive font-medium">Out of Stock</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 btn-primary py-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="btn-outline py-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-border">
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: Shield, label: "3 Year Warranty" },
                { icon: RotateCcw, label: "Easy Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center p-3 bg-accent/50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 sm:mt-16">
          <div className="flex border-b border-border gap-0">
            {(["description", "specs"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors capitalize
                  ${activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab === "specs" ? "Specifications" : "Description"}
              </button>
            ))}
          </div>
          <div className="py-6 sm:py-8">
            {activeTab === "description" ? (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {product.description}
              </p>
            ) : (
              <div className="max-w-lg">
                {product.detailedSpecs ? (
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.detailedSpecs).map(([key, val]) => (
                        <tr key={key} className="border-b border-border">
                          <td className="py-3 font-medium text-foreground w-32 sm:w-40">{key}</td>
                          <td className="py-3 text-muted-foreground font-mono text-xs">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-muted-foreground">No detailed specifications available.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="py-8 sm:py-12 border-t border-border">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="section-title">Related Products</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
