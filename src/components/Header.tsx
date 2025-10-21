import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow">
            <span className="text-2xl">🐾</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Fuzzy Finds
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Shop
          </Link>
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>
        
        <CartDrawer />
      </div>
    </header>
  );
};
