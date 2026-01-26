import { Shield, Target, Users } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { cn } from "@/utils";

// Reusable Professional Separator
const ProfessionalSeparator = () => (
  <div className="relative py-8">
    <div className="absolute inset-0 flex items-center" aria-hidden="true">
      <div className="w-full border-t border-zinc-100 dark:border-zinc-800"></div>
    </div>
    <div className="relative flex justify-center">
      <span className="bg-white dark:bg-zinc-950 px-4 text-zinc-200 dark:text-zinc-800">
        <div className="h-1.5 w-1.5 rotate-45 bg-current rounded-sm" />
      </span>
    </div>
  </div>
);

export default function AboutPage() {
  const founders = [
    {
      name: "Mr. Satyanarayana Vejella",
      role: "Co-Founder & CEO",
      bio: "With over 25 years of experience in urban infrastructure, Satya has transformed the way co-living works in India.",
    },
    {
      name: "Ms. Lakshmi Vejella",
      role: "Co-Founder & COO",
      bio: "An expert in hospitality management, Lakshmi ensures that every resident experiences a true 'home away from home'.",
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16 md:space-y-24">
          
          {/* --- HERO SECTION --- */}
          <section className="text-center space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-widest mb-2">
              Our Mission
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight dark:text-white leading-[1.1]">
              Elevating the <br className="hidden md:block" /> 
              <span className="text-orange-500">Living Experience.</span>
            </h1>
            <p className="text-base md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto font-medium">
              Providing premium, managed accommodation for students and young professionals
              in India's fastest-growing tech hubs.
            </p>
          </section>

          <ProfessionalSeparator />

          {/* --- FOUNDERS SECTION --- */}
          <section>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold dark:text-white">Meet the Visionaries</h2>
              <div className="h-1 w-12 bg-orange-500 mx-auto mt-4 rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {founders.map((founder, idx) => (
                <div key={idx} className="group p-6 md:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 hover:border-orange-500/20 transition-all">
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800 shrink-0 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-inner" />
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold dark:text-white group-hover:text-orange-500 transition-colors">
                          {founder.name}
                        </h3>
                        <p className="text-orange-600 text-xs font-bold uppercase tracking-wider mt-1">{founder.role}</p>
                      </div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {founder.bio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- VALUES SECTION --- */}
          <section className="bg-zinc-900 dark:bg-zinc-900/50 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
            {/* Decorative background blur */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-orange-500/20 blur-[100px]" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <ValueCard 
                icon={<Shield className="w-8 h-8 text-orange-500" />} 
                title="Secure" 
                desc="Biometric entry systems & 24/7 CCTV surveillance for total peace of mind." 
              />
              <ValueCard 
                icon={<Users className="w-8 h-8 text-blue-400" />} 
                title="Community" 
                desc="Curated social events and networking opportunities for like-minded peers." 
              />
              <ValueCard 
                icon={<Target className="w-8 h-8 text-green-400" />} 
                title="Hygienic" 
                desc="Professional daily housekeeping and strict sanitization protocols." 
              />
            </div>
          </section>

        </div>
      </div>
    </MainLayout>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        {icon}
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-bold text-white">{title}</h4>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-[250px] mx-auto">
          {desc}
        </p>
      </div>
    </div>
  );
}