import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <section id="products" className="container py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Shop Our Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover premium products carefully selected for your beloved pets
          </p>
        </div>
        
        <ProductGrid />
      </section>
    </div>
  );
};

export default Index;
