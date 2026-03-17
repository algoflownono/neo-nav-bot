import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { type Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

type Props = {
  title: string;
  products: Product[];
  viewAllLink?: string;
  columns?: number;
};

export const ProductSection = ({ title, products, viewAllLink, columns = 4 }: Props) => {
  const gridClass = columns === 6
    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="section-title">{title}</h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All <ChevronRight size={14} />
          </Link>
        )}
      </div>
      <div className={`grid ${gridClass} gap-4`}>
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
};
