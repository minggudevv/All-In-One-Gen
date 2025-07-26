
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
import { correctLocation } from "@/ai/flows/correct-location-flow";
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
  Compass,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => <div className="rounded-md overflow-hidden h-48 bg-muted flex items-center justify-center"><p className="text-muted-foreground text-sm">Loading map...</p></div>
});

const LoginPromptDialog = ({ open, onOpenChange, title, description }: { open: boolean, onOpenChange: (open: boolean) => void, title: string, description: string }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                 <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button asChild>
                    <Link href="/login">Log In</Link>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);


export default function IdentityGeneratorPage() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [backstory, setBackstory] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isCorrectingMap, setIsCorrectingMap] = useState(false);
  const [isBackstoryCopied, setIsBackstoryCopied] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptContent, setLoginPromptContent] = useState({ title: "", description: ""});


  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const isLand = (lat: number, lon: number) => {
    const usBounds = {
        north: 49.38,
        south: 24.39,
        west: -125.0,
        east: -66.94,
    };
    return lat >= usBounds.south && lat <= usBounds.north && lon >= usBounds.west && lon <= usBounds.east;
  }

  const fetchIdentity = useCallback(async (retryCount = 0) => {
    setLoading(true);
    setBackstory(null);
  
    try {
      const response = await fetch("https://randomuser.me/api/?nat=us");
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      const result = data.results[0];
  
      const lat = parseFloat(result.location.coordinates.latitude);
      const lon = parseFloat(result.location.coordinates.longitude);
  
      if (!isLand(lat, lon) && retryCount < 5) {
        fetchIdentity(retryCount + 1);
        return; 
      }
  
      const newIdentity: Identity = {
        name: result.name,
        email: result.email,
        location: result.location,
        phone: result.phone,
        dob: result.dob,
        picture: result.picture,
      };
      setIdentity(newIdentity);
  
      if (!isLand(lat, lon)) {
        toast({
            variant: "destructive",
            title: "Could not find a land-based location",
            description: "The generated identity is located in the water. You can try correcting it with AI.",
          });
      }
  
    } catch (error) {
      console.error("Failed to fetch identity:", error);
      setIdentity(null); 
      toast({
        variant: "destructive",
        title: "Error Fetching Identity",
        description: "Could not retrieve a new identity. Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchIdentity();
  }, [fetchIdentity]);
  
  const handleGenerateBackstory = () => {
    if (!user) {
        setLoginPromptContent({
            title: "Log in to Generate a Backstory",
            description: "Our AI-powered backstory generation is an exclusive feature for logged-in users."
        });
        setShowLoginPrompt(true);
        return;
    }
    generateBackstory();
  }

  const generateBackstory = async () => {
    if (!identity) return;
    setIsEnhancing(true);
    setBackstory(null);
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

  const handleCopyBackstory = () => {
    if (!backstory) return;
    navigator.clipboard.writeText(backstory);
    setIsBackstoryCopied(true);
    toast({
      title: "Copied!",
      description: "Backstory has been copied to your clipboard.",
    });
    setTimeout(() => setIsBackstoryCopied(false), 2000);
  };


  const handleCorrectMap = () => {
    if(!user) {
        setLoginPromptContent({
            title: "Log in to Correct Map Location",
            description: "Our AI-powered map correction is an exclusive feature for logged-in users."
        });
        setShowLoginPrompt(true);
        return;
    }
    correctMap();
  }

  const correctMap = async () => {
    if (!identity) return;
    setIsCorrectingMap(true);
    try {
        const fullAddress = `${identity.location.street.number} ${identity.location.street.name}, ${identity.location.city}, ${identity.location.state} ${identity.location.postcode}, ${identity.location.country}`;
        const result = await correctLocation({ address: fullAddress });
        
        setIdentity(prevIdentity => {
            if (!prevIdentity) return null;
            return {
                ...prevIdentity,
                location: {
                    ...prevIdentity.location,
                    coordinates: {
                        latitude: result.latitude,
                        longitude: result.longitude,
                    }
                }
            }
        });

        toast({
            title: "Success!",
            description: "Map location has been corrected by AI.",
        });

    } catch (error) {
        console.error("Failed to correct location:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to correct map location.",
        });
    } finally {
        setIsCorrectingMap(false);
    }
  }

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
       <LoginPromptDialog 
            open={showLoginPrompt} 
            onOpenChange={setShowLoginPrompt}
            title={loginPromptContent.title}
            description={loginPromptContent.description}
        />
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
                priority
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
                         <Button variant="outline" size="sm" className="mt-2" onClick={handleCorrectMap} disabled={isCorrectingMap}>
                            <Compass className={`mr-2 h-4 w-4 ${isCorrectingMap ? 'animate-spin' : ''}`} />
                            {isCorrectingMap ? "Correcting..." : "Correct Map Location"}
                        </Button>
                   </div>
                </IdentityInfoRow>
                <IdentityInfoRow icon={<Cake className="h-5 w-5" />} label="Date of Birth" value={`${new Date(identity.dob.date).toLocaleDateString()} (Age ${identity.dob.age})`} />
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-muted-foreground"><Sparkles className="h-5 w-5 text-primary" /></div>
                   <div>
                      <p className="text-sm font-semibold text-muted-foreground">AI Generated Backstory</p>
                      {isEnhancing ? (
                        <div className="space-y-2 pt-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                      ) : backstory ? (
                        <div className="relative">
                            <p className="text-md italic pr-10">"{backstory}"</p>
                            <Button variant="ghost" size="icon" className="absolute -top-1 right-0" onClick={handleCopyBackstory}>
                                {isBackstoryCopied ? (
                                    <Check className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Copy className="h-5 w-5" />
                                )}
                                <span className="sr-only">Copy backstory</span>
                            </Button>
                        </div>
                      ) : (
                        <div>
                            <Button variant="link" className="p-0 h-auto" onClick={handleGenerateBackstory} disabled={isEnhancing}>
                                {isEnhancing ? 'Generating...' : 'Generate Backstory'}
                            </Button>
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
                 <Button onClick={() => fetchIdentity()} disabled={loading} size="lg" className="w-full sm:w-auto">
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? "Generating..." : "Generate Again"}
                </Button>
            </div>
          {user ? (
            <Button onClick={handleSaveIdentity} disabled={isSaving || loading || !identity} size="lg" variant="outline" className="w-full sm:w-auto">
              <Save className={`mr-2 h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
              {isSaving ? "Saving..." : "Save to Dashboard"}
            </Button>
          ) : (
             <Button asChild size="lg" variant="outline" className="w-full sm:w-auto" disabled={!identity}>
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
