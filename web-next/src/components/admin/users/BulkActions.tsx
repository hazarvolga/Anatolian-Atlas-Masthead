"use client";


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateUserRole } from "@/hooks/useAdminUsers";
import { Shield, UserCheck, UserX, Crown, Users } from "lucide-react";
import { toast } from "sonner";

interface BulkActionsProps {
  users: any[];
  selectedUsers: string[];
  setSelectedUsers: (users: string[]) => void;
}

export default function BulkActions({ users, selectedUsers, setSelectedUsers }: BulkActionsProps) {
  const [bulkRole, setBulkRole] = useState<string>("");
  const updateUserRole = useUpdateUserRole();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleBulkRoleChange = async () => {
    if (!bulkRole || selectedUsers.length === 0) {
      toast.error("Please select users and a role");
      return;
    }

    try {
      for (const userId of selectedUsers) {
        await updateUserRole.mutateAsync({ userId, roleName: bulkRole as any });
      }
      toast.success(`Updated ${selectedUsers.length} user(s) to ${bulkRole}`);
      setSelectedUsers([]);
      setBulkRole("");
    } catch (error) {
      toast.error("Failed to update user roles");
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">Bulk Actions</h3>
        <span className="text-sm text-muted-foreground">
          ({selectedUsers.length} selected)
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedUsers.length === users.length && users.length > 0}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm">Select All Users</span>
      </div>
      
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-2">
          <Select value={bulkRole} onValueChange={setBulkRole}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleBulkRoleChange}
            disabled={!bulkRole || updateUserRole.isPending}
          >
            Update Selected Roles
          </Button>
        </div>
      )}
    </div>
  );
}
