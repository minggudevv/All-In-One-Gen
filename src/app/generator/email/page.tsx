"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, Check } from "lucide-react";

const firstNames = ["john", "jane", "alex", "emily", "michael", "sarah", "david", "lisa"];
const lastNames = ["smith", "doe", "jones", "williams", "brown", "davis", "miller", "wilson"];
const domains = ["gmail.com", "yahoo.com", "outlook.com", "mail.com", "proton.me", "icloud.com"];

export default function EmailGeneratorPage() {
  const [emails, setEmails] = useState<string[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const { toast } = useToast();

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
              <li key={index} className="flex items-center justify-between py-4">
                <span className="font-mono text-sm md:text-base text-muted-foreground">{email}</span>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(email)}>
                  {copiedEmail === email ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                  <span className="sr-only">Copy email</span>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
