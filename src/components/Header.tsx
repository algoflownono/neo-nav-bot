import { useState, useSyncExternalStore } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Package, Star, MapPin } from "lucide-react";
import { cartStore } from "@/data/cart";
import { products } from "@/data/products";
import { CartSidebar } from "./CartSidebar";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  const cartItems = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const searchResults = searchQuery.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border shadow-[var(--shadow-sm)]">
        {/* Top bar */}
        <div className="neo-container">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3 sm:gap-4">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="text-xl sm:text-2xl font-display font-bold tracking-tighter text-primary">
                neo
              </div>
            </Link>

            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl relative">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  placeholder="Search products..."
                  className="w-full h-10 pl-4 pr-10 bg-accent border border-border rounded-lg text-sm
                           placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20
                           focus:border-primary transition-all"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                  <Search size={16} />
                </button>
              </div>

              {/* Search Results Dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-[var(--shadow-lg)] overflow-hidden z-50">
                  {searchResults.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="flex items-center gap-3 p-3 hover:bg-accent transition-colors"
                      onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                    >
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg bg-accent" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="price-display text-xs">Rs.{product.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Link to="/rewards" className="hidden sm:flex items-center gap-1.5 px-2 sm:px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-accent transition-colors">
                <Star size={14} />
                <span className="hidden md:inline">Rewards</span>
              </Link>
              <Link to="/track-orders" className="hidden sm:flex items-center gap-1.5 px-2 sm:px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-accent transition-colors">
                <Package size={14} />
                <span className="hidden md:inline">Track Orders</span>
              </Link>
              <Link to="/signin" className="flex items-center gap-1.5 px-2 sm:px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-accent transition-colors">
                <User size={16} />
                <span className="hidden md:inline">Sign In</span>
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-1.5 px-2 sm:px-3 py-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-accent transition-colors"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-mono font-bold rounded-full flex items-center justify-center animate-fade-in-up">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="lg:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-10 pl-4 pr-10 bg-accent border border-border rounded-lg text-sm
                         placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Sub nav */}
        <div className="hidden lg:block border-t border-border bg-card/50">
          <div className="neo-container flex items-center justify-between h-10">
            <div className="flex items-center gap-6">
              <Link to="/emi" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                <Star size={12} className="text-warning" /> EMI
              </Link>
              <Link to="/feedback" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                Feedback
              </Link>
            </div>
            <Link to="/service-center" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
              <MapPin size={12} /> Service Center
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <nav className="absolute left-0 top-0 bottom-0 w-72 bg-card shadow-[var(--shadow-xl)] p-6 animate-slide-in-right" onClick={e => e.stopPropagation()}>
            <div className="space-y-1">
              {[
                { name: "Laptops & Computers", slug: "laptops-computers" },
                { name: "Computer Peripherals", slug: "computer-peripherals" },
                { name: "Audio | Headphones", slug: "audio-headphones" },
                { name: "Cameras", slug: "cameras" },
                { name: "Mobiles | Tablets", slug: "mobiles-tablets" },
                { name: "Home | Kitchen", slug: "home-kitchen" },
              ].map(cat => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="block px-3 py-3 text-sm text-foreground hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};
