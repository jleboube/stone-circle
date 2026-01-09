"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Location, SiteRecommendation } from "@/types";

interface MapDisplayProps {
  center: Location;
  sites: SiteRecommendation[];
  onSiteSelect?: (site: SiteRecommendation) => void;
}

export default function MapDisplay({
  center,
  sites,
  onSiteSelect,
}: MapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: 10,
      zoomControl: true,
    });

    // Dark tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }
    ).addTo(map);

    // Custom icons
    const homeIcon = L.divIcon({
      html: `<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 border-2 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const siteIcon = (index: number) =>
      L.divIcon({
        html: `<div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 border-2 border-white text-white font-bold">
                ${index + 1}
              </div>`,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

    // Add home marker
    L.marker([center.lat, center.lng], { icon: homeIcon })
      .addTo(map)
      .bindPopup(`<strong>Your Location</strong><br/>${center.address}`);

    // Add site markers
    sites.forEach((site, index) => {
      const marker = L.marker([site.coordinates.lat, site.coordinates.lng], {
        icon: siteIcon(index),
      }).addTo(map);

      marker.bindPopup(`
        <div class="min-w-[200px]">
          <strong class="text-lg">${site.name}</strong>
          <p class="text-sm mt-1">${site.description}</p>
          <p class="text-xs mt-2 text-gray-400">${site.distance} away</p>
        </div>
      `);

      if (onSiteSelect) {
        marker.on("click", () => onSiteSelect(site));
      }

      // Draw line from home to site
      L.polyline(
        [
          [center.lat, center.lng],
          [site.coordinates.lat, site.coordinates.lng],
        ],
        {
          color: "#8b5cf6",
          weight: 2,
          opacity: 0.5,
          dashArray: "5, 10",
        }
      ).addTo(map);
    });

    // Fit bounds to show all markers
    const bounds = L.latLngBounds([
      [center.lat, center.lng],
      ...sites.map((s) => [s.coordinates.lat, s.coordinates.lng] as [number, number]),
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [center, sites, onSiteSelect]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden"
    />
  );
}
