"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, Check, Save, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

const firstNames = ["john", "jane", "alex", "emily", "michael", "sarah", "david", "lisa"];
const lastNames = ["smith", "doe", "jones", "williams", "brown", "davis", "miller", "wilson"];
const domains = ["gmail.com", "yahoo.com", "outlook.com", "mail.com", "proton.me", "icloud.com"];

export default function EmailGeneratorPage() {
  const [emails, setEmails] = useState<string[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const generateEmails = useCallback(() => {
    const newEmails = Array.from({ length: 8 }, () => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const number = Math.floor(100 + Math.random() * 900);
      const domain = domains[Math.floor(Math.random() * domains.length)];
      return `${firstName}.${lastName}${number}@${domain}`;
    });
    setEmails(newEmails);
  }, []);

  useEffect(() => {
    generateEmails();
  }, [generateEmails]);

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    toast({
      title: "Copied!",
      description: `${email} has been copied to your clipboard.`,
    });
    setTimeout(() => setCopiedEmail(null), 2000);
  };
  
  const handleSaveEmail = async (email: string) => {
    if (!user) return;
    setIsSaving(email);
    try {
      await addDoc(collection(db, `users/${user.uid}/emails`), {
        email: email,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Success!",
        description: `${email} saved to your dashboard.`,
      });
    } catch (error) {
      console.error("Failed to save email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save email. Please try again.",
      });
    } finally {
      setIsSaving(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">Fake Email Generator</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Instantly generate random, disposable email addresses.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Generated Emails</CardTitle>
          <Button onClick={generateEmails} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {emails.map((email, index) => (
              <li key={index} className="flex items-center justify-between py-3">
                <span className="font-mono text-sm md:text-base text-muted-foreground break-all pr-4">{email}</span>
                <div className="flex items-center gap-1">
                  {user && (
                    <Button variant="ghost" size="icon" onClick={() => handleSaveEmail(email)} disabled={isSaving === email}>
                      {isSaving === email ? <Save className="h-5 w-5 animate-pulse" /> : <Save className="h-5 w-5" />}
                       <span className="sr-only">Save email</span>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(email)}>
                    {copiedEmail === email ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                    <span className="sr-only">Copy email</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
        {!user && (
            <CardFooter>
                 <p className="text-sm text-muted-foreground mx-auto">
                    <Link href="/login" className="underline font-semibold">Log in</Link> to save emails to your dashboard.
                 </p>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
