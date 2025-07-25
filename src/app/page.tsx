"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, UserSquare, Mail, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';

export default function Home() {
  const { translations } = useLanguage();
  const generatorFeatures = [
    {
      title: translations.home.identityGenerator,
      description: translations.home.identityGeneratorDesc,
      href: '/generator/identity',
      icon: <UserSquare className="h-10 w-10 text-primary" />,
    },
    {
      title: translations.home.emailGenerator,
      description: translations.home.emailGeneratorDesc,
      href: '/generator/email',
      icon: <Mail className="h-10 w-10 text-primary" />,
    },
    {
      title: translations.home.passwordGenerator,
      description: translations.home.passwordGeneratorDesc,
      href: '/generator/password',
      icon: <LockKeyhole className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <div className="w-full">
      <section className="container mx-auto flex flex-col items-center justify-center space-y-8 px-4 py-24 text-center sm:py-32">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          {translations.home.title}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
          {translations.home.subtitle}
        </p>
        <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/generator/identity">
              {translations.home.getStarted} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-muted/50 py-16 sm:py-24">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {generatorFeatures.map((feature) => (
              <Link href={feature.href} key={feature.title} className="group">
                <Card className="flex h-full flex-col overflow-hidden border-2 border-transparent transition-all duration-300 ease-in-out hover:border-primary hover:shadow-2xl">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-grow flex-col justify-between">
                    <p className="text-muted-foreground">{feature.description}</p>
                    <div className="mt-4 flex items-center font-semibold text-primary">
                      <span>{translations.home.tryNow}</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
