import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { type Product, formatPrice } from "@/data/products";
import { cartStore } from "@/data/cart";
import { toast } from "sonner";

type Props = {
  product: Product;
  index?: number;
};

export const ProductCard = ({ product, index = 0 }: Props) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    cartStore.addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="product-card"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        {product.discount && product.discount > 0 && (
          <span className="neo-badge-sale">{product.discount}% off</span>
        )}
        {product.isNew && <span className="neo-badge-new">New</span>}
        {product.isLimitedStock && <span className="neo-badge-stock">Limited</span>}
        {!product.inStock && (
          <span className="neo-badge bg-muted text-muted-foreground">Out of Stock</span>
        )}
      </div>

      {/* Image */}
      <div className="product-card-image">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      {/* Quick Specs Overlay */}
      <div className="absolute bottom-[72px] left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200
                      bg-foreground/90 backdrop-blur-sm rounded-md px-3 py-2 flex gap-3 justify-center">
        {product.specs.map((spec, i) => (
          <span key={i} className="spec-label text-background/80">{spec}</span>
        ))}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-1.5 min-h-0">
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{product.brand}</p>
        <h3 className="text-sm font-medium leading-snug line-clamp-2 text-foreground">{product.name}</h3>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <span className="price-display text-base">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="price-original ml-2">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="p-2 rounded-md bg-primary text-primary-foreground hover:brightness-110
                     disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150
                     active:scale-95 shrink-0"
            title="Add to cart"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
};
