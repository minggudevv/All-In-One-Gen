"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Identity } from "@/types";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Cake,
  Building,
  Briefcase,
  Heart,
  Globe,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";

// Dynamically import the map component to avoid SSR issues
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => <div className="rounded-md overflow-hidden h-48 bg-muted flex items-center justify-center"><p className="text-muted-foreground text-sm">Loading map...</p></div>
});


export default function IdentityViewPage() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const { translations } = useLanguage();

  useEffect(() => {
    const storedIdentity = sessionStorage.getItem("view-identity");
    if (storedIdentity) {
      setIdentity(JSON.parse(storedIdentity));
    }
    setLoading(false);
  }, []);

  const InfoCard = ({
    icon,
    title,
    children,
  }: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        {icon}
        <CardTitle className="text-lg font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
        <Skeleton className="h-8 w-1/3 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-8">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-40 w-full rounded-lg" />
            </div>
            <div className="md:col-span-2 space-y-8">
                 <Skeleton className="h-48 w-full rounded-lg" />
                 <Skeleton className="h-32 w-full rounded-lg" />
            </div>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{translations.identityView.notFound.title}</h1>
          <p className="text-muted-foreground">
            {translations.identityView.notFound.description}
          </p>
        </div>
      </div>
    );
  }
  
  const { name, email, location, phone, dob, picture } = identity;

  return (
    <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto max-w-5xl px-4 py-12">
            <header className="text-center mb-12">
                <h1 className="font-headline text-5xl font-bold tracking-tight">
                    {name.first} {name.last}
                </h1>
                <p className="mt-2 text-xl text-muted-foreground">
                    {translations.identityView.subtitle}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 space-y-8 sticky top-24">
                    <Card className="overflow-hidden text-center">
                        <CardContent className="p-6">
                            <Image
                                src={picture.thumbnail}
                                alt={`Profile of ${name.first} ${name.last}`}
                                width={200}
                                height={200}
                                className="rounded-full mx-auto border-4 border-background shadow-lg mb-4"
                                data-ai-hint="profile picture"
                            />
                            <h2 className="text-2xl font-bold font-headline">{`${name.title}. ${name.first} ${name.last}`}</h2>
                            <p className="text-muted-foreground">{`@${name.first.toLowerCase()}${name.last.toLowerCase()}`}</p>
                        </CardContent>
                    </Card>

                    <InfoCard icon={<User className="h-6 w-6 text-primary" />} title={translations.identityView.cards.personal.title}>
                         <div className="space-y-2 text-sm">
                            <p><strong>{translations.identityView.cards.personal.age}:</strong> {dob.age}</p>
                            <p><strong>{translations.identityView.cards.personal.birthday}:</strong> {new Date(dob.date).toLocaleDateString()}</p>
                            <p><strong>{translations.identityView.cards.personal.nationality}:</strong> US</p>
                        </div>
                    </InfoCard>
                </div>

                <div className="md:col-span-2 space-y-8">
                     <InfoCard icon={<Mail className="h-6 w-6 text-primary" />} title={translations.identityView.cards.contact.title}>
                        <div className="space-y-4">
                             <div>
                                <p className="text-sm font-semibold text-muted-foreground">{translations.identityView.cards.contact.email}</p>
                                <p className="text-lg">{email}</p>
                             </div>
                             <div>
                                <p className="text-sm font-semibold text-muted-foreground">{translations.identityView.cards.contact.phone}</p>
                                <p className="text-lg">{phone}</p>
                             </div>
                        </div>
                    </InfoCard>

                     <InfoCard icon={<MapPin className="h-6 w-6 text-primary" />} title={translations.identityView.cards.location.title}>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-semibold text-muted-foreground">{translations.identityView.cards.location.address}</p>
                                <p className="text-lg">{`${location.street.number} ${location.street.name}, ${location.city}, ${location.state} ${location.postcode}, ${location.country}`}</p>
                            </div>
                           
                           <MapView 
                                lat={parseFloat(location.coordinates.latitude)}
                                lon={parseFloat(location.coordinates.longitude)}
                                translations={translations}
                            />
                           
                        </div>
                    </InfoCard>
                    
                    {identity.enhancedBackstory && (
                         <InfoCard icon={<Briefcase className="h-6 w-6 text-primary" />} title={translations.identityView.cards.backstory.title}>
                           <p className="text-lg italic text-muted-foreground">"{identity.enhancedBackstory}"</p>
                        </InfoCard>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
