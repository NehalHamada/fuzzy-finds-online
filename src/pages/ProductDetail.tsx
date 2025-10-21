import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, STOREFRONT_PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useState } from "react";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const addItem = useCartStore(state => state.addItem);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', handle],
    queryFn: async () => {
      const result = await storefrontApiRequest(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, { handle });
      return result.data.productByHandle;
    },
    enabled: !!handle,
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        </div>
      </>
    );
  }

  const selectedVariant = data.variants.edges[selectedVariantIndex]?.node;
  const imageUrl = data.images.edges[0]?.node.url;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    const cartItem = {
      product: { node: data },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart!", {
      description: data.title,
      position: "top-center",
    });
  };

  return (
    <>
      <Header />
      <div className="container py-12 px-4">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-9xl">
                🐾
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
            
            <p className="text-3xl font-bold text-primary mb-6">
              ${parseFloat(selectedVariant?.price.amount || data.priceRange.minVariantPrice.amount).toFixed(2)}
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              {data.description || "Premium quality pet product designed with love and care for your furry friend."}
            </p>

            {data.variants.edges.length > 1 && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block">Select Variant:</label>
                <div className="flex flex-wrap gap-2">
                  {data.variants.edges.map((variant, index) => (
                    <Button
                      key={variant.node.id}
                      variant={selectedVariantIndex === index ? "default" : "outline"}
                      onClick={() => setSelectedVariantIndex(index)}
                      className="min-w-[100px]"
                    >
                      {variant.node.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button 
              size="lg" 
              className="w-full md:w-auto"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {selectedVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
