"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, RefreshCw, Save, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/hooks/use-language";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { translations } = useLanguage();

  const generatePassword = useCallback(() => {
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charPool = lowerCaseChars;
    if (includeUppercase) charPool += upperCaseChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;

    if (charPool.length === 0) {
      setPassword("");
      return;
    }

    let newPassword = "";
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        const randomIndex = randomValues[i] % charPool.length;
        newPassword += charPool[randomIndex];
    }

    setPassword(newPassword);
    setIsCopied(false);
  }, [length, includeUppercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setIsCopied(true);
    toast({
      title: translations.toasts.copied,
      description: translations.toasts.password.copiedDesc,
    });
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleSavePassword = async () => {
    if (!user || !password) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/passwords`), {
        password: password,
        length: length,
        includeUppercase: includeUppercase,
        includeNumbers: includeNumbers,
        includeSymbols: includeSymbols,
        createdAt: serverTimestamp(),
      });
      toast({
        title: translations.toasts.success,
        description: translations.toasts.password.saveSuccess,
      });
    } catch (error) {
      console.error("Failed to save password:", error);
      toast({
        variant: "destructive",
        title: translations.toasts.error,
        description: translations.toasts.password.saveError,
      });
    } finally {
      setIsSaving(false);
    }
  };


  const getStrength = () => {
    let strength = 0;
    if (length >= 12) strength++;
    if (length >= 16) strength++;
    if (includeUppercase) strength++;
    if (includeNumbers) strength++;
    if (includeSymbols) strength++;

    const strengthLabels = translations.password.strength;
    if (strength < 2) return { label: strengthLabels.weak, color: 'bg-red-500' };
    if (strength < 4) return { label: strengthLabels.medium, color: 'bg-yellow-500' };
    return { label: strengthLabels.strong, color: 'bg-green-500' };
  };

  const strength = getStrength();
  const strengthPercentage = (100 / 5) * (
    (length >= 16 ? 2 : length >= 12 ? 1 : 0) + 
    (includeUppercase ? 1 : 0) + 
    (includeNumbers ? 1 : 0) + 
    (includeSymbols ? 1 : 0)
  );


  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">{translations.password.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {translations.password.subtitle}
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="relative">
            <Input
              readOnly
              value={password}
              className="pr-12 h-14 text-xl font-mono tracking-wider"
              aria-label={translations.password.ariaLabel}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10"
              onClick={handleCopy}
            >
              {isCopied ? (
                <Check className="h-6 w-6 text-green-500" />
              ) : (
                <Copy className="h-6 w-6" />
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-full bg-muted rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${strength.color}`} style={{ width: `${strengthPercentage}%` }}></div>
            </div>
            <span className="text-sm font-medium">{strength.label}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="length" className="flex justify-between">
              <span>{translations.password.options.length}</span>
              <span className="font-bold text-primary">{length}</span>
            </Label>
            <Slider
              id="length"
              min={8}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={includeUppercase}
                onCheckedChange={(checked) => setIncludeUppercase(Boolean(checked))}
              />
              <Label htmlFor="uppercase" className="cursor-pointer">{translations.password.options.uppercase}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={(checked) => setIncludeNumbers(Boolean(checked))}
              />
              <Label htmlFor="numbers" className="cursor-pointer">{translations.password.options.numbers}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={(checked) => setIncludeSymbols(Boolean(checked))}
              />
              <Label htmlFor="symbols" className="cursor-pointer">{translations.password.options.symbols}</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={generatePassword} size="lg" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            {translations.password.buttons.generate}
          </Button>
          {user ? (
             <Button onClick={handleSavePassword} disabled={isSaving} size="lg" variant="outline" className="w-full">
                <Save className={`mr-2 h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
                {isSaving ? translations.password.buttons.saving : translations.password.buttons.save}
             </Button>
          ) : (
            <Button asChild size="lg" variant="outline" className="w-full">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  {translations.password.buttons.loginToSave}
                </Link>
             </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
