import { SearchFilters, IssueSort, IssueOrder, IssueState } from "./types";

export function buildSearchQuery(filters: SearchFilters): string {
    const parts: string[] = ["type:issue"];

    // 1. Text Search
    if (filters.query?.trim()) {
        parts.push(filters.query.trim());
    }

    // 2. Label
    if (filters.label?.trim()) {
        parts.push(`label:"${filters.label.trim()}"`);
    }

    // 3. Language
    if (filters.language?.trim()) {
        parts.push(`language:${filters.language.trim()}`);
    }

    // 4. Min Stars (only add if > 0)
    if (filters.minStars !== undefined && filters.minStars > 0) {
        parts.push(`stars:>=${filters.minStars}`);
    }

    // 5. State
    // Default to open if not specified, unless 'all' is explicitly requested
    if (filters.state !== "all") {
        parts.push(`state:${filters.state || "open"}`);
    }

    return parts.join(" ");
}

export function buildApiUrl(filters: SearchFilters): string {
    const q = buildSearchQuery(filters);
    const params = new URLSearchParams();

    params.append("q", q);

    // Pagination
    const page = filters.page || 1;
    const perPage = filters.per_page || 30;

    params.append("page", page.toString());
    params.append("per_page", perPage.toString());

    // Sorting
    if (filters.sort && filters.sort !== "best-match") {
        params.append("sort", filters.sort);
    }

    // Ordering
    if (filters.order) {
        params.append("order", filters.order);
    }

    return `https://api.github.com/search/issues?${params.toString()}`;
}
