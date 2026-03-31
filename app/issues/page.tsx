import { Suspense } from "react";
import { FiltersPanel } from "./components/FiltersPanel";
import { IssueCard } from "./components/IssueCard";
import { PaginationControls } from "./components/PaginationControls";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { searchIssues } from "./lib/github";
import { SearchFilters, IssueState } from "./lib/types";
import { AlertCircle, Github } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export const metadata = {
    title: "Contrib.dev - Issue Explorer",
    description: "Explore open source GitHub issues and find your next contribution.",
};

interface IssuesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function IssuesPage(props: IssuesPageProps) {
    const searchParams = await props.searchParams;

    // Parse params
    const query = typeof searchParams.q === "string" ? searchParams.q : undefined;
    const label = typeof searchParams.label === "string" ? searchParams.label : undefined;

    const currentLabel = label === undefined ? "good first issue" : label;

    const language = typeof searchParams.language === "string" ? searchParams.language : undefined;
    const minStars = typeof searchParams.minStars === "string" ? parseInt(searchParams.minStars) : undefined;
    const state = (typeof searchParams.state === "string" ? searchParams.state : undefined) as IssueState | undefined;
    const sort = (typeof searchParams.sort === "string" ? searchParams.sort : undefined) as SearchFilters["sort"];
    const order = (typeof searchParams.order === "string" ? searchParams.order : undefined) as "asc" | "desc" | undefined;
    const page = (typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1) || 1;
    const perPage = (typeof searchParams.per_page === "string" ? parseInt(searchParams.per_page) : 30) || 30;

    const filters: SearchFilters = {
        query,
        label: currentLabel,
        language,
        minStars,
        state,
        sort,
        order,
        page,
        per_page: perPage,
    };

    // Fetch data
    const data = await searchIssues(filters);

    return (
        <div className="container mx-auto py-8 space-y-8 max-w-7xl px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
                        <Github className="h-8 w-8" />
                        Contrib.dev
                    </h1>
                    <p className="text-muted-foreground">
                        Explore open source issues and find your next contribution.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Button variant="outline" asChild>
                        <a href="https://github.com/search/issues" target="_blank" rel="noopener noreferrer">
                            Open on GitHub
                        </a>
                    </Button>
                </div>
            </div>

            <Suspense fallback={<div className="h-64 rounded-lg bg-muted/20 animate-pulse" />}>
                <FiltersPanel />
            </Suspense>



            <Suspense fallback={<LoadingSkeleton />}>
                {data.error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{data.error}</AlertDescription>
                    </Alert>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">
                                {data.total_count ? `${data.total_count.toLocaleString()} results found` : "No results found"}
                            </h2>
                            {data.incomplete_results && (
                                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                    Wait, results might be incomplete (timeout)
                                </span>
                            )}
                        </div>

                        {data.items.length === 0 ? (
                            <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                                <p className="text-muted-foreground">No issues found matching your criteria.</p>
                                <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.items.map((issue) => (
                                    <IssueCard key={issue.id} issue={issue} />
                                ))}
                            </div>
                        )}

                        <Suspense fallback={null}>
                            <PaginationControls
                                totalCount={data.total_count}
                                currentPage={page}
                                perPage={perPage}
                            />
                        </Suspense>
                    </>
                )}
            </Suspense>
        </div>
    );
}
