"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";

export default function BookingCancelClient() {
  const router = useRouter();

  return (
    <div className="pt-20">
      <section className="section">
        <div className="px-4 md:px-6 lg:px-8 mx-auto">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-red-600">Payment Cancelled</CardTitle>
                <CardDescription>
                  Your reservation was not confirmed. No charges were made to
                  your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">What happened?</h3>
                    <p className="text-sm text-muted-foreground">
                      You cancelled the payment process before it was completed.
                      Your reservation was not confirmed and no payment was
                      processed.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => router.push("/tours")}
                      className="w-full"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Browse Tours
                    </Button>
                    <Button
                      onClick={() => router.push("/")}
                      variant="outline"
                      className="w-full"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Home
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
