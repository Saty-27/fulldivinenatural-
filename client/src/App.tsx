import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/simple-login";
import LandingPage from "@/pages/landing";
import ProfilePage from "@/pages/home";
import ShopPage from "@/pages/shop";
import ProductDetail from "@/pages/product-detail";
import CartPage from "@/pages/cart";
import CheckoutAddressPage from "@/pages/checkout-address";
import OrdersPage from "@/pages/orders";
import SubscriptionPage from "@/pages/subscription";
import SubscriptionCreatePage from "@/pages/subscription-create";
import SubscriptionHistoryPage from "@/pages/subscription-history";
import BillingPage from "@/pages/billing";
import AdminDashboard from "@/pages/admin/index";
import DeliveryLogin from "@/pages/delivery/login";
import DeliveryDashboard from "@/pages/delivery/dashboard";
import ProfileCompletion from "@/pages/delivery/profile-completion";
import DeliveryRoutingPage from "@/pages/admin/delivery-routing";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-5xl font-bold text-green-600 mb-4">🥛</div>
          <p className="text-gray-600 text-lg">Divine Naturals</p>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* ADMIN ROUTES - ALWAYS PUBLIC */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/routing" component={DeliveryRoutingPage} />
      <Route path="/admin/*" component={AdminDashboard} />
      
      {/* DELIVERY PARTNER ROUTES - PUBLIC */}
      <Route path="/delivery" component={DeliveryLogin} />
      <Route path="/delivery/login" component={DeliveryLogin} />
      <Route path="/delivery/profile-completion" component={ProfileCompletion} />
      <Route path="/delivery/dashboard" component={DeliveryDashboard} />
      
      {/* PUBLIC routes - no auth required */}
      <Route path="/" component={LandingPage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/product/:id" component={ProductDetail} />
      
      {/* PROTECTED routes - require authentication */}
      <Route path="/home">
        {() => <ProtectedRoute component={ProfilePage} />}
      </Route>
      <Route path="/profile">
        {() => <ProtectedRoute component={ProfilePage} />}
      </Route>
      <Route path="/cart">
        {() => <ProtectedRoute component={CartPage} />}
      </Route>
      <Route path="/checkout">
        {() => <ProtectedRoute component={CheckoutAddressPage} />}
      </Route>
      <Route path="/orders">
        {() => <ProtectedRoute component={OrdersPage} />}
      </Route>
      <Route path="/subscription">
        {() => <ProtectedRoute component={SubscriptionPage} />}
      </Route>
      <Route path="/subscription/create">
        {() => <ProtectedRoute component={SubscriptionCreatePage} />}
      </Route>
      <Route path="/subscription/history">
        {() => <ProtectedRoute component={SubscriptionHistoryPage} />}
      </Route>
      <Route path="/billing">
        {() => <ProtectedRoute component={BillingPage} />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
