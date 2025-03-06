"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const { 
    user,
    isEmailVerified,
    emailVerificationSent,
    lastVerificationCheck,
    checkEmailVerification,
    resendVerificationEmail
  } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try {
      const { success, error } = await resendVerificationEmail();
      if (success) {
        setSuccess(true);
      } else if (error) {
        setError(error);
      }
    } catch (err) {
      setError("Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkVerification = async () => {
      try {
        await checkEmailVerification();
      } catch (err) {
        console.error("Failed to check verification status:", err);
      }
    };

    // Check verification status every 5 seconds
    const interval = setInterval(checkVerification, 5000);
    return () => clearInterval(interval);
  }, [checkEmailVerification]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to verify your email address.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEmailVerified) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Email Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your email address has been successfully verified.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification email to {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          {success && (
            <div className="text-green-500 text-sm">
              Verification email resent successfully
            </div>
          )}
          
          <Button 
            onClick={handleResend}
            disabled={loading || emailVerificationSent}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {emailVerificationSent ? "Email Sent" : "Resend Verification Email"}
          </Button>

          <div className="text-sm text-muted-foreground">
            Last checked: {lastVerificationCheck ? 
              new Date(lastVerificationCheck).toLocaleString() : 
              "Never"
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
