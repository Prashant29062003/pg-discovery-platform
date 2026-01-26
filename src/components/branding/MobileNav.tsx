"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Add this
import Link from "next/link";
import NextImage from "next/image";
import { Menu, X, Phone, LogOut, LayoutDashboard, Home, Search, Image as ImageIcon, Info, Building2, Clock } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/config";

export default function MobileNav() {
  const [open, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // To handle hydration
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  // Handle Hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // Disable touch gestures
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    };
  }, [open]);

  const handleSignOut = async () => {
    await signOut(() => {
      router.push('/');
      setIsOpen(false);
    });
  };

  const userRole = user ? (user.publicMetadata as any)?.role : 'visitor';
  const isOwner = userRole === 'owner';
  const dashboardUrl = userRole === 'owner' ? '/admin' : '/visitor/dashboard';

  if (!mounted) return null;

  return (
    <>
      {/* TRIGGER BUTTON - Remains in the Navbar */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full text-zinc-700 dark:text-zinc-200 lg:hidden cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* PORTAL - Teleports the menu to the root body to fix the scrolling area */}
      {createPortal(
        <div
          className={`
            fixed inset-0 bg-white dark:bg-zinc-950 flex flex-col
            transition-all duration-300 ease-in-out lg:hidden
            ${open
              ? "translate-x-0 opacity-100 visible"
              : "translate-x-full opacity-0 invisible"}
          `}
          style={{
            zIndex: 999999,
            height: '100dvh', // Dynamic viewport height
            width: '100vw'
          }}
        >
          {/* Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
            <span className="font-bold text-xl dark:text-white">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full dark:text-zinc-200 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-8 w-8" />
            </Button>
          </div>

          {/* Nav Content */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-6 flex flex-col">
            <div className="flex flex-col gap-8 pb-10">
              {/* User Section */}
              {isLoaded && user && (
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0">
                  <NextImage
                    src={user.imageUrl}
                    alt="profile"
                    width={56}
                    height={56}
                    className="rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-zinc-900 dark:text-white truncate text-lg">{user.fullName}</p>
                    <p className="text-sm text-zinc-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 px-2">{isOwner ? "Management" : "Explore"}</p>
                {isOwner ? (
                  <>
                    <MobileLink href="/admin" icon={<LayoutDashboard />} onClick={() => setIsOpen(false)}>Admin Overview</MobileLink>
                    <MobileLink href="/admin/pgs" icon={<Building2 />} onClick={() => setIsOpen(false)}>My Properties</MobileLink>
                    <MobileLink href="/admin/bookings" icon={<Clock />} onClick={() => setIsOpen(false)}>Bookings</MobileLink>
                  </>
                ) : (
                  <>
                    <MobileLink href="/" icon={<Home className="w-6 h-6" />} onClick={() => setIsOpen(false)}>Home</MobileLink>
                    <MobileLink href="/pgs" icon={<Search className="w-6 h-6" />} onClick={() => setIsOpen(false)}>Explore PGs</MobileLink>
                    <MobileLink href="/life" icon={<ImageIcon className="w-6 h-6" />} onClick={() => setIsOpen(false)}>Community Gallery</MobileLink>
                    <MobileLink href="/about" icon={<Info className="w-6 h-6" />} onClick={() => setIsOpen(false)}>About Us</MobileLink>
                  </>
                )}

              </div>

              <div className="h-px bg-zinc-100 dark:bg-zinc-800 shrink-0" />

              {/* Actions */}
              <div className="flex flex-col gap-4">
                {isLoaded && user ? (
                  <>
                    <Button variant="outline" className="justify-start gap-4 h-14 rounded-xl text-md" asChild>
                      <Link href={dashboardUrl} onClick={() => setIsOpen(false)}>
                        <LayoutDashboard className="h-5 w-5 text-orange-500" /> Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" className="justify-start gap-4 h-14 text-red-500" onClick={handleSignOut}>
                      <LogOut className="h-5 w-5" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="h-14 rounded-xl text-md" asChild>
                    <Link href="/sign-in" onClick={() => setIsOpen(false)}>Sign In</Link>
                  </Button>
                )}

                <Button className="bg-orange-600 hover:bg-orange-700 text-white h-16 rounded-xl text-lg font-bold" asChild>
                  <Link href="/pgs" onClick={() => setIsOpen(false)}>Book Your Stay</Link>
                </Button>
              </div>

              {/* Support */}
              <div className="pt-6 text-center">
                <a href={`tel:${SITE_CONFIG?.supportPhone}`} className="inline-flex items-center gap-2 text-zinc-600 font-medium text-lg">
                  <Phone className="h-5 w-5 text-orange-500" /> {SITE_CONFIG?.supportPhone || "Support"}
                </a>
              </div>
            </div>
          </nav>
        </div>,
        document.body
      )}
    </>
  );
}

function MobileLink({ href, onClick, icon, children }: { href: string; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-5 text-xl font-semibold text-zinc-700 dark:text-zinc-200 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-2xl transition-all"
    >
      <span className="text-orange-600">{icon}</span>
      {children}
    </Link>
  );
}