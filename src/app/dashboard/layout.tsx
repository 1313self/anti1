"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Library,
    Terminal,
    Briefcase,
    Users,
    MessageSquare,
    Sparkles,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
    { name: "Discovery Engine", href: "/dashboard/discovery", icon: Sparkles },
    { name: "The Library", href: "/dashboard/library", icon: Library },
    { name: "The Forge", href: "/dashboard/forge", icon: Terminal },
    { name: "The Hustle", href: "/dashboard/hustle", icon: Briefcase },
    { name: "The Intern Nest", href: "/dashboard/intern-nest", icon: Users },
    { name: "The Lounge", href: "/dashboard/lounge", icon: MessageSquare },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Top Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-100 h-14 md:h-16 flex items-center px-4 md:px-6 justify-between shadow-sm">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <span className="text-base md:text-xl font-black text-slate-900 tracking-tighter uppercase truncate">EraConnect</span>
                </div>

                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant="ghost"
                                className={`flex items-center gap-2 rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${pathname === item.href ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-indigo-600 hover:bg-slate-50"}`}
                            >
                                <item.icon className="w-3 h-3" />
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 md:gap-4">
                    <Link href="/dashboard/profile">
                        <Button variant="ghost" size="icon" className="w-8 h-8 md:w-10 md:h-10 rounded-xl border border-slate-100 hover:bg-slate-50">
                            <User className="w-4 h-4 text-slate-600" />
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-18 md:pt-24 pb-20 md:pb-12 px-4 md:px-6 max-w-7xl mx-auto overflow-x-hidden">
                {children}
            </main>

            {/* Mobile Navbar */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-100 h-16 md:hidden flex items-center justify-between px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] overflow-x-auto no-scrollbar">
                <div className="flex items-center justify-around w-full min-w-max px-2 gap-1">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`w-12 h-12 rounded-xl transition-all ${pathname === item.href ? "text-indigo-600 bg-indigo-50/50" : "text-slate-300 hover:text-indigo-400"}`}
                            >
                                <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                            </Button>
                        </Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
