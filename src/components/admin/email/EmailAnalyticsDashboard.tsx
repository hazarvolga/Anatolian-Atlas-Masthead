import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  MailOpen, 
  MousePointer, 
  AlertTriangle,
  Users,
  BarChart3
} from 'lucide-react';


interface EmailStats {
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  unsubscribed: number;
  total_sent: number;
}

interface ProviderStats {
  provider: string;
  stats: EmailStats;
}

const EmailAnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<EmailStats>({
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    complained: 0,
    unsubscribed: 0,
    total_sent: 0
  });
  
  const [providerStats, setProviderStats] = useState<ProviderStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmailStats();
  }, []);

  const fetchEmailStats = async () => {
    try {
      setIsLoading(true);
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      // Placeholder for fetching email stats from backend
      // You will need to implement a backend API for this (e.g., /api/admin/email-stats)
      // For now, returning dummy data or an empty state
      setStats({
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        complained: 0,
        unsubscribed: 0,
        total_sent: 0
      });
      setProviderStats([]);
    } catch (error) {
      console.error('Error fetching email stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRate = (numerator: number, denominator: number): number => {
    return denominator > 0 ? (numerator / denominator) * 100 : 0;
  };

  const getHealthStatus = (rate: number, type: 'good' | 'bad'): { color: string; status: string } => {
    if (type === 'good') {
      if (rate >= 20) return { color: 'text-green-600', status: 'Excellent' };
      if (rate >= 15) return { color: 'text-blue-600', status: 'Good' };
      if (rate >= 10) return { color: 'text-yellow-600', status: 'Fair' };
      return { color: 'text-red-600', status: 'Poor' };
    } else {
      if (rate <= 1) return { color: 'text-green-600', status: 'Excellent' };
      if (rate <= 3) return { color: 'text-blue-600', status: 'Good' };
      if (rate <= 5) return { color: 'text-yellow-600', status: 'Fair' };
      return { color: 'text-red-600', status: 'Poor' };
    }
  };

  const deliveryRate = calculateRate(stats.delivered, stats.total_sent);
  const openRate = calculateRate(stats.opened, stats.delivered);
  const clickRate = calculateRate(stats.clicked, stats.delivered);
  const bounceRate = calculateRate(stats.bounced, stats.total_sent);
  const complaintRate = calculateRate(stats.complained, stats.delivered);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Analytics</h2>
          <p className="text-muted-foreground">Monitor your email performance and deliverability</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Last 30 Days
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryRate.toFixed(1)}%</div>
            <div className="flex items-center space-x-2">
              <Progress value={deliveryRate} className="flex-1" />
              <Badge variant="outline" className={getHealthStatus(deliveryRate, 'good').color}>
                {getHealthStatus(deliveryRate, 'good').status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.delivered} / {stats.total_sent} delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openRate.toFixed(1)}%</div>
            <div className="flex items-center space-x-2">
              <Progress value={openRate} className="flex-1" />
              <Badge variant="outline" className={getHealthStatus(openRate, 'good').color}>
                {getHealthStatus(openRate, 'good').status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.opened} opens
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clickRate.toFixed(1)}%</div>
            <div className="flex items-center space-x-2">
              <Progress value={clickRate} className="flex-1" />
              <Badge variant="outline" className={getHealthStatus(clickRate, 'good').color}>
                {getHealthStatus(clickRate, 'good').status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.clicked} clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bounceRate.toFixed(1)}%</div>
            <div className="flex items-center space-x-2">
              <Progress value={bounceRate} className="flex-1" />
              <Badge variant="outline" className={getHealthStatus(bounceRate, 'bad').color}>
                {getHealthStatus(bounceRate, 'bad').status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.bounced} bounces
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Provider Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Performance</CardTitle>
          <CardDescription>
            Compare performance across different email service providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providerStats.map((provider) => (
              <div key={provider.provider} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="font-medium capitalize">{provider.provider}</div>
                  <Badge variant="outline">
                    {provider.stats.total_sent} sent
                  </Badge>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">
                      {calculateRate(provider.stats.delivered, provider.stats.total_sent).toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground">Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">
                      {calculateRate(provider.stats.opened, provider.stats.delivered).toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground">Open</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">
                      {calculateRate(provider.stats.clicked, provider.stats.delivered).toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground">Click</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-red-600">
                      {calculateRate(provider.stats.bounced, provider.stats.total_sent).toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground">Bounce</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailAnalyticsDashboard;
