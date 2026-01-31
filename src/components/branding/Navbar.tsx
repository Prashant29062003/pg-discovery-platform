"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, X, Menu, Sun, Moon,
  Building2, Map, Sparkles, ShieldCheck, Clock, Star, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import MobileNav from "./MobileNav";
import EnquiryForm from "../visitor/forms/EnquiryForm";
import UserMenu from "@/components/visitor/dashboard/UserMenu";
import { useUser } from '@clerk/nextjs';
import { CityNav } from "./CityNav";



interface NavbarProps {
  requireAuth?: boolean; // true = require auth, false = optional auth
}

export default function Navbar({ requireAuth = false }: NavbarProps) {
  const { user, isLoaded } = useUser();
  const { theme, setTheme } = useTheme();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  if (!isLoaded) return null;
  if (requireAuth && !user) return null;

  // Extract role
  const userRole = user ? (user.publicMetadata as any)?.role : 'guest';
  const isOwner = userRole === 'owner';
  const isVisitor = userRole === 'visitor' || !user; // Guests are treated as visitors for enquiry

  if (!isLoaded) return null;
  if (requireAuth && !user) return null;

  return (
    <>
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-8 flex-1">
          {/* Logo - Acts as Home link */}
          <Link href="/" className="font-bold text-xl shrink-0 text-zinc-900 dark:text-white hover:opacity-90 transition-opacity">
            Elite<span className="text-orange-600">Venue</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>

                {/* 1. LOCATIONS - Dynamic from Database */}
                <CityNav />

                {/* 2. WHY ELITE VENUE */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-zinc-600 dark:text-zinc-300">
                    Why Us
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[500px] gap-1 p-4">
                      <ListItem
                        title="Our Promise"
                        href="/#promise"
                        icon={<Sparkles className="w-4 h-4 text-yellow-500" />}
                      >
                        Good food, cleanliness, safety & security, spacious living.
                      </ListItem>

                      <ListItem
                        title="Why Choose Us"
                        href="/#experience"
                        icon={<ShieldCheck className="w-4 h-4 text-green-500" />}
                      >
                        Community, all-inclusive living, prime locations, better savings.
                      </ListItem>

                      <ListItem
                        title="Our Locations"
                        href="/#locations"
                        icon={<MapPin className="w-4 h-4 text-red-500" />}
                      >
                        Currently available in major cities. Expanding to new locations soon.
                      </ListItem>

                      <ListItem
                        title="Guest Reviews"
                        href="/#testimonials"
                        icon={<Star className="w-4 h-4 text-orange-500" />}
                      >
                        See what 50,000+ residents say about their EliteVenue experience.
                      </ListItem>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 3. STATIC LINKS */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/life"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 transition-colors hover:text-orange-600 dark:hover:text-orange-500"
                    >
                      Community
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full w-9 h-9 text-zinc-600 dark:text-zinc-400 cursor-pointer"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Link href="/pgs" className="hidden lg:inline-flex">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6 font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95">
              Explore PGs
            </Button>
          </Link>

          <Link href="/enquiry" className="hidden lg:inline-flex items-center gap-2 rounded-full border-slate-200 dark:border-slate-800 font-medium">
            <MessageSquare className="h-4 w-4 text-orange-500" />
            <span className="dark:text-white">Quick Enquiry</span>
          </Link>

          {/* User Auth Section */}
          <div className="hidden lg:flex items-center gap-2 border-l pl-3 border-zinc-200 dark:border-zinc-800 ml-2 min-w-[100px] justify-end">
            {!isLoaded ? (
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ) : user ? (
              <UserMenu />
            ) : (
              <Link href="/sign-in">
                <Button variant="ghost" className="rounded-full px-4 text-zinc-600 dark:text-zinc-300 cursor-pointer">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <MobileNav />
        </div>
      </header>

      {/* Enquiry Modal */}
      <AnimatePresence>
        {isEnquiryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEnquiryOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md z-10"
            >
              <button
                onClick={() => setIsEnquiryOpen(false)}
                className="absolute -top-10 right-0 text-white/80 hover:text-red-500 cursor-pointer flex items-center gap-2 text-sm "
              >
                Close <X className="h-4 w-4" />
              </button>
              <EnquiryForm pgId="navbar-modal" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

const ListItem = ({ className, title, children, icon, href, ...props }: any) => {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className={cn(
          "flex items-start gap-3 select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 group",
          className
        )}
        {...props}
      >
        {icon && <div className="mt-1">{icon}</div>}
        <div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none group-hover:text-orange-600 transition-colors">
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-zinc-500 dark:text-zinc-400 mt-1">
            {children}
          </p>
        </div>
      </Link>
    </NavigationMenuLink>
  );
};