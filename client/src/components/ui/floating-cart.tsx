import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function FloatingCart() {
  const [location] = useLocation();
  const [cartItems] = useState(3); // This would come from a cart context/state
  const [cartTotal] = useState(450); // This would come from a cart context/state

  // Only show floating cart on shop page and when there are items
  if (location !== "/shop" || cartItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50">
      <Button className="bg-[var(--eco-primary)] text-white w-16 h-16 rounded-full shadow-lg hover:bg-[var(--eco-primary)]/90 relative animate-pulse">
        <div className="text-center">
          <ShoppingBag className="w-6 h-6 mb-1" />
          <div className="text-xs leading-none">
            <div>₹{cartTotal}</div>
          </div>
        </div>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
          {cartItems}
        </span>
      </Button>
    </div>
  );
}
