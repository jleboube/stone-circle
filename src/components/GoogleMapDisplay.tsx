"use client";

import { useCallback, useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Polyline,
  Circle,
} from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";
import type { Location, SiteRecommendation } from "@/types";
import {
  fetchEarthquakes,
  fetchFaultLines,
  getMagnitudeColor,
  getMagnitudeSize,
  type Earthquake,
  type FaultLine,
} from "@/lib/geological";

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

  // Geological overlay state
  const [showFaultLines, setShowFaultLines] = useState(true);
  const [showEarthquakes, setShowEarthquakes] = useState(true);
  const [faultLines, setFaultLines] = useState<FaultLine[]>([]);
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [isLoadingGeoData, setIsLoadingGeoData] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  // Fetch geological data when map loads
  useEffect(() => {
    if (!isLoaded || !center) return;

    const fetchGeoData = async () => {
      setIsLoadingGeoData(true);

      // Calculate bounds ~50 miles around center
      const latOffset = 0.75; // ~50 miles
      const lngOffset = 0.75 / Math.cos((center.lat * Math.PI) / 180);

      const bounds = {
        north: center.lat + latOffset,
        south: center.lat - latOffset,
        east: center.lng + lngOffset,
        west: center.lng - lngOffset,
      };

      try {
        const [faults, quakes] = await Promise.all([
          fetchFaultLines(bounds),
          fetchEarthquakes(bounds, 2.5, 365), // Last year of earthquakes M2.5+
        ]);
        setFaultLines(faults);
        setEarthquakes(quakes);
      } catch (error) {
        console.error("Error fetching geological data:", error);
      } finally {
        setIsLoadingGeoData(false);
      }
    };

    fetchGeoData();
  }, [isLoaded, center]);

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
    <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden relative">
      {/* Bottom Controls - Layer Toggles and Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex gap-2">
        {/* Layer Toggle Controls */}
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Geological Layers
          </h4>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFaultLines}
              onChange={(e) => setShowFaultLines(e.target.checked)}
              className="w-4 h-4 rounded bg-mystic-900 border-mystic-600 text-mystic-500
                       focus:ring-mystic-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-200">Fault Lines</span>
            <span className="w-4 h-0.5 bg-orange-500 ml-1"></span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showEarthquakes}
              onChange={(e) => setShowEarthquakes(e.target.checked)}
              className="w-4 h-4 rounded bg-mystic-900 border-mystic-600 text-mystic-500
                       focus:ring-mystic-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-200">Earthquakes (1yr)</span>
            <span className="w-3 h-3 rounded-full bg-red-500 ml-1"></span>
          </label>
          {isLoadingGeoData && (
            <p className="text-xs text-mystic-400 animate-pulse">Loading data...</p>
          )}
          {!isLoadingGeoData && (
            <p className="text-xs text-gray-500">
              {faultLines.length} faults, {earthquakes.length} quakes
            </p>
          )}
        </div>

        {/* Magnitude Legend */}
        {showEarthquakes && earthquakes.length > 0 && (
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 self-end">
            <h4 className="text-xs font-semibold text-gray-300 mb-2">Magnitude</h4>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00cc99]"></span>
                2.5-3
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#99cc00]"></span>
                3-4
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#ffcc00]"></span>
                4-5
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-[#ff6600]"></span>
                5-6
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-[#ff0000]"></span>
                6+
              </span>
            </div>
          </div>
        )}
      </div>

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
        {/* Fault Lines */}
        {showFaultLines &&
          faultLines.map((fault) => (
            <Polyline
              key={fault.id}
              path={fault.coordinates.map((c) => ({ lat: c.lat, lng: c.lng }))}
              options={{
                strokeColor: "#f97316",
                strokeOpacity: 0.8,
                strokeWeight: 3,
                geodesic: true,
              }}
            />
          ))}

        {/* Earthquake Markers */}
        {showEarthquakes &&
          earthquakes.map((quake) => (
            <Circle
              key={quake.id}
              center={{ lat: quake.coordinates.lat, lng: quake.coordinates.lng }}
              radius={getMagnitudeSize(quake.magnitude) * 150}
              options={{
                fillColor: getMagnitudeColor(quake.magnitude),
                fillOpacity: 0.6,
                strokeColor: getMagnitudeColor(quake.magnitude),
                strokeOpacity: 0.9,
                strokeWeight: 1,
                clickable: true,
              }}
              onClick={() => setSelectedEarthquake(quake)}
            />
          ))}

        {/* Earthquake Info Window */}
        {selectedEarthquake && (
          <InfoWindow
            position={{
              lat: selectedEarthquake.coordinates.lat,
              lng: selectedEarthquake.coordinates.lng,
            }}
            onCloseClick={() => setSelectedEarthquake(null)}
          >
            <div className="p-2 max-w-[200px]">
              <h3 className="font-bold text-gray-900 text-sm mb-1">
                M{selectedEarthquake.magnitude.toFixed(1)} Earthquake
              </h3>
              <p className="text-gray-600 text-xs mb-1">
                {selectedEarthquake.place}
              </p>
              <p className="text-gray-500 text-xs">
                {new Date(selectedEarthquake.time).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-xs">
                Depth: {selectedEarthquake.coordinates.depth.toFixed(1)} km
              </p>
              <a
                href={selectedEarthquake.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-xs hover:underline mt-1 inline-block"
              >
                USGS Details
              </a>
            </div>
          </InfoWindow>
        )}

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
          zIndex={100}
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
            zIndex={101}
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
              zIndex: 50,
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
