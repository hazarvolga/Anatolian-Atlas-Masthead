"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, Search, MoreHorizontal, UserCheck, UserX, ShieldCheck, Briefcase, User, Calendar, Mail, DollarSign, Star, Package, Loader2 } from "lucide-react";
import { useAdminUsers, useUpdateUserRole } from "@/hooks/useAdminUsers";
import { format } from "date-fns";
import { toast } from "sonner";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ErrorAlert from "./ErrorAlert";

const roleIcons: { [key: string]: React.ReactNode } = {
  admin: <ShieldCheck className="h-4 w-4 text-red-500" />,
  guide: <Briefcase className="h-4 w-4 text-blue-500" />,
  user: <User className="h-4 w-4 text-gray-500" />,
};

export default function AdminUsers() {
  const { data: users = [], isLoading, error, refetch } = useAdminUsers();
  const updateUserRoleMutation = useUpdateUserRole();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = useMemo(() => {
    return users.filter((user: any) => {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
      const searchMatch = searchTerm === "" || 
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const roleMatch = roleFilter === "all" || user.role === roleFilter;
      return searchMatch && roleMatch;
    });
  }, [users, searchTerm, roleFilter]);

  const handleRoleChange = (userId: string, roleName: string) => {
    updateUserRoleMutation.mutate({ userId, roleName }, {
      onSuccess: () => toast.success(`User role updated to ${roleName}`),
      onError: (err: any) => toast.error(err.message || "Failed to update role"),
    });
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user: any) => user.id));
    }
  };

  if (isLoading) {
    return <div className="text-center py-16"><LoadingSpinner size="lg" text="Loading users..." /></div>;
  }
  
  if (error) {
    return <ErrorAlert title="Failed to load users" message={error instanceof Error ? error.message : "An unknown error occurred."} onRetry={refetch} retryLabel="Reload users" />;
  }
  
  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">User Management</CardTitle>
          <CardDescription className="text-sm md:text-base">
            View and manage all registered users ({users.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredUsers.length === 0 ? (
            <EmptyState icon={Users} title="No users found" description="No users match the current filters." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleSelectUser(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{`${user.first_name} ${user.last_name}`}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {user.email}
                          {user.email_verified && <ShieldCheck className="h-4 w-4 text-green-500" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize flex items-center gap-1.5">
                          {roleIcons[user.role] || <User className="h-4 w-4" />}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex items-center gap-1.5" title="Total Spent">
                            <DollarSign className="h-3 w-3 text-green-500" />
                            <span>₺{user.total_spent.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1.5" title="Reservations">
                            <Package className="h-3 w-3 text-blue-500" />
                            <span>{user.reservation_count}</span>
                          </div>
                          <div className="flex items-center gap-1.5" title="Reviews">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{user.review_count}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(user.created_at), "dd MMM yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={updateUserRoleMutation.isPending}>
                              {updateUserRoleMutation.isPending && updateUserRoleMutation.variables?.userId === user.id 
                                ? <Loader2 className="h-4 w-4 animate-spin" /> 
                                : <MoreHorizontal className="h-4 w-4" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')} disabled={user.role === 'admin'}>
                              <ShieldCheck className="mr-2 h-4 w-4" /> Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'guide')} disabled={user.role === 'guide'}>
                              <Briefcase className="mr-2 h-4 w-4" /> Make Guide
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'user')} disabled={user.role === 'user'}>
                              <User className="mr-2 h-4 w-4" /> Make User
                            </DropdownMenuItem>
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
    </div>
  );
}
