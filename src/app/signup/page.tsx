"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {auth} from "@/lib/firebase";
import { useLanguage } from "@/hooks/use-language";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters." }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the Terms of Service and Privacy Policy.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], 
});

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { toast } = useToast();
  const { translations } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signup({ email: values.email, password: values.password, username: values.username });
      const currentUser = auth.currentUser;

      if (currentUser) {
        await setDoc(doc(db, "users", currentUser.uid), {
          uid: currentUser.uid,
          email: values.email,
          username: values.username,
          createdAt: new Date().toISOString(),
        });
      }
      toast({
        title: translations.toasts.signupSuccess.title,
        description: translations.toasts.signupSuccess.description,
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: translations.toasts.signupFailed.title,
        description: error.message || translations.toasts.signupFailed.description,
      });
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center mb-4">
             <Zap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">{translations.signup.title}</CardTitle>
          <CardDescription>{translations.signup.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.signup.form.email}</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.signup.form.username}</FormLabel>
                    <FormControl>
                      <Input placeholder="yourusername" {...field} />
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
                    <FormLabel>{translations.signup.form.password}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.signup.form.confirmPassword}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {translations.signup.form.terms.start}{" "}
                        <Link href="/terms" className="underline text-primary">
                          {translations.signup.form.terms.termsLink}
                        </Link>{" "}
                        {translations.signup.form.terms.and}{" "}
                        <Link href="/privacy" className="underline text-primary">
                          {translations.signup.form.terms.privacyLink}
                        </Link>
                        .
                      </FormLabel>
                      <FormDescription>
                        {translations.signup.form.terms.description}
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? translations.signup.buttons.creating : translations.signup.buttons.signup}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            {translations.signup.loginPrompt.message}{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              {translations.signup.loginPrompt.link}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
