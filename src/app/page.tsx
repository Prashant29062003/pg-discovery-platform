import { Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/visitor/sections/HeroSection";
import PromiseSection from "@/components/visitor/sections/PromiseSection";
import ExperienceSection from "@/components/visitor/sections/ExperienceSection";
import BranchesSection from "@/components/visitor/sections/BranchesSection";
import Testimonials from "@/components/visitor/sections/Testimonials";
import CitySelection from "@/components/public/discovery/CitySelection";
import DotNav from "@/components/branding/DotNav";
import LocationSection from "@/components/visitor/sections/LocationSection";
import FAQSection from "@/components/visitor/sections/Accordion";

export default function Home() {
  return (
    <MainLayout>
      <DotNav />
      
      {/* 1. Hero Section */}
      <section id="hero" className="min-h-[90vh] flex items-center">
        <HeroSection />
      </section>

      {/* 2. Promise Section */}
      <section id="promise" className="py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <PromiseSection />
      </section>

      {/* 3. City Selection */}
      <section id="locations" className="py-12 bg-white dark:bg-zinc-950">
        <CitySelection />
      </section>

      {/* 4. Experience Section */}
      <section id="experience" className="py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <ExperienceSection />
      </section>

      {/* 5. Location Section */}
      <section id="venue" className="py-12 bg-white dark:bg-zinc-950">
        <LocationSection />
      </section>

      {/* 6. Branches Section */}
      <section id="branches" className="py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <BranchesSection />
      </section>

      {/* 7. FAQ Section */}
      <section id="accordion" className="py-12 bg-white dark:bg-zinc-950">
        <FAQSection />
      </section>

      {/* 8. Testimonials Section */}
      <section id="testimonials" className="py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <Testimonials />
      </section>
    </MainLayout>
  );
}