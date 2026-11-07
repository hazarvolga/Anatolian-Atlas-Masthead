"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, UserCheck, Crown, Ban, Mail, Calendar } from "lucide-react";

interface UserStatsProps {
  users: any[];
}

export default function UserStats({ users }: UserStatsProps) {
  console.log('UserStats - users data:', users); // Debug log
  
  const totalUsers = users.length;
  
  // Role statistics - güvenli şekilde kontrol edelim
  const admins = users.filter(user => {
    const role = user.user_roles?.[0]?.role;
    return role === 'admin';
  }).length;
  
  const guides = users.filter(user => {
    const role = user.user_roles?.[0]?.role;
    return role === 'guide';
  }).length;
  
  const moderators = users.filter(user => {
    const role = user.user_roles?.[0]?.role;
    return role === 'moderator';
  }).length;

  const regularUsers = users.filter(user => {
    const role = user.user_roles?.[0]?.role;
    return !role || role === 'user';
  }).length;

  // Status statistics - güvenli kontroller
  const activeUsers = users.filter(user => 
    (user.email_confirmed_at || user.created_at) && !user.banned_until
  ).length;
  
  const bannedUsers = users.filter(user => 
    user.banned_until && new Date(user.banned_until) > new Date()
  ).length;
  
  const unconfirmedUsers = users.filter(user => 
    !user.email_confirmed_at && !user.created_at // Eğer bu alanlar yoksa sıfır olacak
  ).length;

  // Recent activity - güvenli kontrol
  const recentSignIns = users.filter(user => {
    const signInDate = user.last_sign_in_at || user.created_at; // Fallback to created_at
    if (!signInDate) return false;
    
    const lastSignIn = new Date(signInDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastSignIn > weekAgo;
  }).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Admins</CardTitle>
          <Shield className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{admins}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Guides</CardTitle>
          <Crown className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{guides}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
          <Users className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{regularUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Banned</CardTitle>
          <Ban className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{bannedUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unconfirmed</CardTitle>
          <Mail className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">{unconfirmedUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active (7d)</CardTitle>
          <Calendar className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{recentSignIns}</div>
        </CardContent>
      </Card>
    </div>
  );
}