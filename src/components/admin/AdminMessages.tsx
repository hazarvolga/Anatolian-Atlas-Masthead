import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Mail, Phone, User, MailOpen, MessageSquareReply, Archive, Inbox } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ErrorAlert from "./ErrorAlert";
import {
  useAdminContactMessages,
  useAdminUpdateContactMessageStatus,
  type ContactMessageStatus,
} from "@/hooks/useAdminContactMessages";

const statusStyles: Record<ContactMessageStatus, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-300",
  read: "bg-yellow-100 text-yellow-800 border-yellow-300",
  replied: "bg-green-100 text-green-800 border-green-300",
  archived: "bg-muted text-muted-foreground border-border",
};

const statusActions: { status: ContactMessageStatus; label: string; icon: React.ReactNode }[] = [
  { status: "read", label: "Mark as read", icon: <MailOpen className="h-4 w-4 mr-2" /> },
  { status: "replied", label: "Mark as replied", icon: <MessageSquareReply className="h-4 w-4 mr-2" /> },
  { status: "archived", label: "Archive", icon: <Archive className="h-4 w-4 mr-2" /> },
  { status: "new", label: "Move back to inbox", icon: <Inbox className="h-4 w-4 mr-2" /> },
];

export default function AdminMessages() {
  const { data: messages = [], isLoading, error, refetch } = useAdminContactMessages();
  const updateStatusMutation = useAdminUpdateContactMessageStatus();

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="lg" text="Loading messages..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert
        title="Failed to load messages"
        message={error instanceof Error ? error.message : "An unknown error occurred."}
        onRetry={() => refetch()}
        retryLabel="Reload messages"
      />
    );
  }

  const newCount = messages.filter((message) => message.status === "new").length;

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Contact Messages</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Messages sent from the website contact form ({messages.length} total, {newCount} new)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="No messages yet"
            description="When visitors use the contact form, their messages will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>Subject & Message</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id} className={message.status === "new" ? "font-medium" : undefined}>
                    <TableCell className="align-top">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{message.name}</span>
                      </div>
                      <a
                        href={`mailto:${message.email}`}
                        className="text-xs text-muted-foreground flex items-center gap-2 hover:text-primary"
                      >
                        <Mail className="h-3 w-3" /> {message.email}
                      </a>
                      {message.phone && (
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <Phone className="h-3 w-3" /> {message.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="align-top max-w-md">
                      <div className="font-semibold mb-1">{message.subject}</div>
                      <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                        {message.message}
                      </p>
                    </TableCell>
                    <TableCell className="align-top text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(message.created_at), "dd MMM yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant="outline" className={statusStyles[message.status]}>
                        {message.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Message actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {statusActions
                            .filter((action) => action.status !== message.status)
                            .map((action) => (
                              <DropdownMenuItem
                                key={action.status}
                                disabled={updateStatusMutation.isPending}
                                onClick={() =>
                                  updateStatusMutation.mutate({ id: message.id, status: action.status })
                                }
                              >
                                {action.icon}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}