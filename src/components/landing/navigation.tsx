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
    <header
      className={
        "bg-background border-b px-4 lg:px-6 h-16 flex items-center justify-between fixed top-0 w-full z-50 shadow-sm text-sm"
      }
    >
      <Link href="/" className="flex gap-2 items-center">
        <Logo />
        <span className="font-semibold text-xl">NotedAI</span>
      </Link>

      <div className="flex gap-4 items-center">
        {user.current ? (
          <>
            <Link
              href="/dashboard"
              className={`
             transition-all duration-300 ease-in-out
            relative overflow-hidden group
            
          `}
            >
              <span className="relative z-10">Dashboard</span>
              <span
                className="absolute bottom-0 left-0 w-full h-[0.08rem] bg-foreground 
              transform -translate-x-full group-hover:translate-x-0 
              transition-transform duration-300 ease-in-out"
              />
            </Link>
            <div
              className={`
            transition-all duration-300 ease-in-out
            relative overflow-hidden group hover:cursor-pointer
           
          `}
              onClick={handleSignOut}
            >
              {loading ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">Sign Out</span>
                  <span
                    className="absolute bottom-0 left-0 w-full h-[0.08rem] bg-foreground 
                  transform -translate-x-full group-hover:translate-x-0 
                  transition-transform duration-300 ease-in-out"
                  />
                </>
              )}
            </div>
          </>
        ) : (
          <Link
            href="/signin"
            className={`
            font-medium transition-all duration-300 ease-in-out
            relative overflow-hidden group hover:cursor-pointer
          
          `}
          >
            <span className="relative z-10">Sign In</span>
            <span
              className="absolute bottom-0 left-0 w-full h-[0.08rem] bg-foreground 
            transform -translate-x-full group-hover:translate-x-0 
            transition-transform duration-300 ease-in-out"
            />
          </Link>
        )}
        <ThemeMode />
      </div>
    </header>
  );
}
