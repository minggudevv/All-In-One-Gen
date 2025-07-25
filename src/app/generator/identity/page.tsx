"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { Identity } from "@/types";
import { enhanceIdentity } from "@/ai/flows/enhance-identity-generation";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Cake,
  RefreshCw,
  Save,
  LogIn,
  Sparkles,
  Expand,
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => <div className="rounded-md overflow-hidden h-48 bg-muted flex items-center justify-center mt-4"><p className="text-muted-foreground text-sm">Loading map...</p></div>
});

const isLand = (lat: number, lon: number) => {
    // A simple bounding box for the continental US to filter out obvious ocean coordinates.
    // This is not perfect but will prevent most "in the ocean" results.
    const usBounds = {
        north: 49.38,
        south: 24.39,
        west: -125.0,
        east: -66.94,
    };
    return lat >= usBounds.south && lat <= usBounds.north && lon >= usBounds.west && lon <= usBounds.east;
}

export default function IdentityGeneratorPage() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [backstory, setBackstory] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const fetchIdentity = useCallback(async () => {
    setLoading(true);
    setBackstory(null);
    let validIdentity = false;

    while(!validIdentity) {
      try {
        const response = await fetch("https://randomuser.me/api/?nat=us");
        if (!response.ok) {
            // Handle HTTP errors like 404 or 500
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        const result = data.results[0];
        
        const lat = parseFloat(result.location.coordinates.latitude);
        const lon = parseFloat(result.location.coordinates.longitude);

        if (isLand(lat, lon)) {
            const newIdentity: Identity = {
                name: result.name,
                email: result.email,
                location: result.location,
                phone: result.phone,
                dob: result.dob,
                picture: result.picture,
            };
            setIdentity(newIdentity);
            validIdentity = true;
        }
      } catch (error) {
        console.error("Failed to fetch identity:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch a new identity. Please try again.",
        });
        // Stop the loop if there's a network error
        break; 
      }
    }
    
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchIdentity();
  }, [fetchIdentity]);
  
  const generateBackstory = async () => {
    if (!identity) return;
    setIsEnhancing(true);
    try {
      const result = await enhanceIdentity(identity);
      setBackstory(result.enhancedBackstory);
    } catch (error) {
      console.error("Failed to enhance identity:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate backstory."
      });
      setBackstory("Could not generate a backstory.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSaveIdentity = async () => {
    if (!user || !identity) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/identities`), {
        ...identity,
        enhancedBackstory: backstory,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Success!",
        description: "Identity saved to your dashboard.",
      });
    } catch (error) {
      console.error("Failed to save identity:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save identity. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const IdentityInfoRow = ({ icon, label, value, children }: { icon: React.ReactNode, label: string, value?: string, children?: React.ReactNode }) => (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        {value && <p className="text-md">{value}</p>}
        {children}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">Fake Identity Generator</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Generate a complete, random identity with a single click.
        </p>
      </div>

      <Card className="overflow-hidden shadow-lg">
        {loading ? (
          <div className="grid md:grid-cols-3">
            <div className="p-8 bg-muted/30 flex flex-col items-center justify-center space-y-4">
              <Skeleton className="h-40 w-40 rounded-full" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="md:col-span-2 p-8 space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <Skeleton className="h-6 w-6 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-56" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : identity && (
          <div className="grid md:grid-cols-3">
            <div className="p-8 bg-primary/5 flex flex-col items-center justify-center text-center">
              <Image
                src={identity.picture.large}
                alt="Profile"
                width={160}
                height={160}
                className="rounded-full border-4 border-background shadow-md mb-4"
                data-ai-hint="profile picture"
              />
              <h2 className="text-2xl font-bold font-headline">{`${identity.name.first} ${identity.name.last}`}</h2>
              <p className="text-muted-foreground">{`@${identity.name.first.toLowerCase()}${identity.name.last.toLowerCase()}`}</p>
            </div>
            
            <div className="md:col-span-2 p-8">
              <CardTitle className="mb-6 font-headline">Details</CardTitle>
              <div className="space-y-6">
                <IdentityInfoRow icon={<User className="h-5 w-5" />} label="Full Name" value={`${identity.name.title}. ${identity.name.first} ${identity.name.last}`} />
                <IdentityInfoRow icon={<Mail className="h-5 w-5" />} label="Email Address" value={identity.email} />
                <IdentityInfoRow icon={<Phone className="h-5 w-5" />} label="Phone Number" value={identity.phone} />
                <IdentityInfoRow icon={<MapPin className="h-5 w-5" />} label="Address" value={`${identity.location.street.number} ${identity.location.street.name}, ${identity.location.city}, ${identity.location.state} ${identity.location.postcode}`}>
                   <div className="pt-2">
                       <MapView 
                          lat={parseFloat(identity.location.coordinates.latitude)}
                          lon={parseFloat(identity.location.coordinates.longitude)}
                        />
                   </div>
                </IdentityInfoRow>
                <IdentityInfoRow icon={<Cake className="h-5 w-5" />} label="Date of Birth" value={`${new Date(identity.dob.date).toLocaleDateString()} (Age ${identity.dob.age})`} />
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-muted-foreground"><Sparkles className="h-5 w-5 text-primary" /></div>
                   <div>
                      <p className="text-sm font-semibold text-muted-foreground">AI Generated Backstory</p>
                      {backstory ? (
                        <p className="text-md italic">"{backstory}"</p>
                      ) : (
                        <div>
                          {isEnhancing ? (
                            <div className="space-y-2 pt-1">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-5/6" />
                            </div>
                          ) : (
                            user ? (
                              <Button variant="link" className="p-0 h-auto" onClick={generateBackstory}>Generate Backstory</Button>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                <Link href="/login" className="underline">Log in</Link> to generate a backstory.
                              </p>
                            )
                          )}
                        </div>
                      )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <CardFooter className="bg-muted/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                 <Button onClick={fetchIdentity} disabled={loading} size="lg" className="w-full sm:w-auto">
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? "Generating..." : "Generate Again"}
                </Button>
            </div>
          {user ? (
            <Button onClick={handleSaveIdentity} disabled={isSaving || loading} size="lg" variant="outline" className="w-full sm:w-auto">
              <Save className={`mr-2 h-4 w-4 ${isSaving ? 'animate-pulse' : ''}`} />
              {isSaving ? "Saving..." : "Save to Dashboard"}
            </Button>
          ) : (
             <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log in to Save
                </Link>
             </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
