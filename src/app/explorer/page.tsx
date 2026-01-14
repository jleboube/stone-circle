"use client";

import { useRouter } from "next/navigation";
import Explorer from "@/components/Explorer";

export default function ExplorerPage() {
  const router = useRouter();

  return <Explorer onBack={() => router.push("/")} />;
}
