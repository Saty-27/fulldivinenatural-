import { Skeleton } from "@/components/ui/skeleton";
import { EcoCard } from "./EcoCard";

export function ProductCardSkeleton() {
  return (
    <EcoCard>
      <Skeleton className="h-40 w-full rounded-lg mb-3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center mt-3">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </EcoCard>
  );
}

export function OrderCardSkeleton() {
  return (
    <EcoCard>
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between mt-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    </EcoCard>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 bg-cream rounded-lg">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <EcoCard>
      <div className="space-y-3">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </EcoCard>
  );
}

export function StatCardSkeleton() {
  return (
    <EcoCard>
      <div className="space-y-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </EcoCard>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td className="p-3"><Skeleton className="h-4 w-full" /></td>
      <td className="p-3"><Skeleton className="h-4 w-full" /></td>
      <td className="p-3"><Skeleton className="h-4 w-full" /></td>
      <td className="p-3"><Skeleton className="h-4 w-full" /></td>
    </tr>
  );
}
