'use client';

import { ReactNode } from 'react';

export default function AdminMainContent({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  );
}
