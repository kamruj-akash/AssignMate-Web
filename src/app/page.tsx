import { CtaBand } from "@/components/home/cta-band";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Lifecycle } from "@/components/home/lifecycle";
import { Navbar } from "@/components/home/navbar";
import { TrustStrip } from "@/components/home/trust-strip";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Lifecycle />
        <HowItWorks />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
