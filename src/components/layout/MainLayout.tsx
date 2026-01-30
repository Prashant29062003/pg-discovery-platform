"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/branding/Navbar";
import Footer from "@/components/branding/Footer";
import { FloatingEnquiry } from "../visitor/forms/FloatingEnquiry";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLanding = pathname === "/";
    
    const showFloatingEnquiry = pathname.startsWith("/pgs") || pathname.startsWith("/dashboard") || pathname.startsWith("/wallet") || pathname.startsWith("/messages");

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-black transition-colors duration-300">

            {/* Adjusting the main container padding based on sidebar visibility */}
            <div className={`flex-1 flex flex-col min-w-0`}>
                <Navbar />
                <main className={isLanding ? "flex-1 w-full pt-16" : "flex-1 w-full max-w-7xl mx-auto px-4 pt-16 pb-8"}>
                    {children}
                </main>
                <Footer />
                {showFloatingEnquiry && <FloatingEnquiry/>}
            </div>
        </div>
    );
}