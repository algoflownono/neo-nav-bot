import { Link } from "react-router-dom";
import { ArrowRight, Cpu, MemoryStick, HardDrive, Monitor } from "lucide-react";

export const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-outer)] bg-gradient-to-br from-foreground via-foreground to-primary/20 text-background">
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 p-6 sm:p-8 lg:p-12">
        <div className="flex-1 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs font-mono uppercase tracking-wider text-primary-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Featured
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-display font-bold tracking-tight leading-tight">
            Precision Tools for<br className="hidden sm:block" />the Modern Workflow
          </h1>
          <p className="text-background/60 text-xs sm:text-sm lg:text-base max-w-md">
            Powering performance, built for every ambition. Explore our curated collection of premium electronics.
          </p>
          <div className="flex items-center gap-4 sm:gap-8 pt-2 flex-wrap">
            {[
              { icon: Cpu, label: "Processor", value: "Intel® Core™ i5", show: true },
              { icon: MemoryStick, label: "RAM", value: "8 GB DDR5", show: true },
              { icon: HardDrive, label: "Storage", value: "512 GB SSD", showClass: "hidden sm:flex" },
              { icon: Monitor, label: "Display", value: '14" FHD', showClass: "hidden md:flex" },
            ].map((spec, i) => (
              <div key={i} className={`${spec.showClass || "flex"} items-center gap-2`}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                  <spec.icon size={16} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="spec-label text-background/40 text-[9px]">{spec.label}</p>
                  <p className="text-xs sm:text-sm font-medium">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/category/laptops-computers"
            className="btn-primary mt-2"
          >
            Shop Here <ArrowRight size={16} />
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-8 bg-primary/10 rounded-full blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop"
              alt="Featured laptop"
              className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md object-contain rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Decorative corner gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/8 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/5 to-transparent" />
    </div>
  );
};
