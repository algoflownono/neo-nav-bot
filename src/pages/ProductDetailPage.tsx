import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, products, formatPrice } from "@/data/products";
import { cartStore } from "@/data/cart";
import { ChevronRight, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="neo-container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 flex-wrap">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight size={12} />
          <Link to={`/category/${product.categorySlug}`} className="hover:text-foreground">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-foreground truncate">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="bg-accent rounded-[var(--radius-outer)] p-8 flex items-center justify-center aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="spec-label mb-2">{product.brand}</p>
              <h1 className="text-2xl lg:text-3xl font-display font-bold tracking-tight">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-sm flex items-center justify-center text-[10px] font-bold
                      ${i < Math.floor(product.rating) ? "bg-foreground text-background" : "bg-border text-muted-foreground"}`}
                  >
                    ★
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Specs */}
            <div className="flex gap-3 flex-wrap">
              {product.specs.map((spec, i) => (
                <span key={i} className="px-3 py-1.5 bg-accent rounded-md text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {spec}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="price-display text-3xl">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="price-original text-lg">{formatPrice(product.originalPrice)}</span>
              )}
              {product.discount && (
                <span className="neo-badge-sale">{product.discount}% off</span>
              )}
            </div>

            {/* Stock */}
            <div className="text-sm">
              {product.inStock ? (
                <span className="text-success font-medium font-mono">
                  In Stock{product.stockCount ? `: ${product.stockCount} Units` : ""}
                </span>
              ) : (
                <span className="text-destructive font-medium">Out of Stock</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium
                         transition-all duration-200 active:scale-[0.98] active:brightness-90
                         shadow-[0_1px_0_rgba(255,255,255,0.2)_inset] hover:brightness-110
                         disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
                Add to Kit
              </button>
              <button
                onClick={() => { handleAddToCart(); }}
                disabled={!product.inStock}
                className="px-6 py-3 border border-border rounded-md font-medium text-foreground
                         hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Truck size={18} className="text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Shield size={18} className="text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">3 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <RotateCcw size={18} className="text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "description"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "specs"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Specifications
            </button>
          </div>
          <div className="py-8">
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
                          <td className="py-2.5 font-medium text-foreground w-40">{key}</td>
                          <td className="py-2.5 text-muted-foreground font-mono text-xs">{val}</td>
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
          <section className="py-12 border-t border-border">
            <h2 className="section-title mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
