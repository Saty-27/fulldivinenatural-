import { EcoCard } from "./EcoCard";
import { EcoButton } from "./EcoButton";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  cartQuantity?: number;
  onIncrement?: (e?: React.MouseEvent) => void;
  onDecrement?: (e?: React.MouseEvent) => void;
  onClick?: () => void;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  cartQuantity = 0, 
  onIncrement, 
  onDecrement,
  onClick 
}: ProductCardProps) {
  return (
    <EcoCard 
      className="overflow-hidden"
      testId={`product-card-${product.id}`}
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={product.imageUrl || '/placeholder-product.png'}
          alt={product.name}
          className="w-full h-40 object-cover rounded-t-lg"
          data-testid={`product-image-${product.id}`}
        />
      </div>

      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-semibold text-forest text-sm" data-testid={`product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-xs text-sage line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-forest" data-testid={`product-price-${product.id}`}>
              ₹{product.price}
            </span>
          </div>
          <span className="text-xs text-sage">{product.unit}</span>
        </div>

        {cartQuantity > 0 ? (
          <div className="flex items-center justify-between bg-forest/5 rounded-lg p-2">
            <EcoButton
              size="icon"
              variant="ghost"
              onClick={() => onDecrement?.()}
              testId={`product-decrement-${product.id}`}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </EcoButton>
            <span className="font-semibold text-forest" data-testid={`product-quantity-${product.id}`}>
              {cartQuantity}
            </span>
            <EcoButton
              size="icon"
              variant="ghost"
              onClick={() => onIncrement?.()}
              testId={`product-increment-${product.id}`}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </EcoButton>
          </div>
        ) : (
          <EcoButton
            fullWidth
            size="sm"
            onClick={() => onAddToCart?.(product)}
            testId={`product-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </EcoButton>
        )}
      </div>
    </EcoCard>
  );
}
