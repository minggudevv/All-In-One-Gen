
"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { encryptData, decryptData } from "@/lib/crypto";
import type { StoredCredential } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  PlusCircle,
  Eye,
  EyeOff,
  Trash2,
  Copy,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

const formSchema = z.object({
  service: z.string().min(2, "Service name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

export default function CredentialsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<StoredCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [decryptedPasswords, setDecryptedPasswords] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: "",
      email: "",
      password: "",
    },
  });
  
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/credentials`),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCredentials(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as StoredCredential))
      );
      setLoading(false);
    }, (error) => {
        console.error("Error fetching credentials:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch credentials." });
    });

    return () => unsubscribe();
  }, [user, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    setIsSubmitting(true);

    const encrypted = await encryptData(values.password);
    if (!encrypted) {
      toast({
        variant: "destructive",
        title: "Encryption Error",
        description: "Could not encrypt data. Please try again.",
      });
       setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, `users/${user.uid}/credentials`), {
        service: values.service,
        email: values.email,
        encryptedData: encrypted.encryptedData,
        iv: encrypted.iv,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Success",
        description: "Credential saved securely.",
      });
      form.reset();
    } catch (error) {
      console.error("Failed to save credential:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save credential.",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = async (credential: StoredCredential) => {
    if (!credential.id) return;

    // If password is already decrypted and visible, hide it.
    if (decryptedPasswords[credential.id]) {
      setDecryptedPasswords((prev) => {
        const newState = { ...prev };
        delete newState[credential.id!];
        return newState;
      });
      return;
    }
    
    // Decrypt and show the password.
    const decrypted = await decryptData(credential.encryptedData, credential.iv);
    if (decrypted) {
      setDecryptedPasswords((prev) => ({
        ...prev,
        [credential.id!]: decrypted,
      }));
    } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to decrypt password." });
    }
  };
  
  const deleteCredential = async (id: string) => {
    if(!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/credentials`, id));
    toast({ title: "Success", description: "Credential deleted."});
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Password copied to clipboard." });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Credential Manager
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">
            Save and manage your sensitive logins securely.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Credential</CardTitle>
              <CardDescription>
                Your password will be encrypted before it's saved.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Google, GitHub" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email or Username</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                     <PlusCircle className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Saving...' : 'Save Securely'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>

        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Saved Credentials</CardTitle>
                    <CardDescription>You have {credentials.length} credential(s) saved.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead>Email/Username</TableHead>
                                <TableHead>Password</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell>
                                </TableRow>
                            ) : credentials.length > 0 ? (
                                credentials.map((cred) => (
                                <TableRow key={cred.id}>
                                    <TableCell className="font-medium">{cred.service}</TableCell>
                                    <TableCell>{cred.email}</TableCell>
                                    <TableCell className="font-mono">
                                        {decryptedPasswords[cred.id!] ? decryptedPasswords[cred.id!] : '••••••••••••'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <AlertDialog>
                                            <div className="flex justify-end items-center gap-1">
                                                {decryptedPasswords[cred.id!] && (
                                                     <Button variant="ghost" size="icon" onClick={() => copyToClipboard(decryptedPasswords[cred.id!])}>
                                                        <Copy className="h-4 w-4"/>
                                                        <span className="sr-only">Copy Password</span>
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" onClick={() => togglePasswordVisibility(cred)}>
                                                    {decryptedPasswords[cred.id!] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    <span className="sr-only">Toggle Password Visibility</span>
                                                </Button>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                        <span className="sr-only">Delete Credential</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                            </div>
                                             <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete the credential for {cred.service}. This action cannot be undone.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteCredential(cred.id!)} className="bg-destructive hover:bg-destructive/90">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">No credentials saved yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
