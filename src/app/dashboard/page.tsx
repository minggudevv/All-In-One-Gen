"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import type { Identity } from "@/types";
import { columns } from "@/components/dashboard/columns";
import { DataTable } from "@/components/dashboard/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        const q = query(collection(db, `users/${user.uid}/identities`), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const identitiesData: Identity[] = [];
          querySnapshot.forEach((doc) => {
            identitiesData.push({ id: doc.id, ...doc.data() } as Identity);
          });
          setIdentities(identitiesData);
          setLoading(false);
        }, (error) => {
            console.error("Error fetching identities:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not fetch saved identities."
            })
            setLoading(false);
        });

        return () => unsubscribe();
      }
    }
  }, [user, authLoading, router, toast]);
  
  const deleteIdentity = useCallback(async (id: string) => {
    if (!user || !id) return;
    try {
        await deleteDoc(doc(db, `users/${user.uid}/identities`, id));
        toast({
            title: "Success",
            description: "Identity deleted successfully."
        })
    } catch (error) {
        console.error("Error deleting identity:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete identity."
        })
    }
  }, [user, toast]);

  if (authLoading || loading) {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-8 w-2/4" />
                <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                        <Skeleton className="h-8 w-1/3" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your saved identities here.
          </p>
        </div>
        <Button asChild>
            <Link href="/generator/identity">
                <PlusCircle className="mr-2 h-4 w-4" />
                Generate New Identity
            </Link>
        </Button>
      </div>

      {identities.length > 0 ? (
        <DataTable columns={columns({ deleteIdentity })} data={identities} />
      ) : (
        <Card className="text-center py-20">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">No Identities Saved</CardTitle>
                <CardDescription>You haven't saved any identities yet. Start by generating one!</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/generator/identity">
                        Generate an Identity
                    </Link>
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
