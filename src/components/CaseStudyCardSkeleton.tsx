import { Skeleton } from "@/components/ui/skeleton";

const CaseStudyCardSkeleton = () => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border cursor-pointer transition-all duration-300 hover:shadow-md">
      {/* Logo skeleton */}
      <div className="flex items-center mb-4">
        <Skeleton className="w-12 h-12 rounded" />
        <div className="ml-4 flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      
      {/* Title skeleton */}
      <Skeleton className="h-6 w-full mb-3" />
      
      {/* Summary skeleton */}
      <div className="mb-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
};

export default CaseStudyCardSkeleton;