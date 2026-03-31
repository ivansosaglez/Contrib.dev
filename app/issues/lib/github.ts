import { GithubSearchResponse, SearchFilters } from "./types";
import { buildApiUrl } from "./queryBuilder";

export async function searchIssues(filters: SearchFilters): Promise<GithubSearchResponse & { error?: string }> {
    const url = buildApiUrl(filters);

    const headers: Record<string, string> = {
        "Accept": "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
        headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    try {
        const res = await fetch(url, {
            next: {
                revalidate: 60, // 1 minute cache
            },
            headers,
        });

        if (!res.ok) {
            if (res.status === 403) {
                const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
                if (rateLimitRemaining === "0") {
                    const resetAt = res.headers.get("x-ratelimit-reset");
                    const resetTime = resetAt ? new Date(parseInt(resetAt) * 1000).toLocaleTimeString() : "soon";
                    return { items: [], total_count: 0, incomplete_results: false, error: `Rate limit exceeded. Resets at ${resetTime}. Set GITHUB_TOKEN to increase limits.` };
                }
                return { items: [], total_count: 0, incomplete_results: false, error: "Access forbidden. Check your GITHUB_TOKEN if set." };
            }
            if (res.status === 422) {
                return { items: [], total_count: 0, incomplete_results: false, error: "Invalid search query. Try simplifying your filters." };
            }
            return { items: [], total_count: 0, incomplete_results: false, error: `GitHub API error: ${res.statusText} (${res.status})` };
        }

        const data: GithubSearchResponse = await res.json();

        if (!data.items) {
            return { ...data, items: [] };
        }

        return data;
    } catch (error) {
        console.error("Failed to fetch issues:", error);
        return { items: [], total_count: 0, incomplete_results: false, error: "Network error or GitHub API unreachable." };
    }
}
