"use client"

import { ThemeMode } from "../theme-mode-util";
import Link from "next/link";
import Logo from "../../../public/Logo";
import { useUser } from "../context/auth-provider";
import { useState } from "react";
import { Icons } from "../ui/icons";

export default function Navigation() {
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await user.logout();
    setLoading(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-neutral-200/20 dark:border-neutral-800/30">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <div className="bg-primary/10 dark:bg-primary/20 p-1.5 rounded-md">
            <Logo className="size-5 text-primary" />
          </div>
          <span className="font-semibold text-xl tracking-tight">NotedAI</span>
        </Link>

        <div className="flex items-center gap-6">
          {user.current ? (
            <>
              <Link
                href="/dashboard"
                className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all"
              >
                Dashboard
              </Link>
              
              <button
                onClick={handleSignOut}
                className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-destructive after:transition-all"
                disabled={loading}
              >
                {loading ? (
                  <Icons.spinner className="size-4 animate-spin" />
                ) : (
                  "Sign Out"
                )}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/signin"
                className="text-sm font-medium px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
          <div className="border-l border-neutral-200/20 dark:border-neutral-800/30 h-8 mx-1"></div>
          <ThemeMode />
        </div>
      </div>
    </header>
  );
}