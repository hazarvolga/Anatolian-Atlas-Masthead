"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEmailConsent } from "@/hooks/useEmailConsent";
import { CheckCircle, XCircle } from "lucide-react";

export default function EmailConfirmationClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { confirmDoubleOptin } = useEmailConsent();
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);

  const handleConfirmation = async () => {
    if (!token) return;

    try {
      const result = await confirmDoubleOptin(token);
      setSubscriptionInfo(result);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (token) {
      handleConfirmation();
    } else {
      setStatus('error');
    }
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Confirming your subscription...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Email Confirmed!</CardTitle>
            <CardDescription>
              Thank you for confirming your email subscription. You&apos;re all set!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscriptionInfo && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Subscription Details</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Email:</span> {subscriptionInfo.email}</p>
                  <p><span className="font-medium">Type:</span> {subscriptionInfo.subscription_type}</p>
                  <p><span className="font-medium">Confirmed:</span> {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              <p>You can manage your email preferences anytime from your account settings.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1"
                onClick={() => router.push('/')}
              >
                Continue to Homepage
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push('/profile')}
              >
                Manage Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle>Confirmation Failed</CardTitle>
          <CardDescription>
            The confirmation link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>This might happen if:</p>
            <ul className="mt-2 space-y-1">
              <li>• The link has already been used</li>
              <li>• The link has expired (links are valid for 7 days)</li>
              <li>• The email has already been confirmed</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push('/profile')}
            >
              Go to Account Settings
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/contact')}
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
