"use client";

import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import Explorer from "@/components/Explorer";

export default function Home() {
  const [showExplorer, setShowExplorer] = useState(false);

  if (showExplorer) {
    return <Explorer onBack={() => setShowExplorer(false)} />;
  }

  return <LandingPage onEnterExplorer={() => setShowExplorer(true)} />;
}
