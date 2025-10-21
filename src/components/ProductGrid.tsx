import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

export const ProductGrid = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const result = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 50 });
      return result.data.products.edges as ShopifyProduct[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🐾</div>
        <h3 className="text-2xl font-bold mb-2">No Products Yet</h3>
        <p className="text-muted-foreground">
          We're setting up our store! Check back soon for amazing pet products.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.map((product) => (
        <ProductCard key={product.node.id} product={product} />
      ))}
    </div>
  );
};
