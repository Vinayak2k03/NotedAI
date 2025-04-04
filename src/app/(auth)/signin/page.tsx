"use client";

import { useUser } from "@/components/context/auth-provider";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      setLoading(true);
      await user.login(email, password);
    } catch (err) {
      setLoading(false);
      toast("There was an error...", {
        description: (err as Error).message,
      });
    }
  };

  useEffect(() => {
    if (user.current) {
      toast("Welcome back!", {
        description: "You are already logged in.",
      });
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen w-full flex lg:grid lg:grid-cols-2">
      {/* Left side - Branding (only visible on large screens) */}
      <div className="hidden lg:flex relative bg-zinc-900 overflow-hidden">
        <BackgroundLines className="flex items-center justify-center w-full h-full flex-col px-6">
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 text-5xl xl:text-7xl font-sans font-bold tracking-tight">
              NotedAI
            </h2>
            <p className="mt-4 text-base xl:text-lg text-neutral-400 max-w-md mx-auto">
              A note-taking app that uses AI to help you write and organize your notes.
            </p>
            
            {/* Feature highlights - only visible on large screens */}
            <div className="flex flex-col items-center mt-12 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Icons.fileText className="h-5 w-5" />
                </div>
                <span className="text-neutral-300">Intelligent note-taking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Icons.users className="h-5 w-5" />
                </div>
                <span className="text-neutral-300">Meeting management</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Icons.calendarIcon className="h-5 w-5" />
                </div>
                <span className="text-neutral-300">AI-powered summaries</span>
              </div>
            </div>
          </div>
        </BackgroundLines>
      </div>

      {/* Right side - Sign-in form (takes full width on small screens) */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 w-full bg-gradient-to-b from-background to-background/90">
        <div className="w-full max-w-md mx-auto">
          {/* Small branding for mobile - only visible on small screens */}
          <div className="flex items-center justify-center mb-8 lg:hidden">
            <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-600 to-neutral-900 dark:from-neutral-200 dark:to-neutral-600 text-3xl font-sans font-bold tracking-tight">
              NotedAI
            </h2>
          </div>
          
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center lg:text-left">Sign In</h1>
            <p className="text-muted-foreground text-center lg:text-left">Enter your credentials to access your account</p>
          </div>
          
          <Card className="w-full shadow-lg border-neutral-200/20 dark:border-neutral-800/50">
            <CardContent className="pt-6">
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-11"
                    autoComplete="email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11"
                    autoComplete="current-password"
                    required
                  />
                </div>
                
                <Button
                  disabled={loading}
                  variant="default"
                  className="w-full h-11 mt-2 font-medium"
                  type="submit"
                >
                  {loading ? (
                    <>
                      <Icons.spinner className="size-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200/20 dark:border-neutral-800/50"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <Button
                disabled={loading}
                variant="outline"
                className="w-full h-11 font-medium"
                onClick={() => {
                  setLoading(true);
                  user.loginWithGoogle();
                }}
              >
                <Icons.google className="mr-2 size-4" />
                Google
              </Button>
            </CardContent>
          </Card>
          
          {/* Sign up link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              href="/signup"
              className="font-semibold text-primary hover:text-primary/90 underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}