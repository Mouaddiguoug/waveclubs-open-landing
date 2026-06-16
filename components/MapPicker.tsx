"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export interface LatLng { lat: number; lng: number }

interface Props {
  value: LatLng | null;
  onChange: (pos: LatLng, city: string, country: string) => void;
}

// Morocco default centre
const DEFAULT = { lat: 31.7917, lng: -7.0926 };

export default function MapPicker({ value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef      = useRef<any>(null);
  const markerRef   = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Leaflet must run client-side only
    const L = require("leaflet");

    // Fix broken default icon paths in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map(containerRef.current).setView(
      value ? [value.lat, value.lng] : [DEFAULT.lat, DEFAULT.lng],
      value ? 10 : 6,
    );

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "© OpenStreetMap contributors © CARTO",
      maxZoom: 19,
    }).addTo(map);

    if (value) {
      markerRef.current = L.marker([value.lat, value.lng]).addTo(map);
    }

    map.on("click", async (e: any) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }

      // Reverse geocode via Nominatim
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        );
        const data = await res.json();
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.county ||
          "";
        const country = data.address?.country || "";
        onChange({ lat, lng }, city, country);
      } catch {
        onChange({ lat, lng }, "", "");
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={containerRef}
        className="w-full rounded-xl overflow-hidden"
        style={{ height: 280, border: "1px solid rgba(255,255,255,0.10)" }}
      />
      {!value && (
        <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.40)" }}>
          Click anywhere on the map to place your camp&apos;s location.
        </p>
      )}
    </div>
  );
}
