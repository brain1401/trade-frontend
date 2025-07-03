import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// 뉴스 페이지 스켈레톤 UI
export default function NewsPageSkeleton() {
  return (
    <div className="container mx-auto space-y-12 p-4 md:p-6">
      <header className="text-center">
        <Skeleton className="mx-auto h-12 w-3/4" />
        <Skeleton className="mx-auto mt-4 h-6 w-1/2" />
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="mt-2 h-8 w-full" />
              <Skeleton className="mt-2 h-5 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
            </CardContent>
            <CardFooter className="flex justify-between bg-neutral-50 p-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
