"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from "@/stores/auth-store";

const supabase = createClient();

export default function Login() {
  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { login } = useAuthStore();
  const router = useRouter();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function handleSignUp(data: FormValues) {
    setLoading(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) {
        setError("root", { message: error.message });
      } else {
        setMessage("Check your email for a confirmation link.");
      }
    } catch (error: any) {
      setError("root", { message: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(data: FormValues) {
    setLoading(true);
    setMessage("");
    try {
      await login(data.email, data.password);
      router.push('/');
    } catch (error: any) {
      setError("root", { message: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuthSignIn(provider: "google" | "github") {
    setLoading(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) {
        setMessage(error.message);
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome to Sports App</h1>
        {message && <p className="text-sm text-red-500">{message}</p>}
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={() => handleOAuthSignIn("google")}
          className="w-full"
          variant="outline"
        >
          Continue with Google
        </Button>
        <Button 
          onClick={() => handleOAuthSignIn("github")}
          className="w-full"
          variant="outline"
        >
          Continue with GitHub
        </Button>
      </div>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form 
        onSubmit={handleSubmit(handleSignIn)}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}
        <div className="space-y-2">
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit(handleSignUp)}
            disabled={isSubmitting}
            className="w-full"
            variant="outline"
          >
            Create Account
          </Button>
        </div>
      </form>
    </div>
  );
}
