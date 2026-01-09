"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Download,
  Share2,
  Mountain,
  Ruler,
  TestTube,
  AlertTriangle,
  Zap,
  Brain,
  Radio,
  ChevronDown,
  ChevronUp,
  Compass,
  Hammer,
  Clock,
} from "lucide-react";
import dynamic from "next/dynamic";
import type { AnalysisResult, SiteRecommendation } from "@/types";

const GoogleMapDisplay = dynamic(() => import("./GoogleMapDisplay"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-mystic-900/50 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  ),
});

interface ResultsDisplayProps {
  result: AnalysisResult;
  onBack: () => void;
}

export default function ResultsDisplay({
  result,
  onBack,
}: ResultsDisplayProps) {
  const [selectedSite, setSelectedSite] = useState<SiteRecommendation | null>(
    result.sites[0] || null
  );
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    specs: true,
    testing: false,
  });
  const reportRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const html2canvas = (await import("html2canvas")).default;

    if (!reportRef.current) return;

    // Save current expanded state
    const previousState = { ...expandedSections };

    // Expand all sections for PDF export
    setExpandedSections({
      specs: true,
      testing: true,
    });

    // Wait for React to re-render with expanded sections
    await new Promise((resolve) => setTimeout(resolve, 100));

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      backgroundColor: "#0f0a19",
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`geohypothesis-report-${Date.now()}.pdf`);

    // Restore previous expanded state
    setExpandedSections(previousState);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GeoHypothesis Explorer Report",
          text: `Check out these power spots near ${result.location.address}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mystic-950 to-black">
      {/* Header */}
      <header className="p-4 border-b border-mystic-800/50 sticky top-0 bg-mystic-950/90 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-mystic-800/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">Analysis Results</h1>
              <p className="text-sm text-gray-400">{result.location.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="p-2 rounded-lg hover:bg-mystic-800/50 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="hidden md:inline">Download PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-mystic-800/50 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8" ref={reportRef}>
        {/* Map Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-mystic-400" />
            Recommended Power Spots
          </h2>
          <GoogleMapDisplay
            center={result.location}
            sites={result.sites}
            onSiteSelect={setSelectedSite}
          />
        </motion.section>

        {/* Sites Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid md:grid-cols-3 gap-4">
            {result.sites.map((site, index) => (
              <div
                key={index}
                onClick={() => setSelectedSite(site)}
                className={`glass rounded-xl p-6 cursor-pointer transition-all
                          ${selectedSite === site ? "ring-2 ring-mystic-500 scale-[1.02]" : "hover:bg-mystic-800/30"}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mystic-500 to-cyan-500 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{site.name}</h3>
                    <p className="text-sm text-gray-400">{site.distance}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-4">{site.description}</p>

                {/* Hypothesis Alignment */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <div className="flex-1 h-2 bg-mystic-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${site.hypothesisAlignment.electromagnetic}%`,
                        }}
                      />
                    </div>
                    <span className="text-gray-400">
                      {site.hypothesisAlignment.electromagnetic}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <div className="flex-1 h-2 bg-mystic-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400"
                        style={{
                          width: `${site.hypothesisAlignment.consciousness}%`,
                        }}
                      />
                    </div>
                    <span className="text-gray-400">
                      {site.hypothesisAlignment.consciousness}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Radio className="w-4 h-4 text-blue-400" />
                    <div className="flex-1 h-2 bg-mystic-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400"
                        style={{
                          width: `${site.hypothesisAlignment.lightning}%`,
                        }}
                      />
                    </div>
                    <span className="text-gray-400">
                      {site.hypothesisAlignment.lightning}%
                    </span>
                  </div>
                </div>

                {/* Risks */}
                {site.risks.length > 0 && (
                  <div className="mt-4 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <div className="flex items-center gap-2 text-orange-400 text-xs font-medium mb-1">
                      <AlertTriangle className="w-3 h-3" />
                      Risks
                    </div>
                    <ul className="text-xs text-gray-400">
                      {site.risks.map((risk, i) => (
                        <li key={i}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Stone Circle Specifications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <button
            onClick={() => toggleSection("specs")}
            className="w-full glass rounded-xl p-6 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-mystic-500/20">
                  <Mountain className="w-6 h-6 text-mystic-400" />
                </div>
                <h2 className="text-2xl font-bold">
                  Stone Circle Specifications
                </h2>
              </div>
              {expandedSections.specs ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </div>
          </button>

          {expandedSections.specs && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 grid md:grid-cols-2 gap-6"
            >
              {/* Rock Type */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mountain className="w-5 h-5 text-earth-400" />
                  <h3 className="font-semibold">Rock Type</h3>
                </div>
                <p className="text-lg font-medium text-mystic-300 mb-2">
                  {result.specs.rockType.recommended}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  <strong>Alternatives:</strong>{" "}
                  {result.specs.rockType.alternatives.join(", ")}
                </p>
                <div className="p-3 bg-mystic-800/50 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Local Sources:</p>
                  <ul className="text-sm">
                    {result.specs.rockType.localSources.map((source, i) => (
                      <li key={i}>• {source}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Rock Size */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Ruler className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold">Rock Dimensions</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-mystic-800/50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Height</p>
                    <p className="font-bold text-lg">
                      {result.specs.rockSize.height}
                    </p>
                  </div>
                  <div className="p-3 bg-mystic-800/50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Weight</p>
                    <p className="font-bold text-lg">
                      {result.specs.rockSize.weight}
                    </p>
                  </div>
                  <div className="p-3 bg-mystic-800/50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Quantity</p>
                    <p className="font-bold text-lg">
                      {result.specs.rockSize.quantity}
                    </p>
                  </div>
                </div>
              </div>

              {/* Circle Dimensions */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Compass className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold">Circle Layout</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Diameter</span>
                    <span className="font-medium">
                      {result.specs.circleDimensions.diameter}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stone Spacing</span>
                    <span className="font-medium">
                      {result.specs.circleDimensions.spacing}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-mystic-800">
                    <span className="text-gray-400 text-sm">Orientation</span>
                    <p className="font-medium mt-1">
                      {result.specs.circleDimensions.orientation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Setup Requirements */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Hammer className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold">Setup Requirements</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Embedding Depth</p>
                    <p className="font-medium">{result.specs.setup.embedding}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tools Needed</p>
                    <div className="flex flex-wrap gap-2">
                      {result.specs.setup.tools.map((tool, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-mystic-800/50 rounded text-sm"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    {result.specs.setup.timeEstimate}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* Testing Guidance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <button
            onClick={() => toggleSection("testing")}
            className="w-full glass rounded-xl p-6 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-mystic-500/20">
                  <TestTube className="w-6 h-6 text-mystic-400" />
                </div>
                <h2 className="text-2xl font-bold">Testing & Measurement</h2>
              </div>
              {expandedSections.testing ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </div>
          </button>

          {expandedSections.testing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 grid md:grid-cols-3 gap-6"
            >
              {/* Electromagnetic Testing */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-semibold">Electromagnetic</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Equipment</p>
                    <ul className="text-sm space-y-1">
                      {result.testing.electromagnetic.equipment.map(
                        (item, i) => (
                          <li key={i}>• {item}</li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Procedure</p>
                    <ol className="text-sm space-y-1">
                      {result.testing.electromagnetic.procedure.map(
                        (step, i) => (
                          <li key={i}>
                            {i + 1}. {step}
                          </li>
                        )
                      )}
                    </ol>
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-xs text-green-400 font-medium mb-1">
                      Success Criteria
                    </p>
                    <p className="text-sm">
                      {result.testing.electromagnetic.successCriteria}
                    </p>
                  </div>
                </div>
              </div>

              {/* Consciousness Testing */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold">Consciousness</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Methods</p>
                    <ul className="text-sm space-y-1">
                      {result.testing.consciousness.methods.map((method, i) => (
                        <li key={i}>• {method}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Metrics</p>
                    <ul className="text-sm space-y-1">
                      {result.testing.consciousness.metrics.map((metric, i) => (
                        <li key={i}>• {metric}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    {result.testing.consciousness.duration}
                  </div>
                </div>
              </div>

              {/* Lightning/Telluric Testing */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Radio className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold">Lightning/Telluric</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Equipment</p>
                    <ul className="text-sm space-y-1">
                      {result.testing.lightning.equipment.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Measurements</p>
                    <ul className="text-sm space-y-1">
                      {result.testing.lightning.measurements.map((m, i) => (
                        <li key={i}>• {m}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-xs text-red-400 font-medium mb-1">
                      Safety Warnings
                    </p>
                    <ul className="text-sm text-red-300">
                      {result.testing.lightning.safetyWarnings.map(
                        (warning, i) => (
                          <li key={i}>⚠️ {warning}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-orange-300 mb-2">
                Important Disclaimer
              </h3>
              <p className="text-sm text-gray-400">{result.disclaimer}</p>
            </div>
          </div>
        </motion.div>

        {/* Timestamp */}
        <p className="text-center text-xs text-gray-500 mt-8">
          Report generated on {new Date(result.timestamp).toLocaleString()}
        </p>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>2026 Copyright - Joe LeBoube</p>
        </div>
      </footer>
    </div>
  );
}
