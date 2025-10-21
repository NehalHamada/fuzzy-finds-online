import { ShopifyProduct } from "@/lib/shopify";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const { node } = product;
  
  const firstVariant = node.variants.edges[0]?.node;
  const imageUrl = node.images.edges[0]?.node.url;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) {
      toast.error("Product variant not available");
      return;
    }

    const cartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart!", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <Link to={`/product/${node.handle}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer">
        <div className="aspect-square overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={node.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🐾
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{node.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {node.description || "Premium quality pet product"}
          </p>
          <p className="text-2xl font-bold text-primary">
            ${parseFloat(price.amount).toFixed(2)}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full group/button"
            onClick={handleAddToCart}
            disabled={!firstVariant?.availableForSale}
          >
            <ShoppingCart className="mr-2 h-4 w-4 group-hover/button:scale-110 transition-transform" />
            {firstVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
