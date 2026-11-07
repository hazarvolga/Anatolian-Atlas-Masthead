"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function SignupForm() {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { success, error } = await signUp(
        signupForm.email,
        signupForm.password,
        signupForm.firstName,
        signupForm.lastName,
        signupForm.phone
      );

      if (!success) {
        toast({
          title: "Sign Up Failed",
          description: error || "An unexpected error occurred.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Your account has been created.",
        });
        router.push("/profile");
      }
    } catch {
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="First Name"
          value={signupForm.firstName}
          onChange={(e) =>
            setSignupForm({ ...signupForm, firstName: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder="Last Name"
          value={signupForm.lastName}
          onChange={(e) =>
            setSignupForm({ ...signupForm, lastName: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Input
          type="tel"
          placeholder="Phone (Optional)"
          value={signupForm.phone}
          onChange={(e) =>
            setSignupForm({ ...signupForm, phone: e.target.value })
          }
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={signupForm.email}
          onChange={(e) =>
            setSignupForm({ ...signupForm, email: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={signupForm.password}
          onChange={(e) =>
            setSignupForm({ ...signupForm, password: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Confirm Password"
          value={signupForm.confirmPassword}
          onChange={(e) =>
            setSignupForm({ ...signupForm, confirmPassword: e.target.value })
          }
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
}
