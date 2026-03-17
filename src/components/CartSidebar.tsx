import { useSyncExternalStore } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { cartStore } from "@/data/cart";
import { formatPrice } from "@/data/products";

type Props = { open: boolean; onClose: () => void };

export const CartSidebar = ({ open, onClose }: Props) => {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-lg animate-slide-in-right flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-display font-semibold">Cart ({items.length})</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingBag size={48} strokeWidth={1} />
            <p className="text-sm">Your cart is empty</p>
            <button onClick={onClose} className="text-sm text-primary hover:underline">
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 p-3 bg-accent rounded-lg">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="price-display text-sm mt-1">{formatPrice(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => cartStore.updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center border border-border rounded text-muted-foreground hover:text-foreground"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-mono tabular-nums w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => cartStore.updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center border border-border rounded text-muted-foreground hover:text-foreground"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => cartStore.removeItem(item.product.id)}
                        className="ml-auto text-xs text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="price-display text-lg">{formatPrice(total)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full text-center bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium
                         transition-all duration-200 active:scale-[0.98] active:brightness-90
                         shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
