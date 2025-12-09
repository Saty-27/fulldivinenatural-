import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface EcoButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  testId?: string;
  fullWidth?: boolean;
}

export function EcoButton({
  children,
  onClick,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  testId,
  fullWidth = false,
}: EcoButtonProps) {
  const variantStyles = {
    default: "bg-forest hover:bg-forest/90 text-cream",
    outline: "border-forest text-forest hover:bg-forest/10",
    ghost: "text-forest hover:bg-forest/10",
    secondary: "bg-sage hover:bg-sage/90 text-cream",
  };

  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      type={type}
      data-testid={testId}
      className={`${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
