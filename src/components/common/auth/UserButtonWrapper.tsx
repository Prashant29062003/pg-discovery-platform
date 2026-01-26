'use client';

import dynamic from 'next/dynamic';

const DynamicUserButton = dynamic(
  () => import('@clerk/nextjs').then(mod => mod.UserButton),
  { 
    ssr: false,
    loading: () => <div className="w-10 h-10 rounded-full bg-slate-700" />
  }
);

interface UserButtonWrapperProps {
  afterSignOutUrl?: string;
}

export function UserButtonWrapper({ afterSignOutUrl = '/' }: UserButtonWrapperProps) {
  return <DynamicUserButton afterSignOutUrl={afterSignOutUrl} />;
}
