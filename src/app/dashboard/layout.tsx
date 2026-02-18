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
        <div className="min-h-screen bg-[#030712] text-white">
            {/* Top Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 h-16 flex items-center px-6 justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gradient">EraConnect</span>
                </div>

                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant="ghost"
                                className={`flex items-center gap-2 rounded-xl transition-all duration-300 ${pathname === item.href ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </Button>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full bg-white/5 border border-white/10 hover:bg-white/10">
                        <User className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {children}
            </main>

            {/* Mobile Navbar */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 h-16 md:hidden flex items-center justify-around px-2">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-xl ${pathname === item.href ? "text-purple-500" : "text-white/40"}`}
                        >
                            <item.icon className="w-6 h-6" />
                        </Button>
                    </Link>
                ))}
            </footer>
        </div>
    );
}
