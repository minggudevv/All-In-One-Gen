"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
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
import { correctLocation as correctLocationFlow } from "@/ai/flows/correct-location-flow";
import { useLanguage } from "@/hooks/use-language";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { translations } = useLanguage();

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
        toast({ variant: "destructive", title: translations.toasts.error, description: translations.toasts.dashboard.fetchIdentitiesError });
      }),
      onSnapshot(query(collection(db, `users/${user.uid}/emails`), orderBy("createdAt", "desc")), (snapshot) => {
        setEmails(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredEmail)));
      }, (error) => {
        console.error("Error fetching emails:", error);
        toast({ variant: "destructive", title: translations.toasts.error, description: translations.toasts.dashboard.fetchEmailsError });
      }),
      onSnapshot(query(collection(db, `users/${user.uid}/passwords`), orderBy("createdAt", "desc")), (snapshot) => {
        setPasswords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoredPassword)));
      }, (error) => {
        console.error("Error fetching passwords:", error);
        toast({ variant: "destructive", title: translations.toasts.error, description: translations.toasts.dashboard.fetchPasswordsError });
      })
    ];
    
    return () => unsubscribers.forEach(unsub => unsub());
  }, [user, authLoading, router, toast, translations]);

  const deleteItem = useCallback(async (collectionName: string, id: string) => {
    if (!user || !id) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/${collectionName}`, id));
      toast({
        title: translations.toasts.success,
        description: translations.toasts.dashboard.deleteSuccess
      })
    } catch (error) {
      console.error(`Error deleting item from ${collectionName}:`, error);
      toast({
        variant: "destructive",
        title: translations.toasts.error,
        description: translations.toasts.dashboard.deleteError
      })
    }
  }, [user, toast, translations]);

  const correctIdentityLocation = useCallback(async (identity: Identity) => {
    if (!user || !identity.id) return;
    
    toast({ title: translations.toasts.dashboard.correctingLocationTitle, description: translations.toasts.dashboard.correctingLocationDesc });
    
    try {
        const fullAddress = `${identity.location.street.number} ${identity.location.street.name}, ${identity.location.city}, ${identity.location.state} ${identity.location.postcode}, ${identity.location.country}`;
        const result = await correctLocationFlow({ address: fullAddress });

        const identityRef = doc(db, `users/${user.uid}/identities`, identity.id);
        await updateDoc(identityRef, {
            "location.coordinates.latitude": result.latitude,
            "location.coordinates.longitude": result.longitude,
        });

        toast({
            title: translations.toasts.success,
            description: translations.toasts.dashboard.correctLocationSuccess,
        });

    } catch (error) {
        console.error("Failed to correct location:", error);
        toast({
            variant: "destructive",
            title: translations.toasts.error,
            description: translations.toasts.dashboard.correctLocationError,
        });
    }
  }, [user, toast, translations]);


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
          <h1 className="font-headline text-4xl font-bold tracking-tight">{translations.dashboard.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {translations.dashboard.subtitle}
          </p>
        </div>
      </div>
      <Tabs defaultValue="identities">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="identities">{translations.dashboard.tabs.identities} ({identities.length})</TabsTrigger>
            <TabsTrigger value="emails">{translations.dashboard.tabs.emails} ({emails.length})</TabsTrigger>
            <TabsTrigger value="passwords">{translations.dashboard.tabs.passwords} ({passwords.length})</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
             <Button asChild variant="outline">
                <Link href="/generator/identity">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {translations.dashboard.buttons.addIdentity}
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/generator/email">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {translations.dashboard.buttons.addEmail}
                </Link>
            </Button>
            <Button asChild variant="outline">
                <Link href="/generator/password">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {translations.dashboard.buttons.addPassword}
                </Link>
            </Button>
          </div>
        </div>

        <TabsContent value="identities">
          {identities.length > 0 ? (
            <DataTable columns={identityColumns({ deleteIdentity, correctIdentityLocation, translations })} data={identities} filterColumn="name" filterPlaceholder={translations.dashboard.filter.name} noResultsText={translations.dashboard.noResults} />
          ) : (
            <EmptyState 
                title={translations.dashboard.empty.identities.title}
                description={translations.dashboard.empty.identities.description}
                cta={translations.dashboard.empty.identities.cta}
                href="/generator/identity" />
          )}
        </TabsContent>
        <TabsContent value="emails">
          {emails.length > 0 ? (
            <DataTable columns={emailColumns({ deleteEmail, translations })} data={emails} filterColumn="email" filterPlaceholder={translations.dashboard.filter.email} noResultsText={translations.dashboard.noResults} />
          ) : (
             <EmptyState 
                title={translations.dashboard.empty.emails.title}
                description={translations.dashboard.empty.emails.description}
                cta={translations.dashboard.empty.emails.cta}
                href="/generator/email" />
          )}
        </TabsContent>
        <TabsContent value="passwords">
          {passwords.length > 0 ? (
            <DataTable columns={passwordColumns({ deletePassword, translations })} data={passwords} filterColumn="password" filterPlaceholder={translations.dashboard.filter.password} noResultsText={translations.dashboard.noResults} />
          ) : (
            <EmptyState
                title={translations.dashboard.empty.passwords.title}
                description={translations.dashboard.empty.passwords.description}
                cta={translations.dashboard.empty.passwords.cta}
                href="/generator/password" />
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
