
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  const getCurrentTab = () => {
    if (pathname.startsWith('/dashboard/credentials')) {
      return 'credentials';
    }
    return 'dashboard';
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {getCurrentTab() === 'dashboard' ? 'Manage your saved generated data.' : 'Save and manage your sensitive logins securely.'}
          </p>
        </div>
      </div>
      <Tabs value={getCurrentTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="dashboard" asChild>
             <Link href="/dashboard">Saved Generations</Link>
          </TabsTrigger>
          <TabsTrigger value="credentials" asChild>
            <Link href="/dashboard/credentials">Credential Manager</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
