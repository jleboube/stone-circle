"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Key,
  Loader2,
  AlertCircle,
  CheckCircle,
  Search,
  Sparkles,
} from "lucide-react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import type { AIProvider, Location, AnalysisResult } from "@/types";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";
import ResultsDisplay from "./ResultsDisplay";

interface ExplorerProps {
  onBack: () => void;
}

const providers: { id: AIProvider; name: string; placeholder: string }[] = [
  { id: "gemini", name: "Google Gemini", placeholder: "AIza..." },
  { id: "openai", name: "OpenAI (GPT-4)", placeholder: "sk-..." },
  { id: "anthropic", name: "Anthropic (Claude)", placeholder: "sk-ant-..." },
  { id: "grok", name: "xAI (Grok)", placeholder: "xai-..." },
];

const libraries: ("places")[] = ["places"];

export default function Explorer({ onBack }: ExplorerProps) {
  const [address, setAddress] = useState("");
  const [selectedProvider, setSelectedProvider] =
    useState<AIProvider>("gemini");
  const [useOwnKey, setUseOwnKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry && place.geometry.location) {
        const loc: Location = {
          address: place.formatted_address || place.name || address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setLocation(loc);
        setAddress(place.formatted_address || place.name || address);
        setError(null);
      }
    }
  };

  const handleGeocode = async () => {
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use Google Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status !== "OK" || data.results.length === 0) {
        setError(
          "Could not find location. Try a more specific address or city name."
        );
        setIsLoading(false);
        return;
      }

      const result = data.results[0];
      const loc: Location = {
        address: result.formatted_address,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      };
      setLocation(loc);
      setAddress(result.formatted_address);
      setIsLoading(false);
    } catch {
      setError("Error geocoding address. Please try again.");
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!location) {
      setError("Please verify your location first");
      return;
    }

    if (useOwnKey && !apiKey.trim()) {
      setError("Please enter your API key");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location,
          provider: useOwnKey ? selectedProvider : "gemini",
          apiKey: useOwnKey ? apiKey : "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const analysisResult = await response.json();
      setResult(analysisResult);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Analysis failed";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (result) {
    return <ResultsDisplay result={result} onBack={() => setResult(null)} />;
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      onLoad={() => setIsScriptLoaded(true)}
    >
      <div className="min-h-screen bg-gradient-to-b from-mystic-950 to-black">
        {/* Header */}
        <header className="p-4 border-b border-mystic-800/50">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-mystic-800/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">GeoHypothesis Explorer</h1>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Location Input */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-mystic-500/20">
                  <MapPin className="w-6 h-6 text-mystic-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Location</h2>
                  <p className="text-sm text-gray-400">
                    Enter your address to find nearby power spots
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {isScriptLoaded ? (
                  <Autocomplete
                    onLoad={onAutocompleteLoad}
                    onPlaceChanged={onPlaceChanged}
                    className="flex-1"
                  >
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGeocode()}
                      placeholder="Start typing your address..."
                      className="w-full px-4 py-3 bg-black/50 border border-mystic-700 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-mystic-500 focus:border-transparent
                               placeholder:text-gray-500"
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGeocode()}
                    placeholder="Enter your address, city, or coordinates..."
                    className="flex-1 px-4 py-3 bg-black/50 border border-mystic-700 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-mystic-500 focus:border-transparent
                             placeholder:text-gray-500"
                  />
                )}
                <button
                  onClick={handleGeocode}
                  disabled={isLoading}
                  className="px-6 py-3 bg-mystic-600 hover:bg-mystic-500 rounded-xl font-medium
                           transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  Find
                </button>
              </div>

              <AnimatePresence>
                {location && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="font-medium text-green-300">
                        Location Verified
                      </p>
                      <p className="text-sm text-gray-400">{location.address}</p>
                      <p className="text-xs text-gray-500">
                        Coordinates: {location.lat.toFixed(6)},{" "}
                        {location.lng.toFixed(6)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* API Key Input */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-mystic-500/20">
                  <Key className="w-6 h-6 text-mystic-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">AI Provider</h2>
                  <p className="text-sm text-gray-400">
                    Use our free analysis or bring your own API key
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Default option - no API key needed */}
                <div
                  onClick={() => setUseOwnKey(false)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all
                            ${!useOwnKey
                              ? "border-mystic-500 bg-mystic-500/20"
                              : "border-mystic-700 hover:border-mystic-600"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                  ${!useOwnKey ? "border-mystic-400" : "border-gray-500"}`}>
                      {!useOwnKey && <div className="w-2 h-2 rounded-full bg-mystic-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">Use Free Analysis</p>
                      <p className="text-sm text-gray-400">Powered by Google Gemini - no API key required</p>
                    </div>
                  </div>
                </div>

                {/* Use own key option */}
                <div
                  onClick={() => setUseOwnKey(true)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all
                            ${useOwnKey
                              ? "border-mystic-500 bg-mystic-500/20"
                              : "border-mystic-700 hover:border-mystic-600"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                  ${useOwnKey ? "border-mystic-400" : "border-gray-500"}`}>
                      {useOwnKey && <div className="w-2 h-2 rounded-full bg-mystic-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">Use My Own API Key</p>
                      <p className="text-sm text-gray-400">Choose your preferred AI provider</p>
                    </div>
                  </div>
                </div>

                {/* Provider selection and API key input - only shown when using own key */}
                <AnimatePresence>
                  {useOwnKey && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                        {providers.map((provider) => (
                          <button
                            key={provider.id}
                            onClick={() => setSelectedProvider(provider.id)}
                            className={`p-3 rounded-xl border transition-all text-sm font-medium
                                      ${
                                        selectedProvider === provider.id
                                          ? "border-mystic-500 bg-mystic-500/20 text-mystic-300"
                                          : "border-mystic-700 hover:border-mystic-600 text-gray-400"
                                      }`}
                          >
                            {provider.name}
                          </button>
                        ))}
                      </div>

                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={
                          providers.find((p) => p.id === selectedProvider)
                            ?.placeholder || "Enter API key..."
                        }
                        className="w-full px-4 py-3 bg-black/50 border border-mystic-700 rounded-xl
                                 focus:outline-none focus:ring-2 focus:ring-mystic-500 focus:border-transparent
                                 placeholder:text-gray-500"
                      />

                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Your API key is sent directly to the AI provider and is never
                        stored on our servers.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-300">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analyze Button */}
            <motion.button
              onClick={handleAnalyze}
              disabled={!location || (useOwnKey && !apiKey) || isLoading}
              className="w-full py-4 bg-gradient-to-r from-mystic-600 to-cyan-600 rounded-xl font-semibold text-lg
                       hover:from-mystic-500 hover:to-cyan-500 transition-all duration-300
                       shadow-lg shadow-mystic-500/20 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Geological Data...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Discover Power Spots Near You
                </>
              )}
            </motion.button>

            {/* Info Box */}
            <div className="p-6 bg-mystic-900/30 rounded-xl border border-mystic-800/50">
              <h3 className="font-semibold mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-mystic-400">1.</span>
                  AI analyzes geological surveys, fault lines, and mineral
                  deposits near your location
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mystic-400">2.</span>
                  Identifies 5 optimal sites within 10-20 miles that align with
                  the hypothesis
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mystic-400">3.</span>
                  Provides stone circle specifications customized for your region
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-mystic-400">4.</span>
                  Generates testing methods and measurement guidance
                </li>
              </ul>
            </div>
          </motion.div>
        </main>
      </div>
    </LoadScript>
  );
}
