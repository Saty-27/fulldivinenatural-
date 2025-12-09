import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Gift, 
  Star,
  Clock,
  Heart,
  ShoppingCart,
  Calendar,
  Sparkles,
  Package,
  Bell
} from "lucide-react";
import { Link } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function FestivalSpecials() {
  const { toast } = useToast();
  const [cart, setCart] = useState<any[]>([]);

  // Mock festival data
  const currentFestival = {
    name: "Janmashtami Special",
    emoji: "🎉",
    endDate: "2025-08-26",
    daysLeft: 3,
    description: "Celebrate Lord Krishna's birthday with our special dairy treats and sweets collection"
  };

  const festivalProducts = [
    {
      id: 1,
      name: "Janmashtami Sweets Combo",
      originalPrice: 500,
      festivalPrice: 350,
      discount: 30,
      image: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      description: "Fresh Peda, Kheer, and Laddoo made with pure A2 milk",
      limited: true,
      rating: 4.8,
      reviews: 45
    },
    {
      id: 2,
      name: "Premium A2 Ghee (500ml)",
      originalPrice: 800,
      festivalPrice: 680,
      discount: 15,
      image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      description: "Pure cow ghee for traditional cooking and offerings",
      limited: false,
      rating: 4.9,
      reviews: 128
    },
    {
      id: 3,
      name: "Krishna's Favorite Butter (200g)",
      originalPrice: 120,
      festivalPrice: 100,
      discount: 17,
      image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      description: "Fresh white butter just like Lord Krishna loved",
      limited: true,
      rating: 4.7,
      reviews: 89
    },
    {
      id: 4,
      name: "Festival Milk & Sweets Package",
      originalPrice: 1200,
      festivalPrice: 899,
      discount: 25,
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      description: "Complete package with milk, sweets, and traditional treats",
      limited: true,
      rating: 4.8,
      reviews: 67
    }
  ];

  const upcomingFestivals = [
    {
      name: "Ganesh Chaturthi",
      date: "2025-09-07",
      emoji: "🐘",
      description: "Modak and traditional sweets preparation kits"
    },
    {
      name: "Navratri",
      date: "2025-09-15",
      emoji: "🌸",
      description: "Fasting-friendly dairy products and special offers"
    },
    {
      name: "Diwali",
      date: "2025-10-24",
      emoji: "🪔",
      description: "Premium gift hampers and sweets collection"
    },
    {
      name: "Christmas",
      date: "2025-12-25",
      emoji: "🎄",
      description: "Special cakes ingredients and holiday treats"
    }
  ];

  const giftHampers = [
    {
      id: 1,
      name: "Premium Family Hamper",
      price: 1499,
      items: ["2L A2 Milk", "500ml Ghee", "200g Paneer", "Sweets Box"],
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      bestSeller: true
    },
    {
      id: 2,
      name: "Traditional Celebration Box",
      price: 899,
      items: ["Pure Ghee", "Fresh Butter", "Sweets Combo", "Festival Card"],
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      bestSeller: false
    },
    {
      id: 3,
      name: "Divine Naturals Special",
      price: 2299,
      items: ["1L Premium Ghee", "Sweets Collection", "A2 Milk Pack", "Organic Honey"],
      image: "https://images.unsplash.com/photo-1607344645866-009c7d0b63ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      bestSeller: false
    }
  ];

  const addToCart = (product: any) => {
    setCart(prev => [...prev, product]);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart`,
    });
  };

  const calculateTimeLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const difference = end.getTime() - now.getTime();
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };

  const timeLeft = calculateTimeLeft(currentFestival.endDate);

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-orange-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-yellow-50/50 opacity-60"></div>
          <div className="relative flex items-center space-x-4">
            <Link href="/home">
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
                Festival Specials
              </h1>
              <p className="text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                Celebrate with divine dairy treats
              </p>
            </div>
          </div>
        </div>

        {/* Current Festival Banner */}
        <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-2xl border-0">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{currentFestival.emoji}</span>
                  <div>
                    <h2 className="text-2xl font-black">{currentFestival.name}</h2>
                    <p className="text-purple-100">{currentFestival.description}</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Limited Time
                </Badge>
              </div>

              {/* Countdown Timer */}
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-100 font-semibold">Offer ends in:</span>
                  <span className="text-sm text-purple-100">Until {currentFestival.endDate}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-black">{timeLeft.days}</div>
                    <div className="text-xs text-purple-100">Days</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black">{timeLeft.hours}</div>
                    <div className="text-xs text-purple-100">Hours</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black">{timeLeft.minutes}</div>
                    <div className="text-xs text-purple-100">Minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Festival Products */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[hsl(var(--eco-secondary))] flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            {currentFestival.name} Products
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {festivalProducts.map((product) => (
              <Card key={product.id} className="eco-card border-2 border-orange-200 relative overflow-hidden">
                {product.limited && (
                  <Badge className="absolute top-4 left-4 z-10 bg-red-500 text-white">
                    Limited Edition
                  </Badge>
                )}
                <CardContent className="p-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-[hsl(var(--eco-secondary))] mb-1">{product.name}</h3>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))] mb-3">{product.description}</p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold">{product.rating}</span>
                      </div>
                      <span className="text-xs text-[hsl(var(--eco-text-muted))]">({product.reviews} reviews)</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-[hsl(var(--eco-primary))]">
                            ₹{product.festivalPrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        </div>
                        <Badge className="bg-green-500 text-white text-xs">
                          {product.discount}% OFF
                        </Badge>
                      </div>
                    </div>

                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full bg-orange-500 text-white hover:bg-orange-600"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gift Hampers */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[hsl(var(--eco-secondary))] flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Festival Gift Hampers
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {giftHampers.map((hamper) => (
              <Card key={hamper.id} className="eco-card relative">
                {hamper.bestSeller && (
                  <Badge className="absolute top-4 right-4 z-10 bg-yellow-500 text-black">
                    <Star className="w-3 h-3 mr-1" />
                    Best Seller
                  </Badge>
                )}
                <CardContent className="p-0">
                  <img
                    src={hamper.image}
                    alt={hamper.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-[hsl(var(--eco-secondary))] mb-2">{hamper.name}</h3>
                    <div className="space-y-1 mb-3">
                      {hamper.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-[hsl(var(--eco-text-muted))]">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-[hsl(var(--eco-primary))]">
                        ₹{hamper.price}
                      </span>
                      <Button size="sm" className="eco-button-secondary">
                        <Gift className="w-4 h-4 mr-1" />
                        Send Gift
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Festivals */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Festivals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingFestivals.map((festival, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{festival.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-[hsl(var(--eco-secondary))]">{festival.name}</h4>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))]">{festival.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-[hsl(var(--eco-primary))]">{festival.date}</div>
                  <Button variant="outline" size="sm" className="mt-1">
                    <Bell className="w-3 h-3 mr-1" />
                    Notify Me
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Special Offers Banner */}
        <Card className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white border-0">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">🎁 Festival Special Offer</h3>
            <p className="text-green-100 mb-4">
              Order above ₹999 and get FREE delivery + complimentary festival sweets box
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-bold">
                Shop Now
              </Button>
              <span className="text-sm">Valid till {currentFestival.endDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Reviews */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-orange-800 mb-4">🌟 What customers say about our festival specials</h3>
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex text-yellow-500">★★★★★</div>
                  <span className="font-semibold">Priya Sharma</span>
                </div>
                <p className="text-sm text-gray-600">"The Janmashtami sweets combo was absolutely delicious! Fresh and authentic taste."</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex text-yellow-500">★★★★★</div>
                  <span className="font-semibold">Rajesh Kumar</span>
                </div>
                <p className="text-sm text-gray-600">"Perfect gift hamper for Diwali. My family loved the quality of all products."</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}