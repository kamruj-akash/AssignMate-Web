import { CtaBand } from "@/components/home/cta-band";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Lifecycle } from "@/components/home/lifecycle";
import { TrustStrip } from "@/components/home/trust-strip";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Lifecycle />
      <HowItWorks />
      <CtaBand />
    </>
  );
}
