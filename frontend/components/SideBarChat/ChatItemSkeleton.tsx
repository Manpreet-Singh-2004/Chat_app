import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ChatItemSkeleton() {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg",
        "animate-pulse"
      )}
    >
      {/* Avatar */}
      <Skeleton className="h-10 w-10 rounded-full" />

      {/* Text */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
