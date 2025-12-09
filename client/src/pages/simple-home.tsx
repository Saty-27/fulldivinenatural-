import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface User {
  id?: string;
  phone?: string;
  name?: string;
  email?: string;
  role?: string;
}

export default function HomePage() {
  const { user, isLoading } = useAuth() as { user?: User; isLoading: boolean };
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Logout failed",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="text-center py-8">
          <div className="text-6xl font-bold text-green-600 mb-2">🥛</div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Home!</h1>
          <p className="text-gray-500 mt-1">Divine Naturals Dairy Delivery</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Phone Number</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.phone || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.name || "Not set"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.email || "Not set"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {user?.role || "Customer"}
              </p>
            </div>
          </div>
        </div>

        {/* Features Coming Soon */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700">✅ Shop (Coming Soon)</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700">✅ Milk Subscription (Coming Soon)</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700">✅ Orders (Coming Soon)</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700">✅ Wallet (Coming Soon)</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 text-base text-red-600 border-red-600 hover:bg-red-50"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
