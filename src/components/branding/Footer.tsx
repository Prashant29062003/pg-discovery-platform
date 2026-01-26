"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { cn } from "@/utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pt-20 pb-8 border-t border-zinc-200 dark:border-zinc-900 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start space-y-6">
            <Link href="/" className="font-bold text-2xl tracking-tighter hover:opacity-80 transition-opacity">
              Elite<span className="text-orange-600 dark:text-orange-500">Venue</span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-xs">
              Redefining premium co-living spaces for the modern professional. 
              Comfort, community, and luxury in every corner.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={Facebook} label="Facebook" />
              <SocialIcon icon={Instagram} label="Instagram" />
              <SocialIcon icon={Twitter} label="Twitter" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:ml-auto">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 text-zinc-400 dark:text-zinc-500">Navigation</h3>
            <ul className="space-y-4">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/pgs">Explore PGs</FooterLink>
              <FooterLink href="/about">Our Story</FooterLink>
              <FooterLink href="/contact">Support</FooterLink>
            </ul>
          </div>

          {/* Locations */}
          <div className="lg:ml-auto">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 text-zinc-400 dark:text-zinc-500">Top Locations</h3>
            <ul className="space-y-4">
              <FooterLink href="#">Gurugram</FooterLink>
              <FooterLink href="#">Noida Sector 62</FooterLink>
              <FooterLink href="#">Bangalore</FooterLink>
              <FooterLink href="#">Delhi NCR</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 text-zinc-400 dark:text-zinc-500">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group cursor-pointer">
                <div className="mt-1 bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-md">
                  <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                  Noble Enclave, Palam Vihar, Gurugram
                </span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-md">
                  <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                  +91 9999 000 000
                </span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-md">
                  <Mail className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">
                  care@elitevenue.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-200 dark:border-zinc-900 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-zinc-500 dark:text-zinc-500 text-xs">
              © {currentYear} Elite Venue Managed Accommodations.
            </p>
            <Link 
              href="/admin/login" 
              className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400 dark:text-zinc-600 hover:text-orange-500 transition-colors flex items-center gap-1"
            >
              Internal Portal Access <ArrowUpRight className="h-2 w-2" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
            <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-500 transition-all flex items-center group"
      >
        <span className="bg-zinc-400 dark:bg-zinc-600 h-[1px] w-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button 
      aria-label={label}
      className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-500 hover:-translate-y-1 transition-all duration-300 shadow-sm"
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}