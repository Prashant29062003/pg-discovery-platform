'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, ChevronUp } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';

interface UserMenuProps {
  showLabel?: boolean;
}

export default function UserMenu({ showLabel = true }: UserMenuProps) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded || !user) {
    return (
      <div className="w-full h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
    );
  }

  const userRole = (user.publicMetadata as any)?.role;
  const isAdmin = userRole === 'owner';
  const dashboardUrl = isAdmin ? '/admin' : '/visitor/dashboard';
  const settingsUrl = isAdmin ? '/admin/settings' : '/visitor/settings';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost"
          className={cn(
            // Removed default focus and added focus-visible for better Mouse UX
            "group w-full flex items-center gap-3 p-2 h-auto rounded-xl transition-all border border-transparent select-none",
            "hover:bg-zinc-100 dark:hover:bg-zinc-900",
            "active:scale-[0.98] focus:ring-0 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none",
            !showLabel ? "justify-center" : "justify-start bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200/50 dark:border-zinc-800"
          )}
        >
          {/* Avatar Square - Clerk Style */}
          <div className="h-9 w-9 shrink-0 rounded-lg bg-orange-600 overflow-hidden flex items-center justify-center shadow-md shadow-orange-600/20 border border-white/10">
            {user.imageUrl ? (
              <Image 
                src={user.imageUrl} 
                alt={user.firstName || 'User'} 
                width={36} 
                height={36} 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-bold uppercase">
                {user.firstName?.[0]}
              </span>
            )}
          </div>

          {/* User Text Info */}
          {showLabel && (
            <div className="flex flex-col min-w-0 flex-1 text-left leading-tight">
              <span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {user.firstName || 'Admin'}
              </span>
              <span className="text-[10px] text-zinc-500 truncate uppercase tracking-tighter font-medium">
                {isAdmin ? 'Property Owner' : 'Guest'}
              </span>
            </div>
          )}

          {showLabel && (
            <ChevronUp className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align={showLabel ? "center" : "end"} 
        side={showLabel ? "top" : "right"} 
        // Prevents focus from sticking to the trigger after closing
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-64 p-2 mb-2 shadow-2xl border-zinc-200 dark:border-zinc-800 rounded-xl"
      >
        <div className="flex items-center gap-3 px-2 py-2.5 mb-1">
          <div className="h-10 w-10 rounded-lg overflow-hidden bg-orange-600 flex items-center justify-center shrink-0 shadow-sm">
             {user.imageUrl ? (
                <Image src={user.imageUrl} alt="Avatar" width={40} height={40} className="object-cover" />
             ) : (
                <span className="text-white font-bold">{user.firstName?.[0]}</span>
             )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user.fullName}</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate leading-none mt-1">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
        
        <DropdownMenuSeparator className="mx-1" />

        <div className="space-y-1 mt-1">
            <DropdownMenuItem asChild className="rounded-lg">
                <Link href={dashboardUrl} className="flex items-center gap-2 cursor-pointer py-2 font-semibold text-zinc-700 dark:text-zinc-300">
                    <User className="h-4 w-4" />
                    Dashboard
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="rounded-lg">
                <Link href={settingsUrl} className="flex items-center gap-2 cursor-pointer py-2 font-semibold text-zinc-700 dark:text-zinc-300">
                    <Settings className="h-4 w-4" />
                    Account Settings
                </Link>
            </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="mx-1" />

        <DropdownMenuItem
          onClick={() => signOut(() => router.push('/'))}
          className="flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer py-2 mt-1 font-semibold rounded-lg focus-visible:bg-red-50 dark:focus-visible:bg-red-950/30"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}