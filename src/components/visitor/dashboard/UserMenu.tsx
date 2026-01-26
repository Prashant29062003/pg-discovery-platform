'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from 'lucide-react';

export default function UserMenu() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server or before hydration completes
  if (!mounted || !isLoaded || !user) {
    // Render skeleton placeholder to match button dimensions
    return (
      <Button variant="ghost" className="rounded-full h-10 w-10 p-0 cursor-pointer" disabled>
        <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      </Button>
    );
  }

  const userRole = (user.publicMetadata as any)?.role;
  const dashboardUrl = userRole === 'owner' ? '/admin' : '/visitor/dashboard';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full h-10 w-10 p-0 cursor-pointer">
          <div aria-label='user-login' className="h-8 w-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">
            {user.firstName?.[0]?.toUpperCase()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{user.fullName}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardUrl} className="cursor-pointer gap-2">
            <User className="h-4 w-4" />
            {userRole === 'owner' ? 'Admin Dashboard' : 'My Dashboard'}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut(() => router.push('/'))}
          className="text-red-600 dark:text-red-400 cursor-pointer gap-2"
        >
          <LogOut className="h-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
