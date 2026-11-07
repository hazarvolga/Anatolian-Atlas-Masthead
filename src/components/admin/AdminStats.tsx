import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useAdminTours } from "@/hooks/useAdminTours";
import { useAdminReservations } from "@/hooks/useAdminReservations";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Calendar, DollarSign, TrendingUp, TrendingDown, Activity, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminStats() {
  const { data: users = [] } = useAdminUsers();
  const { data: tours = [] } = useAdminTours();
  const { data: bookings = [] } = useAdminReservations();
  
  const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.totalPrice ?? 0), 0);
  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed').length;
  const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
  const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled').length;
  const activeTours = tours.filter(tour => tour.status === 'active').length;
  
  // Calculate trends (mock data for demonstration - you can implement real trend calculation)
  const userGrowth = 12.5; // Percentage growth
  const revenueGrowth = 8.3;
  const bookingGrowth = -2.1;
  const tourGrowth = 15.7;
  
  const stats = [
    {
      title: "Total Users",
      value: users.length,
      description: "Registered users",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      trend: userGrowth,
      progress: Math.min((users.length / 1000) * 100, 100), // Assuming target of 1000 users
      target: 1000,
      badge: users.length > 500 ? "Excellent" : users.length > 200 ? "Good" : "Growing",
      badgeVariant: users.length > 500 ? "default" : users.length > 200 ? "secondary" : "outline"
    },
    {
      title: "Active Tours",
      value: activeTours,
      description: `${tours.length} total tours`,
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      trend: tourGrowth,
      progress: Math.min((activeTours / tours.length) * 100, 100),
      target: tours.length,
      badge: activeTours === tours.length ? "All Active" : activeTours > tours.length * 0.8 ? "Most Active" : "Some Inactive",
      badgeVariant: activeTours === tours.length ? "default" : activeTours > tours.length * 0.8 ? "secondary" : "destructive"
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      description: `${confirmedBookings} confirmed, ${pendingBookings} pending`,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      trend: bookingGrowth,
      progress: Math.min((confirmedBookings / bookings.length) * 100, 100),
      target: bookings.length,
      badge: pendingBookings > 5 ? "Needs Attention" : pendingBookings > 0 ? "Pending Approval" : "All Processed",
      badgeVariant: pendingBookings > 5 ? "destructive" : pendingBookings > 0 ? "outline" : "default"
    },
    {
      title: "Total Revenue",
      value: `€${totalRevenue.toLocaleString()}`,
      description: "From all bookings",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      trend: revenueGrowth,
      progress: Math.min((totalRevenue / 50000) * 100, 100), // Assuming target of €50k
      target: 50000,
      badge: totalRevenue > 30000 ? "Excellent" : totalRevenue > 15000 ? "Good" : "Growing",
      badgeVariant: totalRevenue > 30000 ? "default" : totalRevenue > 15000 ? "secondary" : "outline"
    }
  ];

  const quickStats = [
    {
      label: "Confirmed Bookings",
      value: confirmedBookings,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Pending Reviews",
      value: pendingBookings,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      label: "Cancelled",
      value: cancelledBookings,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      label: "Completion Rate",
      value: `${Math.round((confirmedBookings / (bookings.length || 1)) * 100)}%`,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    }
  ];
  
  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositiveTrend = stat.trend > 0;
          const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;
          
          return (
            <Card 
              key={index} 
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105",
                "border-l-4", 
                stat.borderColor,
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={stat.badgeVariant as any} className="text-xs">
                      {stat.badge}
                    </Badge>
                  </div>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  stat.bgColor
                )}>
                  <Icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(stat.progress)}%</span>
                  </div>
                  <Progress 
                    value={stat.progress} 
                    className="h-2"
                  />
                </div>
                
                {/* Trend Indicator */}
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    isPositiveTrend ? "text-green-600" : "text-red-600"
                  )}>
                    <TrendIcon className="h-3 w-3" />
                    {Math.abs(stat.trend)}%
                  </div>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats Bar */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Overview</CardTitle>
          <CardDescription>
            Real-time booking status and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((quickStat, index) => {
              const QuickIcon = quickStat.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    quickStat.bgColor
                  )}>
                    <QuickIcon className={cn("h-5 w-5", quickStat.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{quickStat.value}</p>
                    <p className="text-xs text-muted-foreground">{quickStat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
