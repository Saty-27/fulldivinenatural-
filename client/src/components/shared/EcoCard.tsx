import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

interface EcoCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
  testId?: string;
}

export function EcoCard({ title, description, children, footer, className = "", onClick, testId }: EcoCardProps) {
  return (
    <Card 
      className={`bg-cream border-sage/20 hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      data-testid={testId}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-forest">{title}</CardTitle>}
          {description && <CardDescription className="text-sage">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter className="border-t border-sage/10">{footer}</CardFooter>}
    </Card>
  );
}
