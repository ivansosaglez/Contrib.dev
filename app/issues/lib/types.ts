export interface GithubUser {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
}

export interface GithubLabel {
    id: number;
    url: string;
    name: string;
    color: string;
    description?: string;
}

export interface GithubIssue {
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    id: number;
    node_id: string;
    number: number;
    title: string;
    user: GithubUser;
    labels: GithubLabel[];
    state: "open" | "closed";
    locked: boolean;
    assignee: GithubUser | null;
    assignees: GithubUser[];
    milestone: any;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    author_association: string;
    active_lock_reason: string | null;
    body: string;
    reactions: any;
    score: number;
}

export interface GithubSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GithubIssue[];
}

export type IssueState = "open" | "closed" | "all";
export type IssueSort = "best-match" | "stars" | "forks" | "help-wanted-issues" | "updated" | "created" | "comments"; // Based on Github API sort options
export type IssueOrder = "asc" | "desc";

export interface SearchFilters {
    query?: string;
    label?: string;
    language?: string;
    minStars?: number;
    state?: IssueState;
    sort?: IssueSort;
    order?: IssueOrder;
    page?: number;
    per_page?: number;
}
