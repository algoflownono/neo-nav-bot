import { useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cartStore } from "@/data/cart";
import { formatPrice } from "@/data/products";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const CheckoutPage = () => {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="neo-container py-24 text-center">
          <ShoppingBag size={64} className="mx-auto text-muted-foreground/30 mb-6" strokeWidth={1} />
          <h1 className="text-2xl font-display font-semibold mb-3">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to get started</p>
          <Link
            to="/"
            className="inline-flex bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:brightness-110 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="neo-container py-8">
        <h1 className="text-2xl font-display font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="flex gap-4 p-4 bg-card border border-border rounded-lg">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-md bg-accent" />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.slug}`} className="text-sm font-medium hover:text-primary transition-colors">
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">{item.product.brand}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cartStore.updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center border border-border rounded text-muted-foreground hover:text-foreground"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-mono tabular-nums w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => cartStore.updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center border border-border rounded text-muted-foreground hover:text-foreground"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="price-display">{formatPrice(item.product.price * item.quantity)}</span>
                      <button
                        onClick={() => cartStore.removeItem(item.product.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
            <h2 className="font-display font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-mono tabular-nums">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-mono text-success">Free</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="price-display">{formatPrice(total)}</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium
                           transition-all duration-200 active:scale-[0.98] hover:brightness-110
                           shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]">
              Place Order
            </button>
            <p className="text-[11px] text-muted-foreground text-center mt-3">
              Secure checkout powered by NeoStore
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
