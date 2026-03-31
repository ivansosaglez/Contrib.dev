"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    totalCount: number;
    currentPage: number;
    perPage: number;
}

export function PaginationControls({ totalCount, currentPage, perPage }: PaginationControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const totalPages = Math.min(Math.ceil(totalCount / perPage), 34);
    const maxPages = 34; // Increased to Github API limit (1000 results)
    const actualTotalPages = Math.min(Math.ceil(totalCount / perPage), maxPages);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    if (actualTotalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-4 py-8">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Prev
            </Button>

            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {actualTotalPages}
            </span>

            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= actualTotalPages}
            >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    );
}
