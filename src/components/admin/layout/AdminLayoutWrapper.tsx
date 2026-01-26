'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

export default function AdminLayoutWrapper({ children }: { children: ReactNode }) {
    const { isOpen } = useSidebar();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 selection:bg-orange-100 selection:text-orange-900">

            {/* Fixed Sidebar */}
            <AdminSidebar />

            {/* Main Layout */}
            <div
                className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'md:ml-64' : 'md:ml-20'}`}
            >
                <AdminNavbar />

                <main className="flex-1 px-4 md:px-8 pb-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full py-5">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}