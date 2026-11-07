"use client";


import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";

interface ExportUsersProps {
  users: any[];
}

export default function ExportUsers({ users }: ExportUsersProps) {
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Created At', 'User ID'];
    const csvData = users.map(user => {
      const userRole = user.user_roles && Array.isArray(user.user_roles) && user.user_roles.length > 0 
        ? user.user_roles[0].role 
        : 'user';
      
      return [
        user.full_name || 'Unknown User',
        user.email,
        userRole === 'super_admin' ? 'Super Admin' : userRole,
        format(new Date(user.created_at), "yyyy-MM-dd HH:mm:ss"),
        user.id
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={exportToCSV} variant="outline">
      <Download className="h-4 w-4 mr-2" />
      Export CSV ({users.length} users)
    </Button>
  );
}
