import { Skeleton } from "@/components/ui/skeleton";

export default function ChatHeaderSkeleton() {
  return (
    <div className="h-16 flex items-center gap-3 px-4 border-b bg-white dark:bg-slate-900">
      <Skeleton className="h-10 w-10 rounded-full" />
      

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" /> 
        <Skeleton className="h-3 w-48" /> 
      </div>
    </div>
  );
}