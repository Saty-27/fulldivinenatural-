import BottomNavigation from "./bottom-navigation";
import FloatingCart from "@/components/ui/floating-cart";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--eco-cream)]">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden">
        {/* Main Content Area */}
        <div className="pb-20 overflow-y-auto" style={{ height: "calc(100vh - 80px)" }}>
          {children}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Floating Cart */}
        <FloatingCart />
      </div>
    </div>
  );
}
