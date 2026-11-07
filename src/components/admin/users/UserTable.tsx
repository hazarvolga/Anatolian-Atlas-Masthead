
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUpdateUserRole } from "@/hooks/useAdminUsers";
import { format } from "date-fns";
import { Shield, UserCheck, UserX, Crown, Eye } from "lucide-react";
import UserDetailModal from "./UserDetailModal";

interface UserTableProps {
  users: any[];
  selectedUsers: string[];
  onUserSelect: (userId: string, checked: boolean) => void;
}

export default function UserTable({ users, selectedUsers, onUserSelect }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const updateUserRole = useUpdateUserRole();
  
  const handleRoleChange = async (userId: string, newRole: 'admin' | 'moderator' | 'user' | 'super_admin') => {
    await updateUserRole.mutateAsync({ userId, roleName: newRole });
  };

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Select</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const userRole = user.user_roles && Array.isArray(user.user_roles) && user.user_roles.length > 0 
              ? user.user_roles[0].role 
              : 'user';
            
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => onUserSelect(user.id, !!checked)}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.full_name || 'Unknown User'}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={userRole !== 'user' ? "default" : "secondary"}>
                    {userRole === 'super_admin' ? 'Super Admin' : userRole}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {format(new Date(user.created_at), "PPP")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(user)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRoleChange(user.id, 'super_admin')}
                      disabled={updateUserRole.isPending}
                    >
                      <Crown className="h-4 w-4 mr-1" />
                      Super
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRoleChange(user.id, 'admin')}
                      disabled={updateUserRole.isPending}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRoleChange(user.id, 'moderator')}
                      disabled={updateUserRole.isPending}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Mod
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRoleChange(user.id, 'user')}
                      disabled={updateUserRole.isPending}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      User
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <UserDetailModal 
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
