import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Tag, 
  Gift, 
  Users, 
  Star,
  Clock,
  Copy,
  Share,
  Percent,
  Zap,
  Calendar
} from "lucide-react";
import { Link } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function OffersAndLoyalty() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("offers");

  // Mock data
  const offers = [
    {
      id: 1,
      title: "First Order Special",
      description: "Get 25% off on your first order with Divine Naturals",
      code: "FIRST25",
      discount: "25% OFF",
      validTill: "2025-12-31",
      minOrder: 100,
      type: "percentage",
      category: "new-user"
    },
    {
      id: 2,
      title: "Daily Milk Subscription",
      description: "Subscribe to daily milk delivery and save ₹50 every month",
      code: "MILKSUB50",
      discount: "₹50 OFF",
      validTill: "2025-09-30",
      minOrder: 200,
      type: "amount",
      category: "subscription"
    },
    {
      id: 3,
      title: "Festival Special",
      description: "Janmashtami special - Buy sweets and dairy products combo",
      code: "JANMA30",
      discount: "30% OFF",
      validTill: "2025-08-26",
      minOrder: 300,
      type: "percentage",
      category: "festival"
    },
    {
      id: 4,
      title: "Weekend Offer",
      description: "Free delivery + 15% off on weekend orders",
      code: "WEEKEND15",
      discount: "15% OFF",
      validTill: "Every Weekend",
      minOrder: 150,
      type: "percentage",
      category: "recurring"
    }
  ];

  const rewards = {
    currentPoints: 1250,
    nextReward: 2000,
    pointsToNext: 750,
    level: "Silver",
    nextLevel: "Gold"
  };

  const rewardHistory = [
    {
      id: 1,
      action: "Order Purchase",
      points: 50,
      date: "2025-08-23",
      type: "earned"
    },
    {
      id: 2,
      action: "Referral Bonus",
      points: 100,
      date: "2025-08-22",
      type: "earned"
    },
    {
      id: 3,
      action: "Redeemed for discount",
      points: -200,
      date: "2025-08-21",
      type: "redeemed"
    }
  ];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied!",
      description: `Coupon code ${code} copied to clipboard`,
    });
  };

  const shareOffer = (offer: any) => {
    if (navigator.share) {
      navigator.share({
        title: offer.title,
        text: `${offer.description} Use code: ${offer.code}`,
        url: window.location.href
      });
    } else {
      copyCode(offer.code);
      toast({
        title: "Offer details copied!",
        description: "You can now share this offer with friends",
      });
    }
  };

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-red-50/50 opacity-60"></div>
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
                Offers & Rewards
              </h1>
              <p className="text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                Save more with exclusive deals
              </p>
            </div>
          </div>
        </div>

        {/* Rewards Summary Card */}
        <Card className="bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 text-white shadow-2xl border-0">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Star className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm font-semibold">Loyalty Points</p>
                    <h2 className="text-3xl font-black">{rewards.currentPoints}</h2>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  {rewards.level} Member
                </Badge>
              </div>

              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-100 text-sm">Progress to {rewards.nextLevel}</span>
                  <span className="text-sm font-semibold">{rewards.pointsToNext} points to go</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((rewards.currentPoints % 1000) / 1000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="offers" className="rounded-lg font-semibold">
              <Tag className="w-4 h-4 mr-2" />
              Offers
            </TabsTrigger>
            <TabsTrigger value="rewards" className="rounded-lg font-semibold">
              <Star className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="referral" className="rounded-lg font-semibold">
              <Users className="w-4 h-4 mr-2" />
              Referral
            </TabsTrigger>
          </TabsList>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-4">
            {offers.map((offer) => (
              <Card key={offer.id} className="eco-card border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-[hsl(var(--eco-secondary))] text-lg">{offer.title}</h3>
                        <Badge 
                          className={`${
                            offer.type === "percentage" 
                              ? "bg-orange-500" 
                              : "bg-green-500"
                          } text-white`}
                        >
                          {offer.discount}
                        </Badge>
                      </div>
                      <p className="text-[hsl(var(--eco-text-muted))] mb-3">{offer.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-[hsl(var(--eco-text-muted))]">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Valid till {offer.validTill}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Percent className="w-4 h-4" />
                          <span>Min order ₹{offer.minOrder}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-[hsl(var(--eco-text-muted))]">Code:</span>
                      <span className="font-bold text-[hsl(var(--eco-secondary))] text-lg">{offer.code}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyCode(offer.code)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareOffer(offer)}
                      >
                        <Share className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Scratch Cards */}
            <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-3 text-yellow-100" />
                <h3 className="font-bold text-xl mb-2">Daily Scratch Card</h3>
                <p className="text-yellow-100 mb-4">Scratch and win exciting rewards every day!</p>
                <Button className="bg-white text-orange-600 hover:bg-yellow-50 font-bold">
                  Scratch Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <Card className="eco-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  Redeem Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg text-center">
                    <h4 className="font-bold text-[hsl(var(--eco-secondary))] mb-1">₹10 Off</h4>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))] mb-2">200 points</p>
                    <Button size="sm" className="eco-button-secondary">Redeem</Button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg text-center">
                    <h4 className="font-bold text-[hsl(var(--eco-secondary))] mb-1">₹25 Off</h4>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))] mb-2">500 points</p>
                    <Button size="sm" className="eco-button-secondary">Redeem</Button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg text-center">
                    <h4 className="font-bold text-[hsl(var(--eco-secondary))] mb-1">₹50 Off</h4>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))] mb-2">1000 points</p>
                    <Button size="sm" className="eco-button-secondary">Redeem</Button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg text-center">
                    <h4 className="font-bold text-[hsl(var(--eco-secondary))] mb-1">Free Delivery</h4>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))] mb-2">100 points</p>
                    <Button size="sm" className="eco-button-secondary">Redeem</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="eco-card">
              <CardHeader>
                <CardTitle>Points History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rewardHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-[hsl(var(--eco-secondary))]">{item.action}</p>
                      <p className="text-xs text-[hsl(var(--eco-text-muted))]">{item.date}</p>
                    </div>
                    <span className={`font-bold ${
                      item.type === "earned" ? "text-green-600" : "text-red-600"
                    }`}>
                      {item.type === "earned" ? "+" : ""}{item.points} pts
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral" className="space-y-4">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-3 text-blue-100" />
                <h3 className="font-bold text-xl mb-2">Refer & Earn</h3>
                <p className="text-blue-100 mb-4">
                  Invite your friends and earn ₹50 for each successful referral
                </p>
                <div className="bg-white/20 rounded-lg p-3 mb-4">
                  <p className="text-sm mb-1">Your Referral Code</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-bold text-lg">DIVINE123</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCode("DIVINE123")}
                      className="text-white hover:bg-white/20"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold">
                  Share with Friends
                </Button>
              </CardContent>
            </Card>

            <Card className="eco-card">
              <CardHeader>
                <CardTitle>Referral Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <h4 className="text-2xl font-bold text-[hsl(var(--eco-primary))]">12</h4>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))]">Friends Invited</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-[hsl(var(--eco-secondary))]">8</h4>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))]">Successful</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-green-600">₹400</h4>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))]">Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-[hsl(var(--eco-secondary))] mb-3">How it works</h3>
                <div className="space-y-2 text-sm text-[hsl(var(--eco-text-muted))]">
                  <p>1. Share your referral code with friends</p>
                  <p>2. They sign up and place their first order</p>
                  <p>3. You both get ₹50 bonus in your wallet</p>
                  <p>4. No limit on referrals - invite more, earn more!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CustomerLayout>
  );
}