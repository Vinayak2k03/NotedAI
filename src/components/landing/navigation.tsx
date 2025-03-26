import { ThemeMode } from "../theme-mode-util";
import Link from "next/link";

export default function Navigation() {
  return (
    <header
      className={
        "bg-background border-b px-4 lg:px-6 h-16 flex items-center justify-between fixed top-0 w-full z-0 shadow-sm "
      }
    >
      <Link href="/" className="flex gap-2 items-center">
        <img src={"/logo.svg"} alt="logo" className="h-8 w-8 dark:invert" />
        <span className="font-semibold text-xl">NotedAI</span>
      </Link>

      <div className='flex gap-2 items-center'>
        <Link href="/dashboard">
          <span>Dashboard</span>
        </Link>
        <ThemeMode />
      </div>
    </header>
  );
}
