import { Link } from "react-router-dom";
import { ArrowRight, Cpu, MemoryStick, HardDrive, Monitor } from "lucide-react";

export const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-outer)] bg-foreground text-background">
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-12">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-background/10 rounded-full text-xs font-mono uppercase tracking-wider">
            Featured
          </div>
          <h1 className="text-3xl lg:text-5xl font-display font-bold tracking-tight leading-tight">
            Precision Tools for<br />the Modern Workflow
          </h1>
          <p className="text-background/60 text-sm lg:text-base max-w-md">
            Powering performance, built for every ambition. Explore our curated collection of premium electronics.
          </p>
          <div className="flex items-center gap-8 pt-2">
            <div className="flex items-center gap-2">
              <Cpu size={20} className="text-primary" />
              <div>
                <p className="spec-label text-background/40">Processor</p>
                <p className="text-sm font-medium">Intel® Core™ i5</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MemoryStick size={20} className="text-primary" />
              <div>
                <p className="spec-label text-background/40">RAM</p>
                <p className="text-sm font-medium">8 GB DDR5</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <HardDrive size={20} className="text-primary" />
              <div>
                <p className="spec-label text-background/40">Storage</p>
                <p className="text-sm font-medium">512 GB SSD</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Monitor size={20} className="text-primary" />
              <div>
                <p className="spec-label text-background/40">Display</p>
                <p className="text-sm font-medium">14" FHD</p>
              </div>
            </div>
          </div>
          <Link
            to="/category/laptops-computers"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium
                     transition-all duration-200 active:scale-[0.98] active:brightness-90
                     shadow-[0_1px_0_rgba(255,255,255,0.2)_inset] hover:brightness-110"
          >
            Shop Here <ArrowRight size={16} />
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop"
            alt="Featured laptop"
            className="w-full max-w-md object-contain rounded-lg"
          />
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
    </div>
  );
};
