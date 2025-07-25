"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useEffect } from "react";

// Definisikan ikon kustom di luar komponen untuk mencegah pembuatan ulang
const customIcon = new Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapView = ({ lat, lon }: { lat: number; lon: number }) => {
    // Gunakan state untuk menunda rendering peta hingga komponen ter-mount di klien
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Jangan render apa pun di sisi server atau sebelum komponen ter-mount
    if (!isClient) {
        return null;
    }

    return (
        <div style={{ height: "200px", width: "100%" }}>
            <MapContainer
                center={[lat, lon]}
                zoom={13}
                style={{ height: "100%", width: "100%", borderRadius: "var(--radius)"}}
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
        </div>
    );
};

export default MapView;
