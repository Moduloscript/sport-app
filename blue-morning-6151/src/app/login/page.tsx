"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/auth-store";

const supabase = createClient();

export default function Login() {
  const formSchema = z.object({
    email: z.string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    rememberMe: z.boolean().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (rememberMe && watch('email')) {
      localStorage.setItem('rememberedEmail', watch('email'));
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  }, [rememberMe, watch('email')]);

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
    } catch (error: unknown) {
      const err = error as Error;
      setError("root", { message: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(data: FormValues) {
    setLoading(true);
    setMessage("");
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (error: unknown) {
      const err = error as Error;
      setError("root", { message: err.message });
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
    } catch (error: unknown) {
      const err = error as Error;
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome to Sports App</h1>
        {message && (
          <div className="p-3 rounded-md bg-red-50">
            <p className="text-sm text-red-700">{message}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Button
          onClick={() => handleOAuthSignIn("google")}
          className="w-full"
          variant="outline">
          Continue with Google
        </Button>
        <Button
          onClick={() => handleOAuthSignIn("github")}
          className="w-full"
          variant="outline">
          Continue with GitHub
        </Button>
      </div>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors">
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              id="rememberMe"
              type="checkbox"
              {...register("rememberMe")}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-gray-600"
            >
              Remember me
            </label>
          </div>
        </div>
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}
        <div className="space-y-2">
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full flex items-center justify-center gap-2">
            {isSubmitting && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(handleSignUp)}
            disabled={isSubmitting || loading}
            className="w-full"
            variant="outline">
            Create Account
          </Button>
        </div>
      </form>
    </div>
  );
}
