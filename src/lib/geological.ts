// Geological data services for USGS APIs

export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  coordinates: {
    lat: number;
    lng: number;
    depth: number;
  };
  url: string;
}

export interface FaultLine {
  id: string;
  name: string;
  slipRate: string;
  coordinates: { lat: number; lng: number }[];
}

// Fetch recent earthquakes from USGS
export async function fetchEarthquakes(
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  },
  minMagnitude: number = 2.5,
  days: number = 30
): Promise<Earthquake[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const params = new URLSearchParams({
    format: "geojson",
    starttime: startDate.toISOString().split("T")[0],
    endtime: endDate.toISOString().split("T")[0],
    minmagnitude: minMagnitude.toString(),
    minlatitude: bounds.south.toString(),
    maxlatitude: bounds.north.toString(),
    minlongitude: bounds.west.toString(),
    maxlongitude: bounds.east.toString(),
    orderby: "magnitude",
  });

  try {
    const response = await fetch(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?${params}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch earthquake data");
    }

    const data = await response.json();

    return data.features.map((feature: any) => ({
      id: feature.id,
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: feature.properties.time,
      coordinates: {
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        depth: feature.geometry.coordinates[2],
      },
      url: feature.properties.url,
    }));
  } catch (error) {
    console.error("Error fetching earthquakes:", error);
    return [];
  }
}

// Fetch fault lines from USGS Quaternary Fault and Fold Database
// Uses the official USGS ArcGIS REST endpoint
export async function fetchFaultLines(
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }
): Promise<FaultLine[]> {
  // USGS official Quaternary Fault and Fold Database endpoint
  // Layer 21 is the National Database with full GeoJSON support
  const params = new URLSearchParams({
    f: "geojson",
    where: "1=1",
    outFields: "fault_id,fault_name,slip_rate",
    geometry: `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`,
    geometryType: "esriGeometryEnvelope",
    spatialRel: "esriSpatialRelIntersects",
    outSR: "4326",
  });

  try {
    const response = await fetch(
      `https://earthquake.usgs.gov/arcgis/rest/services/haz/Qfaults/MapServer/21/query?${params}`
    );

    if (!response.ok) {
      console.warn("USGS Fault service unavailable");
      return [];
    }

    const data = await response.json();

    if (!data.features) {
      return [];
    }

    // GeoJSON format uses coordinates array directly in geometry
    return data.features.map((feature: any, index: number) => {
      let coordinates: { lat: number; lng: number }[] = [];

      if (feature.geometry && feature.geometry.coordinates) {
        // GeoJSON LineString format: [[lng, lat], [lng, lat], ...]
        if (feature.geometry.type === "LineString") {
          coordinates = feature.geometry.coordinates.map((coord: number[]) => ({
            lat: coord[1],
            lng: coord[0],
          }));
        } else if (feature.geometry.type === "MultiLineString") {
          // Flatten multi-line strings
          coordinates = feature.geometry.coordinates.flat().map((coord: number[]) => ({
            lat: coord[1],
            lng: coord[0],
          }));
        }
      }

      return {
        id: feature.properties?.fault_id || `fault-${index}`,
        name: feature.properties?.fault_name || "Unknown Fault",
        slipRate: feature.properties?.slip_rate || "Unknown",
        coordinates,
      };
    }).filter((fault: FaultLine) => fault.coordinates.length > 0);
  } catch (error) {
    console.error("Error fetching fault lines:", error);
    return [];
  }
}

// Get magnitude color for earthquake markers
export function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 6) return "#ff0000"; // Red - major
  if (magnitude >= 5) return "#ff6600"; // Orange - moderate
  if (magnitude >= 4) return "#ffcc00"; // Yellow - light
  if (magnitude >= 3) return "#99cc00"; // Yellow-green - minor
  return "#00cc99"; // Teal - micro
}

// Get magnitude size for earthquake markers
export function getMagnitudeSize(magnitude: number): number {
  return Math.max(6, magnitude * 4);
}
