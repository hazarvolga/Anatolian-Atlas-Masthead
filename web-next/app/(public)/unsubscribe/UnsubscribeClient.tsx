"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmailConsent } from "@/hooks/useEmailConsent";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, XCircle, Mail, Shield, Loader2 } from "lucide-react";

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { unsubscribeViaToken, unsubscribeTypes } = useEmailConsent();
  const { user } = useAuth();
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'form'>('loading');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleTokenUnsubscribe = async () => {
    if (!token) return;

    try {
      await unsubscribeViaToken(token);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (token) {
      handleTokenUnsubscribe();
    } else {
      setStatus('form');
    }
  }, [token]);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  const handleManualUnsubscribe = async () => {
    if (selectedTypes.length === 0 || isSubmitting) return;

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setFormError("Enter the email address you subscribed with.");
      return;
    }
    if (!user) {
      setFormError("Please sign in, or use the unsubscribe link in an email from us.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    try {
      const updated = await unsubscribeTypes(normalizedEmail, selectedTypes);
      if (updated) {
        setStatus('success');
      } else {
        setFormError("Your preferences could not be updated. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const subscriptionTypes = [
    {
      id: 'marketing',
      name: 'Marketing Emails',
      description: 'Product updates, new features, and company news',
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Weekly digest of travel tips and destination guides',
    },
    {
      id: 'promotional',
      name: 'Promotional Offers',
      description: 'Special discounts and limited-time offers',
    },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Processing your request...</p>
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
            <CardTitle>Successfully Unsubscribed</CardTitle>
            <CardDescription>
              You have been removed from our email list. You will no longer receive these emails.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Changed your mind? You can always re-subscribe from your account settings.</p>
            </div>
            <Button
              className="w-full"
              onClick={() => router.push('/')}
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Unsubscribe Failed</CardTitle>
            <CardDescription>
              The unsubscribe link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push('/contact')}
            >
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Manage Email Subscriptions</CardTitle>
                <CardDescription>
                  Choose which emails you&apos;d like to receive from us
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="unsubscribe-email">Email address</Label>
              <Input
                id="unsubscribe-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <p className="text-xs text-muted-foreground">
                We only update preferences for this address. Signed-in users can update their own subscriptions.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Email Preferences</h3>
              <p className="text-sm text-muted-foreground">
                You can unsubscribe from specific types of emails while keeping others.
                Transactional emails (like booking confirmations) cannot be disabled as they are required for service functionality.
              </p>

              <div className="space-y-4">
                {subscriptionTypes.map((type) => (
                  <div key={type.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox
                      id={type.id}
                      checked={selectedTypes.includes(type.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTypes([...selectedTypes, type.id]);
                        } else {
                          setSelectedTypes(selectedTypes.filter(t => t !== type.id));
                        }
                      }}
                    />
                    <div className="flex-1">
                      <label htmlFor={type.id} className="font-medium cursor-pointer">
                        {type.name}
                      </label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex items-start space-x-3 p-4 border rounded-lg bg-gray-50">
                  <Checkbox disabled checked />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Transactional Emails</span>
                      <Badge variant="outline">
                        <Shield className="h-3 w-3 mr-1" />
                        Required
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Essential emails like booking confirmations, password resets, and account notifications
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {formError && (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="destructive"
                disabled={selectedTypes.length === 0 || isSubmitting}
                className="flex-1"
                onClick={handleManualUnsubscribe}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Unsubscribe Selected ({selectedTypes.length})
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push('/')}
              >
                Keep All Subscriptions
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-4 border-t">
              <p>
                This action is in compliance with KVKK/GDPR regulations.
                Your consent preferences are stored securely and can be changed at any time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
