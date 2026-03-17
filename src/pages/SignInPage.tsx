import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { User, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="neo-container py-16 flex justify-center">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold">Sign In</h1>
            <p className="text-sm text-muted-foreground mt-2">Welcome back to NeoStore</p>
          </div>

          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="w-full h-10 pl-10 pr-4 bg-accent border border-border rounded-md text-sm
                           placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-10 pl-10 pr-4 bg-accent border border-border rounded-md text-sm
                           placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium
                       transition-all duration-200 active:scale-[0.98] hover:brightness-110
                       shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignInPage;
