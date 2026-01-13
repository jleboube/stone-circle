// UAP (Unidentified Aerial Phenomena) Sightings data service
// Data source: NUFORC (National UFO Reporting Center) via planetsig's geocoded dataset

import type { UAPSighting } from "@/types";

// Cache for parsed sightings to avoid re-fetching
let cachedSightings: UAPSighting[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

// CSV data URL from GitHub - planetsig's geocoded NUFORC data (80,000+ records)
const NUFORC_CSV_URL =
  "https://raw.githubusercontent.com/planetsig/ufo-reports/master/csv-data/ufo-scrubbed-geocoded-time-standardized.csv";

// Parse CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

// Decode HTML entities in description text
function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&#44/g, ",")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Fetch and parse all sightings from NUFORC dataset
async function fetchAllSightings(): Promise<UAPSighting[]> {
  // Return cached data if still valid
  if (cachedSightings && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log(`Using cached UAP sightings (${cachedSightings.length} records)`);
    return cachedSightings;
  }

  try {
    console.log("Fetching UAP sightings from NUFORC dataset...");
    const response = await fetch(NUFORC_CSV_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch UAP sightings data: ${response.status}`);
    }

    const csvText = await response.text();
    const lines = csvText.split("\n");

    const sightings: UAPSighting[] = [];

    // CSV format: datetime,city,state,country,shape,duration_seconds,duration_text,description,posted_date,latitude,longitude
    // No header row in this dataset
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const fields = parseCSVLine(line);

      // Ensure we have enough fields
      if (fields.length < 11) continue;

      const lat = parseFloat(fields[9]);
      const lng = parseFloat(fields[10]);

      // Skip entries without valid coordinates
      if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) continue;

      // Parse country code
      const countryCode = fields[3]?.toLowerCase() || "us";
      const country = countryCode === "us" || countryCode === "" ? "USA" :
                      countryCode === "gb" ? "UK" :
                      countryCode === "ca" ? "Canada" :
                      countryCode === "au" ? "Australia" : countryCode.toUpperCase();

      sightings.push({
        id: `uap-${i}`,
        city: fields[1] || "Unknown",
        state: fields[2] || "",
        country,
        dateTime: fields[0] || "Unknown date",
        shape: fields[4] || "Unknown",
        duration: fields[6] || fields[5] || "Unknown", // Use text duration if available, else seconds
        description: decodeHTMLEntities(fields[7]?.substring(0, 500) || "No description available"),
        coordinates: {
          lat,
          lng,
        },
      });
    }

    // Cache the results
    cachedSightings = sightings;
    cacheTimestamp = Date.now();

    console.log(`Loaded ${sightings.length} UAP sightings from NUFORC dataset`);
    return sightings;
  } catch (error) {
    console.error("Error fetching UAP sightings:", error);
    return [];
  }
}

// Fetch UAP sightings within geographic bounds
export async function fetchUAPSightings(bounds: {
  north: number;
  south: number;
  east: number;
  west: number;
}): Promise<UAPSighting[]> {
  const allSightings = await fetchAllSightings();

  // Filter sightings within bounds
  const filteredSightings = allSightings.filter((sighting) => {
    const { lat, lng } = sighting.coordinates;
    return (
      lat >= bounds.south &&
      lat <= bounds.north &&
      lng >= bounds.west &&
      lng <= bounds.east
    );
  });

  console.log(
    `Found ${filteredSightings.length} UAP sightings within bounds (${bounds.south.toFixed(2)} to ${bounds.north.toFixed(2)} lat)`
  );
  return filteredSightings;
}

// Get shape icon/emoji for UAP type
export function getShapeIcon(shape: string): string {
  const shapeMap: Record<string, string> = {
    light: "💡",
    circle: "⭕",
    triangle: "🔺",
    fireball: "🔥",
    sphere: "🔵",
    disk: "🛸",
    oval: "⬭",
    other: "❓",
    unknown: "❓",
    cigar: "🔷",
    rectangle: "▬",
    cylinder: "🔷",
    diamond: "💎",
    chevron: "〈",
    formation: "⋮⋮⋮",
    changing: "🔄",
    flash: "⚡",
    cross: "✚",
    egg: "🥚",
    teardrop: "💧",
    cone: "🔺",
    star: "⭐",
  };

  const normalizedShape = shape.toLowerCase().trim();
  return shapeMap[normalizedShape] || "👽";
}

// Format date for display
export function formatSightingDate(dateTime: string): string {
  try {
    // Dataset dates are in format "MM/DD/YYYY HH:MM"
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
      return dateTime; // Return original if parsing fails
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateTime;
  }
}
