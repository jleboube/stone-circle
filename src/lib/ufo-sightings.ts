// UFO/UAP Sightings data service
// Data source: NUFORC (National UFO Reporting Center) via Timothy Renner's processed dataset

import type { UFOSighting } from "@/types";

// Cache for parsed sightings to avoid re-fetching
let cachedSightings: UFOSighting[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

// CSV data URL from GitHub
const NUFORC_CSV_URL =
  "https://raw.githubusercontent.com/timothyrenner/nuforc_sightings_data/master/data/processed/nuforc_reports.csv";

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

// Fetch and parse all sightings from NUFORC dataset
async function fetchAllSightings(): Promise<UFOSighting[]> {
  // Return cached data if still valid
  if (cachedSightings && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedSightings;
  }

  try {
    const response = await fetch(NUFORC_CSV_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch UFO sightings data");
    }

    const csvText = await response.text();
    const lines = csvText.split("\n");

    // Skip header row
    const sightings: UFOSighting[] = [];

    // CSV columns: city,state,date_time,shape,duration,stats,report_link,text,posted,city_latitude,city_longitude
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const fields = parseCSVLine(line);

      // Ensure we have enough fields and valid coordinates
      if (fields.length < 11) continue;

      const lat = parseFloat(fields[9]);
      const lng = parseFloat(fields[10]);

      // Skip entries without valid coordinates
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) continue;

      sightings.push({
        id: `ufo-${i}`,
        city: fields[0] || "Unknown",
        state: fields[1] || "Unknown",
        country: "USA", // NUFORC is primarily US data
        dateTime: fields[2] || "Unknown date",
        shape: fields[3] || "Unknown",
        duration: fields[4] || "Unknown",
        description: fields[7]?.substring(0, 500) || "No description available", // Truncate long descriptions
        coordinates: {
          lat,
          lng,
        },
      });
    }

    // Cache the results
    cachedSightings = sightings;
    cacheTimestamp = Date.now();

    console.log(`Loaded ${sightings.length} UFO sightings from NUFORC dataset`);
    return sightings;
  } catch (error) {
    console.error("Error fetching UFO sightings:", error);
    return [];
  }
}

// Fetch UFO sightings within geographic bounds
export async function fetchUFOSightings(bounds: {
  north: number;
  south: number;
  east: number;
  west: number;
}): Promise<UFOSighting[]> {
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
    `Found ${filteredSightings.length} UFO sightings within bounds`
  );
  return filteredSightings;
}

// Get shape icon/emoji for UFO type
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
    cigar: "🚬",
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
    // NUFORC dates are typically in format "MM/DD/YYYY HH:MM"
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
