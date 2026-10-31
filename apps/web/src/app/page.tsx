import { Booking } from "@/components/landing/Booking";
import { Celebrations } from "@/components/landing/Celebrations";
import { Club } from "@/components/landing/Club";
import { Faq } from "@/components/landing/Faq";
import { Features } from "@/components/landing/Features";
import { FinalCta } from "@/components/landing/FinalCta";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingRuntime } from "@/components/landing/LandingRuntime";
import { Location } from "@/components/landing/Location";
import { Overlay } from "@/components/landing/Overlay";
import { Videos } from "@/components/landing/Videos";

export default function HomePage() {
  return (
    <>
      <canvas id="gl" aria-hidden="true" />
      <div className="prog" id="prog" />
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Booking />
        <Features />
        <Videos />
        <Celebrations />
        <Club />
        <Faq />
        <Location />
        <FinalCta />
      </main>
      <Overlay />
      <LandingRuntime />
    </>
  );
}
