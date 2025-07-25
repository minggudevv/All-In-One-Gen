"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Definisikan ikon kustom untuk menghindari masalah dengan path gambar
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapView = ({ lat, lon }: { lat: number; lon: number }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Pastikan kode ini hanya berjalan di klien dan elemen kontainer sudah ada
    if (typeof window !== "undefined" && mapContainerRef.current && !mapRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [lat, lon],
          zoom: 13,
          scrollWheelZoom: false,
        });

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(map);

        L.marker([lat, lon], { icon: customIcon })
         .addTo(map)
         .bindPopup("Approximate location.");

        mapRef.current = map;
      
    }

    // Fungsi cleanup untuk menghancurkan instance peta saat komponen dibongkar
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lon]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height: "200px", width: "100%", borderRadius: "var(--radius)" }}
    />
  );
};

export default MapView;
