
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User, Mail, Calendar, Shield } from "lucide-react";

interface UserDetailModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  if (!user) return null;

  const userRole = user.user_roles && Array.isArray(user.user_roles) && user.user_roles.length > 0 
    ? user.user_roles[0].role 
    : 'user';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{user.full_name || 'Unknown User'}</h3>
              <p className="text-sm text-muted-foreground">Full Name</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Mail className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-muted-foreground">Email Address</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-full">
              <Shield className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <Badge variant={userRole !== 'user' ? "default" : "secondary"}>
                {userRole === 'super_admin' ? 'Super Admin' : userRole}
              </Badge>
              <p className="text-sm text-muted-foreground">Role</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-full">
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="font-medium">{format(new Date(user.created_at), "PPP")}</p>
              <p className="text-sm text-muted-foreground">Registration Date</p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">User ID</h4>
            <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
              {user.id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
