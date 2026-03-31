import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";
import { GithubIssue } from "../lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface IssueCardProps {
    issue: GithubIssue;
}

export function IssueCard({ issue }: IssueCardProps) {
    const repoName = issue.html_url.replace("https://github.com/", "").split("/issues")[0];

    return (
        <Card className="flex flex-col hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4 min-w-0 w-full">
                    <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-1">
                            <span className="font-mono text-xs">{repoName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">#{issue.number}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1" title={`Updated ${formatDistanceToNow(new Date(issue.updated_at))} ago`}>
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs">{formatDistanceToNow(new Date(issue.updated_at), { addSuffix: true })}</span>
                            </div>
                        </div>
                        <CardTitle className="text-lg leading-tight line-clamp-2 mt-3">
                            <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary transition-colors">
                                {issue.title}
                            </a>
                        </CardTitle>
                    </div>
                    <Badge
                        variant="outline"
                        className={`capitalize shrink-0 gap-1 ${issue.state === "open"
                            ? "border-green-600 text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                            : "border-purple-600 text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800"
                            }`}
                    >
                        {issue.state === "open" ? (
                            <span className="h-2 w-2 rounded-full bg-current" />
                        ) : (
                            <CheckCircle2 className="h-3 w-3" />
                        )}
                        {issue.state}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-3">
                <div className="flex flex-wrap gap-2 mb-4">
                    {issue.labels.slice(0, 3).map((label) => (
                        <Badge
                            key={label.id}
                            variant="outline"
                            className="text-xs font-normal"
                            style={{
                                borderColor: `#${label.color}`,
                                backgroundColor: `#${label.color}10`,
                            }}
                        >
                            {label.name}
                        </Badge>
                    ))}
                    {issue.labels.length > 3 && (
                        <span className="text-xs text-muted-foreground self-center">+{issue.labels.length - 3}</span>
                    )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1" title="Comments">
                        <MessageSquare className="h-4 w-4" />
                        <span>{issue.comments} comments</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center text-xs text-muted-foreground border-t bg-muted/20 p-4">
                <div className="flex items-center gap-2">
                    <img src={issue.user.avatar_url} alt={issue.user.login} className="w-5 h-5 rounded-full" />
                    <span className="truncate max-w-[100px] font-medium">{issue.user.login}</span>
                </div>

                <Button size="sm" variant="ghost" className="h-8 gap-1" asChild>
                    <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                        View on GitHub
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}
