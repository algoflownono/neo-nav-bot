import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart, GitCompareArrows } from "lucide-react";
import { type Product, formatPrice } from "@/data/products";
import { cartStore } from "@/data/cart";
import { wishlistStore } from "@/data/wishlist";
import { compareStore } from "@/data/compare";
import { toast } from "sonner";
import { useSyncExternalStore } from "react";

type Props = {
  product: Product;
  index?: number;
};

export const ProductCard = ({ product, index = 0 }: Props) => {
  const wishlist = useSyncExternalStore(wishlistStore.subscribe, wishlistStore.getSnapshot);
  const compare = useSyncExternalStore(compareStore.subscribe, compareStore.getSnapshot);
  const isWishlisted = wishlist.some(p => p.id === product.id);
  const isComparing = compare.some(p => p.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    cartStore.addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = wishlistStore.toggle(product);
    toast(added ? "Added to wishlist" : "Removed from wishlist");
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = compareStore.toggle(product);
    if (result === null) {
      toast.error("You can compare up to 4 products");
    } else {
      toast(result ? "Added to compare" : "Removed from compare");
    }
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group product-card"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.discount && product.discount > 0 && (
          <span className="neo-badge-sale">{product.discount}% off</span>
        )}
        {product.isNew && <span className="neo-badge-new">New</span>}
        {product.isLimitedStock && <span className="neo-badge-stock">Limited</span>}
        {!product.inStock && (
          <span className="neo-badge bg-muted text-muted-foreground">Sold Out</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          onClick={handleWishlist}
          className={`w-8 h-8 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all duration-200
            ${isWishlisted
              ? "bg-destructive/10 border-destructive/30 text-destructive"
              : "bg-card/80 border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/30"
            }`}
          title="Add to wishlist"
        >
          <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        <button
          onClick={handleCompare}
          className={`w-8 h-8 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all duration-200
            ${isComparing
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-card/80 border-border/50 text-muted-foreground hover:text-primary hover:border-primary/30"
            }`}
          title="Add to compare"
        >
          <GitCompareArrows size={14} />
        </button>
      </div>

      {/* Image */}
      <div className="product-card-image relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Quick Specs */}
      <div className="flex gap-1 flex-wrap px-0.5">
        {product.specs.slice(0, 3).map((spec, i) => (
          <span key={i} className="px-1.5 py-0.5 bg-accent rounded text-[9px] sm:text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
            {spec}
          </span>
        ))}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-1 min-h-0 px-0.5">
        <p className="text-[10px] sm:text-xs text-muted-foreground font-mono uppercase tracking-wider">{product.brand}</p>
        <h3 className="text-xs sm:text-sm font-medium leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex gap-px">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < Math.floor(product.rating) ? "fill-warning text-warning" : "text-border"}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
        </div>

        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div>
            <span className="price-display text-sm sm:text-base">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="price-original ml-1.5 text-[10px] sm:text-xs">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="p-2 rounded-lg bg-primary text-primary-foreground
                     hover:shadow-[var(--shadow-glow)] hover:brightness-110
                     disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200
                     active:scale-90 shrink-0"
            title="Add to cart"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
};
