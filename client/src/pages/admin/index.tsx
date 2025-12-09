import { useLocation } from "wouter";
import AdminDashboard from "./dashboard";
import OrdersAdmin from "./orders";
import SubscriptionsAdmin from "./subscriptions";
import CategoriesAdmin from "./categories";
import ProductsAdmin from "./products";
import CustomersAdmin from "./customers";
import AdminBillingPage from "./billing";
import AdminBillingDetailPage from "./billing-detail";
import DeliveryPartnersPage from "./delivery-partners";
import AdminBannersPage from "./banners";
import HomepageCMS from "./homepage-cms";

export default function AdminPage() {
  const [location] = useLocation();

  if (location === "/admin" || location === "/admin/dashboard") {
    return <AdminDashboard />;
  } else if (location === "/admin/orders") {
    return <OrdersAdmin />;
  } else if (location === "/admin/subscriptions") {
    return <SubscriptionsAdmin />;
  } else if (location === "/admin/categories") {
    return <CategoriesAdmin />;
  } else if (location === "/admin/products") {
    return <ProductsAdmin />;
  } else if (location === "/admin/customers") {
    return <CustomersAdmin />;
  } else if (location === "/admin/billing") {
    return <AdminBillingPage />;
  } else if (location?.startsWith("/admin/billing/")) {
    return <AdminBillingDetailPage />;
  } else if (location === "/admin/delivery" || location === "/admin/delivery-partners") {
    return <DeliveryPartnersPage />;
  } else if (location === "/admin/banners") {
    return <AdminBannersPage />;
  } else if (location === "/admin/homepage" || location === "/admin/cms") {
    return <HomepageCMS />;
  }

  return <AdminDashboard />;
}
