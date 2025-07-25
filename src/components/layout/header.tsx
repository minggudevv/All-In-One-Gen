"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, Zap, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { language, setLanguage, translations } = useLanguage();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: translations.toasts.logoutSuccess.title,
        description: translations.toasts.logoutSuccess.description,
      });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: translations.toasts.logoutFailed.title,
        description: translations.toasts.logoutFailed.description,
      });
    }
  };

  const navLinks = [
    { href: "/generator/identity", label: translations.header.identity },
    { href: "/generator/email", label: translations.header.email },
    { href: "/generator/password", label: translations.header.password },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center md:mr-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="flex items-center">
                <Zap className="h-6 w-6 text-primary" />
                <span className="ml-2 font-bold font-headline">AllInOneGen</span>
              </Link>
              <div className="flex flex-col space-y-4 mt-6">
                {navLinks.map(link => (
                  <SheetClose asChild key={link.href}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              AllInOneGen
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end space-x-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")} disabled={language === "en"}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("id")} disabled={language === "id"}>
                Indonesia
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard">{translations.header.dashboard}</Link>
              </Button>
              <Button onClick={handleLogout}>{translations.header.logout}</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">{translations.header.login}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{translations.header.signup}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
