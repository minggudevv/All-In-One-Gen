"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import type { Identity, StoredEmail, StoredPassword } from "@/types";
import { columns as identityColumns } from "@/components/dashboard/columns-identity";
import { columns as emailColumns } from "@/components/dashboard/columns-email";
import { columns as passwordColumns } from "@/components/dashboard/columns-password";
import { DataTable } from "@/components/dashboard/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [identities, setIdentities] = useState<Identity[]>([]);
  const [emails, setEmails] = useState<StoredEmail[]>([]);
  const [passwords, setPasswords] = useState<StoredPassword[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const unsubscribers = [
      onSnapshot(query(collection(db, `users/${user.uid}/identities`), orderBy("createdAt", "desc")), (snapshot) => {
        setIdentities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Identity)));
        setLoading(false);
      }, (error) => {
        console.error("Error fetching identities:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch saved identities." });
      }),
      onSnapshot(query(collection(db, `users/${user.uid}/emails`), orderBy("createdAt", "desc")), (snapshot) => {
        setEmails(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredEmail)));
      }, (error) => {
        console.error("Error fetching emails:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch saved emails." });
      }),
      onSnapshot(query(collection(db, `users/${user.uid}/passwords`), orderBy("createdAt", "desc")), (snapshot) => {
        setPasswords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredPassword)));
      }, (error) => {
        console.error("Error fetching passwords:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch saved passwords." });
      })
    ];
    
    return () => unsubscribers.forEach(unsub => unsub());
  }, [user, authLoading, router, toast]);

  const deleteItem = useCallback(async (collectionName: string, id: string) => {
    if (!user || !id) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/${collectionName}`, id));
      toast({
        title: "Success",
        description: "Item deleted successfully."
      })
    } catch (error) {
      console.error(`Error deleting item from ${collectionName}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete item."
      })
    }
  }, [user, toast]);

  const deleteIdentity = (id: string) => deleteItem("identities", id);
  const deleteEmail = (id: string) => deleteItem("emails", id);
  const deletePassword = (id: string) => deleteItem("passwords", id);


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
            Manage your saved identities, emails, and passwords here.
          </p>
        </div>
      </div>
      <Tabs defaultValue="identities">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="identities">Identities ({identities.length})</TabsTrigger>
            <TabsTrigger value="emails">Emails ({emails.length})</TabsTrigger>
            <TabsTrigger value="passwords">Passwords ({passwords.length})</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
             <Button asChild variant="outline">
                <Link href="/generator/identity">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Identity
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/generator/email">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Email
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/generator/password">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Password
                </Link>
            </Button>
          </div>
        </div>

        <TabsContent value="identities">
          {identities.length > 0 ? (
            <DataTable columns={identityColumns({ deleteIdentity })} data={identities} filterColumn="name" filterPlaceholder="Filter by name..." />
          ) : (
            <EmptyState title="No Identities Saved" description="You haven't saved any identities yet. Start by generating one!" cta="Generate an Identity" href="/generator/identity" />
          )}
        </TabsContent>
        <TabsContent value="emails">
          {emails.length > 0 ? (
            <DataTable columns={emailColumns({ deleteEmail })} data={emails} filterColumn="email" filterPlaceholder="Filter by email..." />
          ) : (
             <EmptyState title="No Emails Saved" description="You haven't saved any emails yet. Start by generating some!" cta="Generate Emails" href="/generator/email" />
          )}
        </TabsContent>
        <TabsContent value="passwords">
          {passwords.length > 0 ? (
            <DataTable columns={passwordColumns({ deletePassword })} data={passwords} filterColumn="password" filterPlaceholder="Filter by password..." />
          ) : (
            <EmptyState title="No Passwords Saved" description="You haven't saved any passwords yet. Start by generating one!" cta="Generate a Password" href="/generator/password" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

const EmptyState = ({title, description, cta, href}: {title: string, description: string, cta: string, href: string}) => (
    <Card className="text-center py-20">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild>
                <Link href={href}>
                    {cta}
                </Link>
            </Button>
        </CardContent>
    </Card>
)
