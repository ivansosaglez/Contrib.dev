import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";

export default function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="flex flex-col h-[280px]">
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow">
                        <Skeleton className="h-20 w-full" />
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-8 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
