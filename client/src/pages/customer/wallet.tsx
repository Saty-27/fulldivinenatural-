import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Wallet as WalletIcon,
  Plus, 
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Gift,
  Star,
  History,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function Wallet() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addMoneyAmount, setAddMoneyAmount] = useState("");
  const [showAddMoney, setShowAddMoney] = useState(false);

  // Mock wallet data
  const walletBalance = 350;
  const rewardsPoints = 1250;
  const cashbackEarned = 85;

  const transactions = [
    {
      id: 1,
      type: "credit",
      amount: 50,
      description: "Cashback from order #ORD-123",
      date: "2025-08-23",
      time: "10:30 AM"
    },
    {
      id: 2,
      type: "debit",
      amount: 120,
      description: "Payment for subscription",
      date: "2025-08-23",
      time: "06:00 AM"
    },
    {
      id: 3,
      type: "credit",
      amount: 200,
      description: "Money added via UPI",
      date: "2025-08-22",
      time: "02:15 PM"
    },
    {
      id: 4,
      type: "credit",
      amount: 25,
      description: "Referral bonus",
      date: "2025-08-22",
      time: "11:45 AM"
    },
    {
      id: 5,
      type: "debit",
      amount: 80,
      description: "Order payment #ORD-122",
      date: "2025-08-21",
      time: "07:20 PM"
    }
  ];

  const addMoneyMutation = useMutation({
    mutationFn: async (amount: number) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: true, amount };
    },
    onSuccess: (_, amount) => {
      toast({
        title: "Money added successfully!",
        description: `₹${amount} has been added to your wallet`,
      });
      setShowAddMoney(false);
      setAddMoneyAmount("");
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
    },
  });

  const handleAddMoney = () => {
    const amount = parseInt(addMoneyAmount);
    if (amount && amount >= 10 && amount <= 10000) {
      addMoneyMutation.mutate(amount);
    } else {
      toast({
        title: "Invalid amount",
        description: "Please enter an amount between ₹10 and ₹10,000",
        variant: "destructive"
      });
    }
  };

  const quickAmounts = [50, 100, 200, 500, 1000];

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-blue-50/50 opacity-60"></div>
          <div className="relative flex items-center space-x-4">
            <Link href="/profile">
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
                Divine Naturals Wallet
              </h1>
              <p className="text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                Manage your payments & rewards
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <Card className="bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white shadow-2xl border-0">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <WalletIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-green-100 text-sm font-semibold">Wallet Balance</p>
                    <h2 className="text-3xl font-black">₹{walletBalance}</h2>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowAddMoney(true)}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="text-green-100 text-sm font-semibold">Rewards Points</span>
                  </div>
                  <p className="text-xl font-black">{rewardsPoints}</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Gift className="w-4 h-4 text-orange-300" />
                    <span className="text-green-100 text-sm font-semibold">Cashback Earned</span>
                  </div>
                  <p className="text-xl font-black">₹{cashbackEarned}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Money Modal */}
        {showAddMoney && (
          <Card className="border-2 border-green-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-black text-[hsl(var(--eco-secondary))] flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add Money to Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Enter Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount (₹10 - ₹10,000)"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  className="text-lg p-4"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Quick Select</label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setAddMoneyAmount(amount.toString())}
                      className="py-3"
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleAddMoney}
                  disabled={!addMoneyAmount || addMoneyMutation.isPending}
                  className="eco-button flex-1"
                >
                  {addMoneyMutation.isPending ? "Processing..." : "Add Money"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddMoney(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>

              <div className="text-xs text-[hsl(var(--eco-text-muted))] text-center">
                Payments are processed securely via UPI, NetBanking, or Cards
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="eco-card cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-[hsl(var(--eco-secondary))] mb-1">Cashback Offers</h3>
              <p className="text-sm text-[hsl(var(--eco-text-muted))]">View active offers</p>
            </CardContent>
          </Card>

          <Card className="eco-card cursor-pointer hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-[hsl(var(--eco-secondary))] mb-1">Redeem Points</h3>
              <p className="text-sm text-[hsl(var(--eco-text-muted))]">{rewardsPoints} points</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="eco-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <History className="w-5 h-5 mr-2" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === "credit" 
                      ? "bg-green-100" 
                      : "bg-red-100"
                  }`}>
                    {transaction.type === "credit" ? (
                      <ArrowDownRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[hsl(var(--eco-secondary))] text-sm truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-[hsl(var(--eco-text-muted))]">
                      {transaction.date} • {transaction.time}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${
                  transaction.type === "credit" ? "text-green-600" : "text-red-600"
                }`}>
                  {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-4">
              View All Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Auto-Deduct Settings */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-800">Auto-Deduct for Subscriptions</h3>
                  <p className="text-sm text-blue-600">Automatically pay from wallet balance</p>
                </div>
              </div>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Info */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Star className="w-6 h-6 text-yellow-600" />
              <h3 className="font-bold text-yellow-800">Earn More Rewards</h3>
            </div>
            <div className="space-y-2 text-sm text-yellow-700">
              <p>• Earn 1 point for every ₹10 spent</p>
              <p>• Get 5% cashback on orders above ₹200</p>
              <p>• Refer friends and earn ₹50 bonus</p>
              <p>• Special rewards on festival orders</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}