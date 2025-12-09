import { ArrowLeft, Bell } from "lucide-react";
import { useLocation } from "wouter";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  rightAction?: ReactNode;
  onBack?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  showBack = false,
  showNotifications = false,
  rightAction,
  onBack,
}: PageHeaderProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <header className="bg-cream border-b border-sage/20 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {showBack && (
              <button
                onClick={handleBack}
                className="text-forest hover:bg-forest/10 p-2 rounded-lg transition-colors"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-forest" data-testid="page-title">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-sage" data-testid="page-subtitle">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {rightAction}
            {showNotifications && (
              <button
                onClick={() => setLocation("/customer/notifications")}
                className="text-forest hover:bg-forest/10 p-2 rounded-lg transition-colors relative"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
