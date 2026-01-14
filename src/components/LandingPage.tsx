"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Brain,
  Mountain,
  Compass,
  ChevronDown,
  Sparkles,
  Radio,
  Eye,
} from "lucide-react";
import dynamic from "next/dynamic";

const StoneCircle3D = dynamic(() => import("./StoneCircle3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse text-mystic-400">
        Loading Ancient Wisdom...
      </div>
    </div>
  ),
});

const hypothesisPillars = [
  {
    icon: Zap,
    title: "Electromagnetic Harvesters",
    description:
      "Stone circles may have captured and concentrated Earth's natural electromagnetic fields, creating zones of amplified energy through piezoelectric properties of granite and quartz.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Brain,
    title: "Consciousness Amplifiers",
    description:
      "These ancient structures could have served as geophysical amplifiers for altered states of consciousness, enhancing meditation, healing, and spiritual experiences.",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Radio,
    title: "Telluric Conduits",
    description:
      "Positioned at geological fault lines and mineral deposits, stone circles may have acted as conductors for Earth's telluric currents and lightning energy.",
    color: "from-blue-500 to-cyan-500",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function LandingPage() {
  const router = useRouter();
  const [currentPillar, setCurrentPillar] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const handleEnterExplorer = () => {
    router.push("/explorer");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPillar((prev) => (prev + 1) % hypothesisPillars.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Suspense
            fallback={
              <div className="w-full h-full bg-gradient-to-b from-mystic-950 to-black" />
            }
          >
            <StoneCircle3D />
          </Suspense>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-mystic-400 animate-pulse" />
              <span className="text-mystic-300 uppercase tracking-widest text-sm">
                Unlock Ancient Mysteries
              </span>
              <Sparkles className="w-6 h-6 text-mystic-400 animate-pulse" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-mystic-200 to-mystic-400 bg-clip-text text-transparent">
              GeoHypothesis Explorer
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Discover the hidden power beneath your feet. Ancient stone
              circles weren&apos;t just monuments — they may have been{" "}
              <span className="text-mystic-400 font-semibold">
                energy machines
              </span>{" "}
              tapping into Earth&apos;s natural forces.
            </p>

            <motion.button
              onClick={handleEnterExplorer}
              className="group relative px-8 py-4 bg-gradient-to-r from-mystic-600 to-mystic-500 rounded-full text-lg font-semibold
                         hover:from-mystic-500 hover:to-mystic-400 transition-all duration-300
                         shadow-lg shadow-mystic-500/30 hover:shadow-mystic-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <Compass className="w-5 h-5" />
                Find Your Power Spot
              </span>
              <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <AnimatePresence>
          {showScrollIndicator && (
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex flex-col items-center text-gray-400"
              >
                <span className="text-sm mb-2">Explore the Hypothesis</span>
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Hypothesis Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-black to-mystic-950/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The <span className="text-mystic-400">Combined Hypothesis</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              What if the ancient builders knew something we&apos;ve forgotten?
              Our hypothesis explores three interconnected theories about the
              true purpose of stone circles.
            </p>
          </motion.div>

          {/* Pillar Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {hypothesisPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                className={`relative p-8 rounded-2xl glass cursor-pointer transition-all duration-500
                           ${currentPillar === index ? "ring-2 ring-mystic-400 scale-105" : "hover:scale-102"}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                onClick={() => setCurrentPillar(index)}
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${pillar.color} mb-6`}
                >
                  <pillar.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{pillar.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {pillar.description}
                </p>
                {currentPillar === index && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-mystic-500/10 to-transparent"
                    layoutId="activePillar"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Evidence Points */}
          <motion.div
            className="glass rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-8 text-center">
              Supporting Evidence
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Mountain,
                  title: "Geological Placement",
                  text: "Stone circles are often built on fault lines and mineral-rich deposits",
                },
                {
                  icon: Zap,
                  title: "Piezoelectric Stones",
                  text: "Granite and quartz generate electrical charge under pressure",
                },
                {
                  icon: Eye,
                  title: "Altered States",
                  text: "Reports of unusual perceptions and experiences at ancient sites",
                },
                {
                  icon: Radio,
                  title: "EMF Anomalies",
                  text: "Measurable electromagnetic variations at stone circle locations",
                },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex p-3 rounded-full bg-mystic-500/20 mb-4">
                    <item.icon className="w-6 h-6 text-mystic-400" />
                  </div>
                  <h4 className="font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-mystic-950/50 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-mystic-500/20 blur-3xl" />
        </div>

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Test the Hypothesis?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Enter your location and let AI analyze geological data to find the
            best spots near you to build and test your own stone circle
            experiment.
          </p>

          <motion.button
            onClick={handleEnterExplorer}
            className="group relative px-10 py-5 bg-gradient-to-r from-mystic-600 to-cyan-600 rounded-full text-xl font-semibold
                       hover:from-mystic-500 hover:to-cyan-500 transition-all duration-300
                       shadow-2xl shadow-mystic-500/30 hover:shadow-mystic-500/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              Enter Your Address
              <Sparkles className="w-6 h-6" />
            </span>
          </motion.button>

          <p className="mt-6 text-sm text-gray-500">
            No registration required • Your API key stays private • Results in
            seconds
          </p>
        </motion.div>
      </section>

      {/* Disclaimer */}
      <footer className="py-8 px-4 bg-black border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>
            <strong>Disclaimer:</strong> This is an exploratory tool based on
            speculative hypotheses. The theories presented are not
            scientifically proven. Users are responsible for their safety and
            legal compliance when visiting any suggested locations. Always
            obtain proper permissions before accessing private land.
          </p>
          <p className="mt-4 text-gray-600">
            2026 Copyright - Joe LeBoube
          </p>
        </div>
      </footer>
    </div>
  );
}
