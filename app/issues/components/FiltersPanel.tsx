"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, Filter, Languages, Star, SortAsc, ArrowUp, ArrowDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export function FiltersPanel() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [query, setQuery] = useState(() => searchParams.get("q") || "");
    const [label, setLabel] = useState(() =>
        searchParams.has("label") ? (searchParams.get("label") ?? "") : "good first issue"
    );
    const [language, setLanguage] = useState(() => searchParams.get("language") || "all");
    const [minStars, setMinStars] = useState(() => searchParams.get("minStars") || "0");
    const [state, setState] = useState(() => searchParams.get("state") || "open");
    const [sort, setSort] = useState(() => searchParams.get("sort") || "best-match");
    const [order, setOrder] = useState(() => searchParams.get("order") || "desc");

    const debouncedQuery = useDebounce(query, 500);
    const debouncedLabel = useDebounce(label, 500);

    // Track whether the user has interacted — prevents firing on first mount
    const isFirstRender = useRef(true);

    const buildParams = useCallback(() => {
        const params = new URLSearchParams();

        if (debouncedQuery) params.set("q", debouncedQuery);
        if (debouncedLabel) params.set("label", debouncedLabel);
        if (language && language !== "all") params.set("language", language);
        if (minStars && minStars !== "0") params.set("minStars", minStars);
        if (state && state !== "open") params.set("state", state);
        if (sort && sort !== "best-match") params.set("sort", sort);
        if (order && order !== "desc") params.set("order", order);
        params.set("page", "1");

        return params;
    }, [debouncedQuery, debouncedLabel, language, minStars, state, sort, order]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        router.push(`${pathname}?${buildParams().toString()}`);
    }, [debouncedQuery, debouncedLabel, language, minStars, state, sort, order]);

    const handleReset = () => {
        setQuery("");
        setLabel("good first issue");
        setLanguage("all");
        setMinStars("0");
        setState("open");
        setSort("best-match");
        setOrder("desc");
    };

    const hasActiveFilters =
        query ||
        label !== "good first issue" ||
        (language && language !== "all") ||
        (minStars && minStars !== "0") ||
        (state && state !== "open") ||
        (sort && sort !== "best-match");

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col gap-4">
                {/* Search & Label */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search issues..."
                            className="pl-9"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Label (e.g. good first issue)"
                            className="pl-9"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                    </div>
                </div>

                <Separator />

                {/* Filters Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Language */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Languages className="h-4 w-4" /> Language
                        </label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Languages" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Languages</SelectItem>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="typescript">TypeScript</SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="go">Go</SelectItem>
                                <SelectItem value="rust">Rust</SelectItem>
                                <SelectItem value="kotlin">Kotlin</SelectItem>
                                <SelectItem value="java">Java</SelectItem>
                                <SelectItem value="c">C</SelectItem>
                                <SelectItem value="c++">C++</SelectItem>
                                <SelectItem value="c#">C#</SelectItem>
                                <SelectItem value="php">PHP</SelectItem>
                                <SelectItem value="ruby">Ruby</SelectItem>
                                <SelectItem value="swift">Swift</SelectItem>
                                <SelectItem value="dart">Dart</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Min Stars */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Star className="h-4 w-4" /> Min Stars
                        </label>
                        <Select value={minStars} onValueChange={setMinStars}>
                            <SelectTrigger>
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Any</SelectItem>
                                <SelectItem value="10">10+</SelectItem>
                                <SelectItem value="50">50+</SelectItem>
                                <SelectItem value="100">100+</SelectItem>
                                <SelectItem value="500">500+</SelectItem>
                                <SelectItem value="1000">1,000+</SelectItem>
                                <SelectItem value="5000">5,000+</SelectItem>
                                <SelectItem value="10000">10,000+</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select value={state} onValueChange={setState}>
                            <SelectTrigger>
                                <SelectValue placeholder="Open" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="all">All</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <SortAsc className="h-4 w-4" /> Sort By
                        </label>
                        <div className="flex gap-2">
                            <Select value={sort} onValueChange={setSort}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Best Match" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="best-match">Best Match</SelectItem>
                                    <SelectItem value="created">Created</SelectItem>
                                    <SelectItem value="updated">Updated</SelectItem>
                                    <SelectItem value="comments">Comments</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                                title={order === "asc" ? "Ascending" : "Descending"}
                            >
                                {order === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Active Filters & Reset */}
                <div className="flex flex-wrap gap-2 items-center pt-2">
                    <div className="flex flex-wrap gap-2 flex-1">
                        {query && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                Search: {query}
                                <button onClick={() => setQuery("")} className="hover:bg-muted rounded-full p-0.5 ml-1">
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                        {label && label !== "good first issue" && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                Label: {label}
                                <button onClick={() => setLabel("good first issue")} className="hover:bg-muted rounded-full p-0.5 ml-1">
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                        {label === "good first issue" && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                Label: good first issue
                                <button onClick={() => setLabel("")} className="hover:bg-muted rounded-full p-0.5 ml-1">
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                        {language && language !== "all" && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                Language: {language}
                                <button onClick={() => setLanguage("all")} className="hover:bg-muted rounded-full p-0.5 ml-1">
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                        {minStars && minStars !== "0" && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                Stars &ge; {parseInt(minStars).toLocaleString()}
                                <button onClick={() => setMinStars("0")} className="hover:bg-muted rounded-full p-0.5 ml-1">
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                        {state && state !== "open" && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                State: {state}
                                <button onClick={() => setState("open")} className="hover:bg-muted rounded-full p-0.5 ml-1">
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                        {sort && sort !== "best-match" && (
                            <Badge variant="secondary" className="gap-1 pr-1">
                                Sort: {sort} ({order})
                                <button onClick={() => { setSort("best-match"); setOrder("desc"); }} className="hover:bg-muted rounded-full p-0.5 ml-1">
                                    <X className="h-3 w-3 cursor-pointer" />
                                </button>
                            </Badge>
                        )}
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="h-8 px-2 lg:px-3 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            Reset Filters
                            <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
