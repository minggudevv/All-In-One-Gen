"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useEffect } from "react";

const customIcon = new Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});


const MapView = ({ lat, lon }: { lat: number; lon: number }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div className="rounded-md overflow-hidden h-48 bg-muted flex items-center justify-center"><p className="text-muted-foreground text-sm">Loading map...</p></div>;
    }

    return (
        <MapContainer
        center={[lat, lon]}
        zoom={13}
        style={{ height: "200px", width: "100%", borderRadius: "var(--radius)"}}
        scrollWheelZoom={false}
        >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]} icon={customIcon}>
            <Popup>Approximate location.</Popup>
        </Marker>
        </MapContainer>
    );
};

export default MapView;
