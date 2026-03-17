import { brands } from "@/data/products";

export const BrandStrip = () => {
  return (
    <section className="py-12 border-t border-border">
      <div className="flex items-center justify-center gap-12 flex-wrap">
        {brands.map(brand => (
          <div
            key={brand.name}
            className="text-lg font-display font-bold text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors cursor-pointer tracking-tight"
          >
            {brand.logo}
          </div>
        ))}
      </div>
    </section>
  );
};
