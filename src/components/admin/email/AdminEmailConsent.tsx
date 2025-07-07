import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmailConsent } from "@/hooks/useEmailConsent";
import { Search, Download, UserCheck, UserX, Mail, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminEmailConsent() {
  const { subscriptions, loading, fetchSubscriptions } = useEmailConsent();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || sub.subscription_type === filterType;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "subscribed" && sub.is_subscribed) ||
      (filterStatus === "unsubscribed" && !sub.is_subscribed) ||
      (filterStatus === "pending" && !sub.double_optin_confirmed);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const subscriptionStats = {
    total: subscriptions.length,
    subscribed: subscriptions.filter(s => s.is_subscribed).length,
    unsubscribed: subscriptions.filter(s => !s.is_subscribed).length,
    pendingConfirmation: subscriptions.filter(s => !s.double_optin_confirmed).length,
  };

  const subscriptionTypes = [
    { value: "all", label: "All Types" },
    { value: "transactional", label: "Transactional" },
    { value: "marketing", label: "Marketing" },
    { value: "newsletter", label: "Newsletter" },
    { value: "promotional", label: "Promotional" },
  ];

  const exportSubscriptions = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Email,Type,Status,Subscribed At,Source\n" +
      filteredSubscriptions.map(sub => 
        `${sub.email},${sub.subscription_type},${sub.is_subscribed ? 'Subscribed' : 'Unsubscribed'},${sub.consent_given_at},${sub.source || 'N/A'}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "email_subscriptions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading email consents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Email Consent Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage user email subscriptions and KVKK/GDPR compliance
          </p>
        </div>
        <Button onClick={exportSubscriptions} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Subscriptions</CardDescription>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold">{subscriptionStats.total}</span>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Subscribers</CardDescription>
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{subscriptionStats.subscribed}</span>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Unsubscribed</CardDescription>
            <div className="flex items-center gap-2">
              <UserX className="h-4 w-4 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{subscriptionStats.unsubscribed}</span>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Confirmation</CardDescription>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{subscriptionStats.pendingConfirmation}</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="compliance">KVKK/GDPR</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search by Email</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search emails..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="sm:w-48">
                  <Label>Subscription Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subscriptionTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="sm:w-40">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="subscribed">Subscribed</SelectItem>
                      <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Email Subscriptions ({filteredSubscriptions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Confirmation</TableHead>
                      <TableHead>Subscribed At</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">{subscription.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            subscription.subscription_type === 'transactional' && 'border-blue-200 text-blue-700 bg-blue-50',
                            subscription.subscription_type === 'marketing' && 'border-purple-200 text-purple-700 bg-purple-50',
                            subscription.subscription_type === 'newsletter' && 'border-green-200 text-green-700 bg-green-50',
                            subscription.subscription_type === 'promotional' && 'border-orange-200 text-orange-700 bg-orange-50',
                          )}>
                            {subscription.subscription_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {subscription.is_subscribed ? (
                            <Badge variant="default" className="bg-green-600">Subscribed</Badge>
                          ) : (
                            <Badge variant="secondary">Unsubscribed</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {subscription.subscription_type === 'transactional' ? (
                            <Badge variant="outline">Not Required</Badge>
                          ) : subscription.double_optin_confirmed ? (
                            <Badge variant="default" className="bg-green-600">Confirmed</Badge>
                          ) : (
                            <Badge variant="destructive">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(subscription.consent_given_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {subscription.source || 'Unknown'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredSubscriptions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No subscriptions found matching the filters.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KVKK/GDPR Compliance</CardTitle>
              <CardDescription>
                Ensure your email practices comply with data protection regulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Double Opt-in Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-optin">Marketing Emails</Label>
                      <Switch id="marketing-optin" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="newsletter-optin">Newsletter</Label>
                      <Switch id="newsletter-optin" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="promotional-optin">Promotional Emails</Label>
                      <Switch id="promotional-optin" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Compliance Features</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Double opt-in for marketing emails
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Automatic unsubscribe links
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Consent logging and audit trail
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      IP address and timestamp tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      Easy data export for requests
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Consent Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-unsubscribe">Auto-add Unsubscribe Links</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically add unsubscribe links to all marketing emails
                    </p>
                  </div>
                  <Switch id="auto-unsubscribe" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="consent-logging">Log All Consent Actions</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep detailed logs of all subscription changes
                    </p>
                  </div>
                  <Switch id="consent-logging" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="double-optin-required">Require Double Opt-in</Label>
                    <p className="text-sm text-muted-foreground">
                      Require email confirmation for new subscriptions
                    </p>
                  </div>
                  <Switch id="double-optin-required" defaultChecked />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
