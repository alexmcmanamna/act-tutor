"use client";

import { useRouter } from "next/navigation";
import { OnboardingTour } from "@/components/OnboardingTour";

export default function OnboardingTourPage() {
  const router = useRouter();
  return <OnboardingTour onDone={() => router.push("/onboarding/skills")} />;
}
