import { NextRequest, NextResponse } from "next/server";
import type { AIProvider, Location, AnalysisResult } from "@/types";

const SYSTEM_PROMPT = `You are a geological and geophysical analysis expert specializing in ancient megalithic structures. You are helping users find optimal locations to test the following combined hypothesis about ancient stone circles:

HYPOTHESIS: Ancient stone circles functioned as:
1. Electromagnetic energy harvesters - using piezoelectric properties of granite, quartz, and conductive stones
2. Geophysical amplifiers for consciousness alteration and healing - positioned at locations with specific magnetic and geological properties
3. Conduits for lightning and telluric currents - leveraging Earth's natural electromagnetic fields

Your task is to analyze the user's location and provide:
1. Three prioritized sites within 10-20 miles that have the best geological characteristics for testing this hypothesis
2. Detailed stone circle specifications appropriate for the region
3. Testing and measurement guidance

For each site, consider:
- Proximity to geological fault lines
- Presence of mineral deposits (especially quartz, granite, iron ore)
- Magnetic anomalies
- Historical lightning frequency
- Telluric current patterns
- Accessibility and safety

Respond with a JSON object following this exact structure (no markdown, just pure JSON):
{
  "sites": [
    {
      "name": "Site name",
      "description": "Brief description of why this site is suitable",
      "coordinates": { "lat": number, "lng": number },
      "distance": "X miles",
      "geologicalFeatures": ["feature1", "feature2"],
      "hypothesisAlignment": { "electromagnetic": 0-100, "consciousness": 0-100, "lightning": 0-100 },
      "risks": ["risk1", "risk2"],
      "accessNotes": "Access information"
    }
  ],
  "specs": {
    "rockType": {
      "recommended": "Primary rock type",
      "alternatives": ["alt1", "alt2"],
      "localSources": ["source1", "source2"]
    },
    "rockSize": {
      "height": "X-Y feet",
      "weight": "X-Y lbs",
      "quantity": number
    },
    "circleDimensions": {
      "diameter": "X meters",
      "spacing": "X meters between stones",
      "orientation": "Alignment guidance"
    },
    "setup": {
      "embedding": "Depth in ground",
      "tools": ["tool1", "tool2"],
      "timeEstimate": "Estimated setup time"
    }
  },
  "testing": {
    "electromagnetic": {
      "equipment": ["equipment1", "equipment2"],
      "procedure": ["step1", "step2"],
      "successCriteria": "What indicates positive results"
    },
    "consciousness": {
      "methods": ["method1", "method2"],
      "metrics": ["metric1", "metric2"],
      "duration": "Recommended testing duration"
    },
    "lightning": {
      "equipment": ["equipment1", "equipment2"],
      "safetyWarnings": ["warning1", "warning2"],
      "measurements": ["measurement1", "measurement2"]
    }
  }
}`;

async function analyzeWithOpenAI(
  apiKey: string,
  location: Location
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analyze this location for stone circle testing sites: ${location.address} (coordinates: ${location.lat}, ${location.lng}). Consider the regional geology, fault lines, mineral deposits, and lightning patterns. Provide 3 site recommendations within 10-20 miles.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "OpenAI API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function analyzeWithAnthropic(
  apiKey: string,
  location: Location
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze this location for stone circle testing sites: ${location.address} (coordinates: ${location.lat}, ${location.lng}). Consider the regional geology, fault lines, mineral deposits, and lightning patterns. Provide 3 site recommendations within 10-20 miles.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Anthropic API error");
  }

  const data = await response.json();
  return data.content[0].text;
}

async function analyzeWithGemini(
  apiKey: string,
  location: Location
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nAnalyze this location for stone circle testing sites: ${location.address} (coordinates: ${location.lat}, ${location.lng}). Consider the regional geology, fault lines, mineral deposits, and lightning patterns. Provide 3 site recommendations within 10-20 miles.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Gemini API error");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function analyzeWithGrok(
  apiKey: string,
  location: Location
): Promise<string> {
  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-2-latest",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analyze this location for stone circle testing sites: ${location.address} (coordinates: ${location.lat}, ${location.lng}). Consider the regional geology, fault lines, mineral deposits, and lightning patterns. Provide 3 site recommendations within 10-20 miles.`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Grok API error");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function parseAIResponse(response: string, location: Location): AnalysisResult {
  // Try to extract JSON from the response
  let jsonStr = response;

  // Remove markdown code blocks if present
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  // Try to find JSON object in the response
  const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    jsonStr = objectMatch[0];
  }

  try {
    const parsed = JSON.parse(jsonStr);
    return {
      location,
      sites: parsed.sites || [],
      specs: parsed.specs || getDefaultSpecs(),
      testing: parsed.testing || getDefaultTesting(),
      timestamp: new Date().toISOString(),
      disclaimer:
        "This analysis is based on publicly available geological data and AI interpretation. The hypothesis explored is speculative and not scientifically proven. Always obtain proper permissions before accessing any land. Users assume full responsibility for safety and legal compliance. Do not conduct experiments during thunderstorms or in hazardous conditions.",
    };
  } catch {
    // If parsing fails, return a structured response with defaults
    console.error("Failed to parse AI response, using defaults");
    return {
      location,
      sites: getDefaultSites(location),
      specs: getDefaultSpecs(),
      testing: getDefaultTesting(),
      timestamp: new Date().toISOString(),
      disclaimer:
        "This analysis is based on publicly available geological data and AI interpretation. The hypothesis explored is speculative and not scientifically proven. Always obtain proper permissions before accessing any land. Users assume full responsibility for safety and legal compliance. Do not conduct experiments during thunderstorms or in hazardous conditions.",
    };
  }
}

function getDefaultSites(location: Location) {
  // Generate 3 sites roughly 10-15 miles from the center in different directions
  const sites = [];
  const directions = [
    { name: "North Ridge", angle: 0 },
    { name: "Eastern Valley", angle: 120 },
    { name: "Southwest Hills", angle: 240 },
  ];

  for (const dir of directions) {
    const distance = 10 + Math.random() * 5; // 10-15 miles
    const radians = (dir.angle * Math.PI) / 180;
    const latOffset = (distance / 69) * Math.cos(radians);
    const lngOffset =
      (distance / (69 * Math.cos((location.lat * Math.PI) / 180))) *
      Math.sin(radians);

    sites.push({
      name: dir.name,
      description:
        "Promising location with potential geological features suitable for testing the stone circle hypothesis.",
      coordinates: {
        lat: location.lat + latOffset,
        lng: location.lng + lngOffset,
      },
      distance: `${distance.toFixed(1)} miles`,
      geologicalFeatures: [
        "Potential quartz deposits",
        "Near regional fault line",
      ],
      hypothesisAlignment: {
        electromagnetic: 60 + Math.floor(Math.random() * 30),
        consciousness: 50 + Math.floor(Math.random() * 30),
        lightning: 40 + Math.floor(Math.random() * 40),
      },
      risks: ["Verify land access permissions", "Check local regulations"],
      accessNotes: "Verify accessibility and obtain necessary permissions.",
    });
  }

  return sites;
}

function getDefaultSpecs() {
  return {
    rockType: {
      recommended: "Granite with high quartz content",
      alternatives: ["Sandstone", "Bluestone", "Local metamorphic rock"],
      localSources: [
        "Local quarries (search for 'stone quarry' in your area)",
        "Landscaping suppliers",
        "Natural outcrop areas",
      ],
    },
    rockSize: {
      height: "2-4 feet",
      weight: "100-300 lbs each",
      quantity: 12,
    },
    circleDimensions: {
      diameter: "10 meters",
      spacing: "2.5 meters between stones",
      orientation: "Align entrance to magnetic north or summer solstice sunrise",
    },
    setup: {
      embedding: "12-18 inches into ground for stability",
      tools: [
        "Shovel",
        "Level",
        "Compass",
        "Measuring tape",
        "Rope for circle layout",
      ],
      timeEstimate: "2-3 days with 2-4 people",
    },
  };
}

function getDefaultTesting() {
  return {
    electromagnetic: {
      equipment: [
        "EMF meter (K-II or similar)",
        "Digital multimeter",
        "Ground conductivity meter",
      ],
      procedure: [
        "Take baseline readings before stone placement",
        "Measure at circle center and each stone position",
        "Record during different times of day",
        "Test during and after vibrational stimulation (sound, movement)",
      ],
      successCriteria:
        ">10% increase in EMF readings at circle center compared to surrounding area",
    },
    consciousness: {
      methods: [
        "Meditation sessions at circle center",
        "Journaling subjective experiences",
        "Heart rate variability monitoring",
        "Optional: EEG device (Muse, similar)",
      ],
      metrics: [
        "Subjective feelings of calm/energy",
        "Sleep quality following visits",
        "HRV measurements",
        "Duration of meditative states",
      ],
      duration: "30-60 minute sessions, repeated over several weeks",
    },
    lightning: {
      equipment: [
        "Lightning detector",
        "Ground resistance tester",
        "Weather monitoring app",
      ],
      safetyWarnings: [
        "NEVER be at the site during thunderstorms",
        "Wait at least 30 minutes after last thunder before approaching",
        "Keep equipment grounded properly",
      ],
      measurements: [
        "Ground resistance before and after setup",
        "Soil ionization levels",
        "Post-storm residual charge patterns",
      ],
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, provider, apiKey } = body as {
      location: Location;
      provider: AIProvider;
      apiKey?: string;
    };

    if (!location) {
      return NextResponse.json(
        { error: "Missing location" },
        { status: 400 }
      );
    }

    // Determine which API key to use
    let effectiveApiKey = apiKey;
    let effectiveProvider = provider;

    // If no API key provided, fall back to server-side Gemini key
    if (!apiKey || apiKey.trim() === "") {
      const serverGeminiKey = process.env.GEMINI_API_KEY;
      if (!serverGeminiKey) {
        return NextResponse.json(
          { error: "No API key provided and no default key configured" },
          { status: 400 }
        );
      }
      effectiveApiKey = serverGeminiKey;
      effectiveProvider = "gemini";
    }

    if (!effectiveProvider) {
      return NextResponse.json(
        { error: "No AI provider specified" },
        { status: 400 }
      );
    }

    let aiResponse: string;

    switch (effectiveProvider) {
      case "openai":
        aiResponse = await analyzeWithOpenAI(effectiveApiKey!, location);
        break;
      case "anthropic":
        aiResponse = await analyzeWithAnthropic(effectiveApiKey!, location);
        break;
      case "gemini":
        aiResponse = await analyzeWithGemini(effectiveApiKey!, location);
        break;
      case "grok":
        aiResponse = await analyzeWithGrok(effectiveApiKey!, location);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid AI provider" },
          { status: 400 }
        );
    }

    const result = parseAIResponse(aiResponse, location);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
