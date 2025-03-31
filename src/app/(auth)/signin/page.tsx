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
    <div className="container grid grid-cols-2">
      <div className="min-h-screen bg-zinc-900">
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
            NotedAI
          </h2>
          <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
            A note-taking app that uses AI to help you write and organize your
            notes.
            <br />
          </p>
        </BackgroundLines>
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm sm:max-w-md px-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Welcome Back!</CardTitle>
              <CardDescription>
                Please sign in to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                  />
                  <Button
                    disabled={loading}
                    variant={'default'}
                    className="w-full mt-4"
                  >
                    {loading && (
                      <Icons.spinner className="size-3 mr-2 animate-spin" />
                    )}
                    Continue
                  </Button>
                </div>
              </form>
              <p className="flex my-4 items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                or
              </p>
              <Button
                disabled={loading}
                variant={"outline"}
                className="w-full flex items-center"
                onClick={() => {
                  setLoading(true);
                  user.loginWithGoogle();
                }}
              >
                <Icons.google className="mr-2 size-3" />
                Sign up with Google
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="px-8 text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </Link>
                .
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
