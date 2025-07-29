import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  Mail, 
  Shield, 
  Clock,
  Activity,
  Send,
  Settings
} from 'lucide-react';
import { useDeliverySettings } from '@/hooks/useDeliverySettings';

import { useToast } from '@/hooks/use-toast';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

const EmailDeliveryTest: React.FC = () => {
  const {
    settings,
    quota,
    status,
    canSendEmail,
    validateEmailContent,
    resetQuota,
    toggleDeliveryStatus
  } = useDeliverySettings();

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

  const runDeliveryManagerTest = async (action: string, data: any): Promise<TestResult> => {
    try {
      // Placeholder for backend API call
      // You will need to implement a backend API for this (e.g., /api/admin/email-tests)
      const response = await axios.post(`${API_BASE_URL}/api/admin/email-tests`, { action, ...data }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      return {
        success: true,
        message: `${action} test passed`,
        details: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: `${action} test failed: ${error.response?.data?.message || error.message}`,
        details: error.response?.data || error
      };
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    const results: TestResult[] = [];

    // Test 1: Check sending allowed
    const sendingTest = await runDeliveryManagerTest('check_sending_allowed', {});
    results.push(sendingTest);

    // Test 2: Validate good email
    const goodEmailTest = await runDeliveryManagerTest('validate_email', {
      email_data: {
        to_email: 'user@example.com',
        subject: 'Welcome to our service',
        html_content: '<p>Welcome! This is a test email. <a href="#unsubscribe">Unsubscribe</a></p>'
      }
    });
    results.push(goodEmailTest);

    // Test 3: Validate bad email (with spam content)
    const badEmailTest = await runDeliveryManagerTest('validate_email', {
      email_data: {
        to_email: 'test@10minutemail.com',
        subject: 'URGENT!!! ACT NOW!!!',
        html_content: '<p>This is spam content with many links:</p>' + 
          Array(10).fill('<a href="#">link</a>').join(' ')
      }
    });
    results.push({
      success: !badEmailTest.success, // We expect this to fail
      message: badEmailTest.success ? 'Spam detection failed' : 'Spam detection working',
      details: badEmailTest.details
    });

    // Test 4: Track email event
    const eventTest = await runDeliveryManagerTest('track_email_event', {
      event_data: {
        event_type: 'delivery',
        email_id: 'test-email-id',
        recipient_email: 'test@example.com',
        provider_name: 'resend'
      }
    });
    results.push(eventTest);

    // Test 5: Update quota
    const quotaTest = await runDeliveryManagerTest('update_quota', {
      email_data: {
        to_email: 'test@example.com',
        provider: 'resend'
      }
    });
    results.push(quotaTest);

    setTestResults(results);
    setIsRunningTests(false);

    // Show summary toast
    const passed = results.filter(r => r.success).length;
    const total = results.length;
    
    toast({
      title: 'Test Results',
      description: `${passed}/${total} tests passed`,
      variant: passed === total ? 'default' : 'destructive'
    });
  };

  const testEmailSending = async () => {
    try {
      // Placeholder for backend API call
      // You will need to implement a backend API for this (e.g., /api/admin/send-test-email)
      await axios.post(`${API_BASE_URL}/api/admin/send-test-email`, {
        email: 'test@example.com',
        fullName: 'Test User',
        tour: 'Test Tour',
        destination: 'Test Destination'
      });

      toast({
        title: 'Success',
        description: 'Test email sent successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Test email failed: ${error.response?.data?.message || error.message}`,
        variant: 'destructive'
      });
    }
  };

  const sendingStatus = canSendEmail();
  const hourlyProgress = quota ? (quota.hourly_sent / settings.max_emails_per_hour) * 100 : 0;
  const dailyProgress = quota ? (quota.daily_sent / settings.max_emails_per_day) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Email Delivery Testing</h3>
          <p className="text-sm text-muted-foreground">
            Test and monitor email delivery system functionality
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runAllTests} 
            disabled={isRunningTests}
            variant="outline"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isRunningTests ? 'Running Tests...' : 'Run System Tests'}
          </Button>
          <Button 
            onClick={testEmailSending}
            disabled={!sendingStatus.allowed}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Test Email
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">System Status</p>
                <p className="text-lg font-bold">
                  {sendingStatus.allowed ? 'Active' : 'Paused'}
                </p>
              </div>
              {sendingStatus.allowed ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Hourly Usage</p>
                <p className="text-lg font-bold">{quota?.hourly_sent || 0}</p>
                <p className="text-xs text-muted-foreground">
                  of {settings.max_emails_per_hour}
                </p>
              </div>
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <Progress value={hourlyProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Daily Usage</p>
                <p className="text-lg font-bold">{quota?.daily_sent || 0}</p>
                <p className="text-xs text-muted-foreground">
                  of {settings.max_emails_per_day}
                </p>
              </div>
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <Progress value={dailyProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Bounce Rate</p>
                <p className="text-lg font-bold">{status?.bounce_rate?.toFixed(2) || '0.00'}%</p>
                <p className="text-xs text-muted-foreground">
                  Threshold: {settings.bounce_rate_threshold}%
                </p>
              </div>
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <Progress value={status?.bounce_rate || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {!sendingStatus.allowed && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Email Delivery Blocked:</strong> {sendingStatus.reason}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">System Tests</TabsTrigger>
          <TabsTrigger value="content">Content Validation</TabsTrigger>
          <TabsTrigger value="controls">Manual Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Automated tests for email delivery system components
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <p className="text-muted-foreground">No tests run yet. Click "Run System Tests" to begin.</p>
              ) : (
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium">{result.message}</p>
                          {result.details && (
                            <p className="text-sm text-muted-foreground">
                              {typeof result.details === 'string' 
                                ? result.details 
                                : JSON.stringify(result.details, null, 2)
                              }
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant={result.success ? 'default' : 'destructive'}>
                        {result.success ? 'PASS' : 'FAIL'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Validation Examples</CardTitle>
              <CardDescription>
                Examples of content that would pass or fail validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-medium text-green-800 mb-2">✅ Good Content Example</h4>
                  <p className="text-sm"><strong>Subject:</strong> Welcome to our service</p>
                  <p className="text-sm"><strong>Content:</strong> Welcome! Thank you for joining us. <a href="#unsubscribe">Unsubscribe</a></p>
                  <Badge variant="outline" className="mt-2">Valid</Badge>
                </div>

                <div className="p-4 border rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-800 mb-2">❌ Bad Content Example</h4>
                  <p className="text-sm"><strong>Subject:</strong> URGENT!!! ACT NOW!!!</p>
                  <p className="text-sm"><strong>Issues:</strong></p>
                  <ul className="text-sm list-disc list-inside mt-1">
                    <li>Contains blocked words: "urgent", "act now"</li>
                    <li>High spam score due to excessive caps and urgency</li>
                    <li>Sent to disposable email domain</li>
                  </ul>
                  <Badge variant="destructive" className="mt-2">Blocked</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Controls</CardTitle>
                <CardDescription>
                  Manual controls for email system management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant={status?.is_paused ? "default" : "destructive"}
                  onClick={() => toggleDeliveryStatus(!status?.is_paused)}
                  className="w-full"
                >
                  {status?.is_paused ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resume Email Delivery
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Pause Email Delivery
                    </>
                  )}
                </Button>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => resetQuota('hourly')}
                    className="flex-1"
                  >
                    Reset Hourly Quota
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => resetQuota('daily')}
                    className="flex-1"
                  >
                    Reset Daily Quota
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Settings Summary</CardTitle>
                <CardDescription>
                  Key delivery settings at a glance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Max emails/hour:</span>
                  <span className="text-sm font-medium">{settings.max_emails_per_hour}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Max emails/day:</span>
                  <span className="text-sm font-medium">{settings.max_emails_per_day}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Spam filtering:</span>
                  <Badge variant={settings.enable_spam_filtering ? "default" : "secondary"}>
                    {settings.enable_spam_filtering ? "ON" : "OFF"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Content filtering:</span>
                  <Badge variant={settings.enable_content_filtering ? "default" : "secondary"}>
                    {settings.enable_content_filtering ? "ON" : "OFF"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Backup provider:</span>
                  <Badge variant={settings.enable_backup_provider ? "default" : "secondary"}>
                    {settings.enable_backup_provider ? "ON" : "OFF"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailDeliveryTest;
