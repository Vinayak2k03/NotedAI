import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import Navigation from "@/components/landing/navigation";
import { ThemeProvider } from "@/components/context/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NotedAI",
  description: "AI-powered note-taking application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CopilotKit runtimeUrl="/api/copilotkit">
            <Navigation />
            {children}
            <CopilotPopup
              labels={{
                title: "NotedAI",
                initial:
                  "Hello! I'm your NotedAI assistant. How can I help you today?",
              }}
            />
          </CopilotKit>
        </ThemeProvider>
      </body>
    </html>
  );
}
