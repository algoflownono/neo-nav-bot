import { brands } from "@/data/products";

export const BrandStrip = () => {
  return (
    <section className="py-8 sm:py-12 border-t border-border">
      <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6 sm:mb-8">Trusted Brands</p>
      <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-12 flex-wrap">
        {brands.map(brand => (
          <div
            key={brand.name}
            className="text-base sm:text-lg font-display font-bold text-muted-foreground/25 hover:text-primary/60 transition-colors duration-300 cursor-pointer tracking-tight"
          >
            {brand.logo}
          </div>
        ))}
      </div>
    </section>
  );
};
