export type AIProvider = "openai" | "anthropic" | "gemini" | "grok";

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface SiteRecommendation {
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: string;
  geologicalFeatures: string[];
  hypothesisAlignment: {
    electromagnetic: number;
    consciousness: number;
    lightning: number;
  };
  risks: string[];
  accessNotes: string;
}

export interface StoneCircleSpecs {
  rockType: {
    recommended: string;
    alternatives: string[];
    localSources: string[];
  };
  rockSize: {
    height: string;
    weight: string;
    quantity: number;
  };
  circleDimensions: {
    diameter: string;
    spacing: string;
    orientation: string;
  };
  setup: {
    embedding: string;
    tools: string[];
    timeEstimate: string;
  };
}

export interface TestingGuidance {
  electromagnetic: {
    equipment: string[];
    procedure: string[];
    successCriteria: string;
  };
  consciousness: {
    methods: string[];
    metrics: string[];
    duration: string;
  };
  lightning: {
    equipment: string[];
    safetyWarnings: string[];
    measurements: string[];
  };
}

export interface AnalysisResult {
  location: Location;
  sites: SiteRecommendation[];
  specs: StoneCircleSpecs;
  testing: TestingGuidance;
  timestamp: string;
  disclaimer: string;
}

export interface APIKeyConfig {
  provider: AIProvider;
  key: string;
}

export interface UAPSighting {
  id: string;
  city: string;
  state: string;
  country: string;
  dateTime: string;
  shape: string;
  duration: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
