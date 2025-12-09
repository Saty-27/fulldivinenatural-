import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart,
  CreditCard,
  Wallet,
  MapPin,
  Clock,
  Tag,
  Gift
} from "lucide-react";
import { Link, useLocation } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function Cart() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [couponCode, setCouponCode] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Mock cart data - in real app this would come from global state or API
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Toned Milk",
      price: 30,
      quantity: 2,
      unit: "500ml",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    },
    {
      id: 2,
      name: "Fresh Paneer",
      price: 80,
      quantity: 1,
      unit: "200g",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    },
    {
      id: 3,
      name: "Pure Ghee",
      price: 120,
      quantity: 1,
      unit: "100ml",
      image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
    }
  ]);

  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const deliveryFee = subtotal > 200 ? 0 : 20;
  const total = subtotal - discount + deliveryFee;

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCartItems(items => items.filter(item => item.id !== id));
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    } else {
      setCartItems(items => items.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const applyCoupon = () => {
    const validCoupons = {
      "FIRST20": { discount: 20, description: "20% off on first order" },
      "DAIRY10": { discount: 10, description: "₹10 off on dairy products" },
      "WELCOME": { discount: 15, description: "15% off welcome discount" }
    };

    const coupon = validCoupons[couponCode as keyof typeof validCoupons];
    if (coupon) {
      const discountAmount = couponCode === "DAIRY10" ? 10 : Math.floor(subtotal * coupon.discount / 100);
      setAppliedCoupon({ code: couponCode, discount: discountAmount });
      toast({
        title: "Coupon applied!",
        description: coupon.description,
      });
    } else {
      toast({
        title: "Invalid coupon",
        description: "Please enter a valid coupon code",
        variant: "destructive"
      });
    }
    setCouponCode("");
  };

  const proceedToCheckout = () => {
    if (!deliverySlot) {
      toast({
        title: "Select delivery slot",
        description: "Please select a delivery time slot",
        variant: "destructive"
      });
      return;
    }
    
    if (!paymentMethod) {
      toast({
        title: "Select payment method",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    // Simulate order creation
    toast({
      title: "Order placed successfully!",
      description: `Your order of ₹${total} has been confirmed`,
    });
    
    // Redirect to orders page
    setLocation("/orders");
  };

  if (cartItems.length === 0) {
    return (
      <CustomerLayout>
        <div className="p-4 space-y-6">
          <div className="flex items-center space-x-3">
            <Link href="/shop">
              <Button variant="ghost" size="icon" className="text-[var(--eco-primary)]">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-[hsl(var(--eco-secondary))]">Cart</h1>
          </div>

          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-[hsl(var(--eco-text-muted))] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[hsl(var(--eco-secondary))] mb-2">Your cart is empty</h2>
            <p className="text-[hsl(var(--eco-text-muted))] mb-6">Add some fresh dairy products to get started</p>
            <Link href="/shop">
              <Button className="eco-button">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-blue-50/50 opacity-60"></div>
          <div className="relative flex items-center space-x-4">
            <Link href="/shop">
              <Button variant="ghost" size="icon" className="text-[var(--eco-primary)] flex-shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2 flex-shrink-0">
              <img 
                src={logoImage} 
                alt="Divine Naturals Tree Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[hsl(var(--eco-secondary))] mb-1 truncate">
                Shopping Cart
              </h1>
              <p className="text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                {cartItems.length} items in your cart
              </p>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="eco-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[hsl(var(--eco-secondary))] truncate">{item.name}</h3>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))]">{item.unit}</p>
                    <p className="font-bold text-[hsl(var(--eco-primary))]">₹{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-red-500 ml-2"
                      onClick={() => updateQuantity(item.id, 0)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coupon Code */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Tag className="w-5 h-5 mr-2" />
              Apply Coupon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">{appliedCoupon.code}</span>
                  <span className="text-green-600">-₹{appliedCoupon.discount}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAppliedCoupon(null)}
                  className="text-green-600"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button onClick={applyCoupon} className="eco-button-secondary">
                  Apply
                </Button>
              </div>
            )}
            <div className="text-xs text-[hsl(var(--eco-text-muted))]">
              Available: FIRST20, DAIRY10, WELCOME
            </div>
          </CardContent>
        </Card>

        {/* Delivery Slot Selection */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Clock className="w-5 h-5 mr-2" />
              Delivery Slot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={deliverySlot} onValueChange={setDeliverySlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select delivery time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning-6-8">Morning (6:00 AM - 8:00 AM)</SelectItem>
                <SelectItem value="morning-8-10">Morning (8:00 AM - 10:00 AM)</SelectItem>
                <SelectItem value="evening-6-8">Evening (6:00 PM - 8:00 PM)</SelectItem>
                <SelectItem value="evening-8-10">Evening (8:00 PM - 10:00 PM)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === "upi" ? "default" : "outline"}
                onClick={() => setPaymentMethod("upi")}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <span className="text-2xl">📱</span>
                <span className="text-sm">UPI</span>
              </Button>
              <Button
                variant={paymentMethod === "wallet" ? "default" : "outline"}
                onClick={() => setPaymentMethod("wallet")}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Wallet className="w-6 h-6" />
                <span className="text-sm">Wallet</span>
              </Button>
              <Button
                variant={paymentMethod === "card" ? "default" : "outline"}
                onClick={() => setPaymentMethod("card")}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-sm">Card</span>
              </Button>
              <Button
                variant={paymentMethod === "cod" ? "default" : "outline"}
                onClick={() => setPaymentMethod("cod")}
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <span className="text-2xl">💵</span>
                <span className="text-sm">COD</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>
            {subtotal < 200 && (
              <div className="text-xs text-[hsl(var(--eco-text-muted))]">
                Add ₹{200 - subtotal} more for free delivery
              </div>
            )}
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Button */}
        <div className="sticky bottom-20 bg-white p-4 rounded-2xl shadow-xl border">
          <Button 
            onClick={proceedToCheckout}
            className="w-full eco-button text-lg py-4"
          >
            Proceed to Checkout - ₹{total}
          </Button>
        </div>
      </div>
    </CustomerLayout>
  );
}