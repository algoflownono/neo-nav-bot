import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { categories } from "@/data/products";

export const CategorySidebar = () => {
  const location = useLocation();

  return (
    <nav className="w-full lg:w-56 shrink-0 bg-card border border-border rounded-[var(--radius-outer)] p-2 shadow-[var(--shadow-sm)]">
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
      <ul className="space-y-0.5">
        {categories.map(cat => {
          const isActive = location.pathname.includes(cat.slug);
          return (
            <li key={cat.slug}>
              <Link
                to={`/category/${cat.slug}`}
                className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-200
                  ${isActive
                    ? "bg-primary/10 text-primary font-medium border border-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">{cat.icon}</span>
                  {cat.name}
                </span>
                <ChevronRight size={14} className={isActive ? "text-primary" : "text-muted-foreground/40"} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
