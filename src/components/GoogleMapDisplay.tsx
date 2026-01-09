"use client";

import { useCallback, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Polyline,
} from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";
import type { Location, SiteRecommendation } from "@/types";

interface GoogleMapDisplayProps {
  center: Location;
  sites: SiteRecommendation[];
  onSiteSelect?: (site: SiteRecommendation) => void;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#4b6878" }],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64779e" }],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [{ color: "#4b6878" }],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334e87" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#023e58" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#283d6a" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6f9ba5" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1d2c4d" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#023e58" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3C7680" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#304a7d" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#98a5be" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1d2c4d" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2c6675" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#255763" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#b0d5ce" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#023e58" }],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{ color: "#98a5be" }],
  },
  {
    featureType: "transit",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1d2c4d" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry.fill",
    stylers: [{ color: "#283d6a" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#3a4762" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1626" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4e6d70" }],
  },
];

export default function GoogleMapDisplay({
  center,
  sites,
  onSiteSelect,
}: GoogleMapDisplayProps) {
  const [selectedSite, setSelectedSite] = useState<SiteRecommendation | null>(
    null
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    // Fit bounds to include all markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: center.lat, lng: center.lng });
    sites.forEach((site) => {
      bounds.extend({ lat: site.coordinates.lat, lng: site.coordinates.lng });
    });
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    setMap(map);
  }, [center, sites]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleSiteClick = (site: SiteRecommendation) => {
    setSelectedSite(site);
    if (onSiteSelect) {
      onSiteSelect(site);
    }
  };

  if (loadError) {
    return (
      <div className="w-full h-[400px] md:h-[500px] rounded-xl bg-mystic-900/50 flex items-center justify-center">
        <p className="text-red-400">Error loading Google Maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] md:h-[500px] rounded-xl bg-mystic-900/50 animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: center.lat, lng: center.lng }}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: darkMapStyles,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {/* Home marker */}
        <Marker
          position={{ lat: center.lat, lng: center.lng }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          }}
          title="Your Location"
        />

        {/* Site markers */}
        {sites.map((site, index) => (
          <Marker
            key={index}
            position={{ lat: site.coordinates.lat, lng: site.coordinates.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 14,
              fillColor: "#06b6d4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3,
            }}
            label={{
              text: String(index + 1),
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: "bold",
            }}
            onClick={() => handleSiteClick(site)}
          />
        ))}

        {/* Lines from home to sites */}
        {sites.map((site, index) => (
          <Polyline
            key={`line-${index}`}
            path={[
              { lat: center.lat, lng: center.lng },
              { lat: site.coordinates.lat, lng: site.coordinates.lng },
            ]}
            options={{
              strokeColor: "#06b6d4",
              strokeOpacity: 0.5,
              strokeWeight: 2,
              geodesic: true,
            }}
          />
        ))}

        {/* Info window for selected site */}
        {selectedSite && (
          <InfoWindow
            position={{
              lat: selectedSite.coordinates.lat,
              lng: selectedSite.coordinates.lng,
            }}
            onCloseClick={() => setSelectedSite(null)}
          >
            <div className="p-2 max-w-[250px]">
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                {selectedSite.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {selectedSite.description}
              </p>
              <p className="text-gray-500 text-xs">
                {selectedSite.distance} from your location
              </p>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Alignment scores: EM {selectedSite.hypothesisAlignment.electromagnetic}% |
                  Mind {selectedSite.hypothesisAlignment.consciousness}% |
                  Lightning {selectedSite.hypothesisAlignment.lightning}%
                </p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
