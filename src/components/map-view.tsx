"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Expand } from "lucide-react";

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapRenderer = ({ lat, lon, isDialog = false, popupText }: { lat: number; lon: number; isDialog?: boolean; popupText: string }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 13,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker([lat, lon], { icon: customIcon })
       .addTo(map)
       .bindPopup(popupText);

      mapRef.current = map;

      // When the map is in a dialog, it might need to be resized after the dialog opens.
      if (isDialog) {
        setTimeout(() => {
          map.invalidateSize();
        }, 400); // Delay to allow for dialog animation
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lon, isDialog, popupText]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: isDialog ? '80vh' : '200px', width: "100%", borderRadius: "var(--radius)" }}
      className="z-0"
    />
  );
};


const MapView = ({ lat, lon, translations }: { lat: number; lon: number; translations: any }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="rounded-md overflow-hidden h-48 bg-muted flex items-center justify-center"><p className="text-muted-foreground text-sm">{translations.map.loading}</p></div>;
  }

  return (
    <div className="relative">
      <MapRenderer lat={lat} lon={lon} popupText={translations.map.popup} />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="absolute top-2 right-2 z-10 bg-background/70 hover:bg-background/90">
             <Expand className="h-4 w-4" />
             <span className="sr-only">{translations.map.enlarge}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl w-full p-2 sm:p-4">
           <DialogHeader>
             <DialogTitle className="sr-only">{translations.map.enlargedTitle}</DialogTitle>
           </DialogHeader>
           <MapRenderer lat={lat} lon={lon} isDialog={true} popupText={translations.map.popup} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapView;
