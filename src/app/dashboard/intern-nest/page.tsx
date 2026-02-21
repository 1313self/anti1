"use client";

import { motion } from "framer-motion";
import {
    Users, ArrowLeft, Briefcase, BookOpen, Lightbulb,
    CheckCircle2, ExternalLink, Star, Linkedin, Github,
    FileText, Network, MessageCircle, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const tips = [
    {
        icon: FileText,
        color: "indigo",
        title: "Craft Your Resume",
        steps: [
            "Keep it to one page — recruiters spend ~7 seconds",
            "Lead with a strong summary that targets the role",
            "Quantify every achievement (e.g., 'increased X by 30%')",
            "Match keywords from the job description",
            "Use clean, ATS-friendly formatting (no tables, graphics)",
        ]
    },
    {
        icon: Network,
        color: "blue",
        title: "Build Your Network",
        steps: [
            "Connect with alumni — they're your biggest asset",
            "Attend on-campus career fairs every semester",
            "Follow companies on LinkedIn before applying",
            "Send personalised connection requests, not generic ones",
            "Use EraConnect's Discovery Engine to find peers",
        ]
    },
    {
        icon: MessageCircle,
        color: "emerald",
        title: "Ace the Interview",
        steps: [
            "Research the company's mission, product, and culture",
            "Prepare 5 STAR-format behavior stories",
            "Practice out loud — not just in your head",
            "Prepare 3 thoughtful questions for your interviewer",
            "Send a thank-you email within 24 hours",
        ]
    },
    {
        icon: TrendingUp,
        color: "amber",
        title: "Stand Out Online",
        steps: [
            "Optimize your LinkedIn headline with keywords",
            "Pin 2-3 best projects to your GitHub profile",
            "Write one LinkedIn article about something you learned",
            "Engage on industry posts — visibility matters",
            "Build a simple portfolio website (free: Vercel, Netlify)",
        ]
    },
];

const resources = [
    { name: "LinkedIn Learning", desc: "Free with student email at many universities", icon: "💼", href: "https://linkedin.com/learning" },
    { name: "Coursera Financial Aid", desc: "Apply for full scholarship on any course", icon: "🎓", href: "https://coursera.org" },
    { name: "Google Career Certificates", desc: "Industry-recognized, job-ready certs", icon: "🔍", href: "https://grow.google/certificates" },
    { name: "GitHub Student Pack", desc: "Free dev tools worth thousands", icon: "🐙", href: "https://education.github.com/pack" },
    { name: "Internshala", desc: "India's #1 internship marketplace (free)", icon: "🚀", href: "https://internshala.com" },
    { name: "Forage", desc: "Free virtual work experience programs", icon: "⚡", href: "https://theforage.com" },
];

const colors: Record<string, string> = {
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
};

export default function InternNestPage() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

            <main className="max-w-6xl mx-auto relative z-10 space-y-12">
                {/* Header */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 py-4 md:py-8">
                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-muted-foreground font-heading font-black uppercase tracking-[0.3em] text-[10px] p-0 hover:bg-transparent hover:text-primary transition-all flex items-center gap-2">
                                <ArrowLeft className="w-3 h-3" />
                                Hub Dashboard
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl relative overflow-hidden shrink-0">
                                <Users className="w-6 h-6 md:w-8 md:h-8 text-white z-10" />
                                <div className="absolute inset-0 bg-white/10 -rotate-45 translate-y-8" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tighter uppercase text-foreground truncate">Intern <span className="text-gradient">Nest</span></h1>
                                <p className="text-muted-foreground font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold">Your Internship Command Centre</p>
                            </div>
                        </div>
                    </div>
                    <Link href="/dashboard/hustle">
                        <Button className="bg-primary text-white hover:bg-primary/90 rounded-2xl px-8 h-14 font-black uppercase text-[10px] tracking-widest shadow-neon transition-all hover:scale-105">
                            <Briefcase className="w-4 h-4 mr-2" />
                            Browse Hustle Board
                        </Button>
                    </Link>
                </header>

                {/* Checklist Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden border-primary/20"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.4em]">
                                <Star className="w-3 h-3" /> Internship Readiness
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-foreground">
                                Land Your <span className="text-gradient">First Role</span>
                            </h2>
                            <p className="text-muted-foreground text-sm font-medium max-w-md leading-relaxed">
                                A complete playbook — resume, networking, interview prep, and free tools. Everything you need, curated for campus students.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 text-sm font-bold text-foreground shrink-0">
                            {["Complete profile on EraConnect", "Build 1 project to show", "Connect with 5 alumni", "Apply to 3 gigs this week"].map(item => (
                                <div key={item} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                    <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Tips Grid */}
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-6">Playbook</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {tips.map((tip, i) => (
                            <motion.div
                                key={tip.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="glass-card rounded-[2rem] p-8 space-y-5"
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[tip.color]}`}>
                                    <tip.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-foreground">{tip.title}</h3>
                                <ul className="space-y-3">
                                    {tip.steps.map((step, j) => (
                                        <li key={j} className="flex items-start gap-3">
                                            <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[9px] font-black text-muted-foreground shrink-0 mt-0.5">{j + 1}</span>
                                            <span className="text-[11px] md:text-xs font-medium text-muted-foreground leading-snug">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Free Resources */}
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground mb-6">Free Resources</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {resources.map((r, i) => (
                            <motion.a
                                key={r.name}
                                href={r.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.06 }}
                                className="glass-card rounded-[1.5rem] p-6 space-y-3 group flex flex-col"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl">{r.icon}</span>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <p className="font-black text-foreground uppercase tracking-tight text-sm group-hover:text-primary transition-colors">{r.name}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 leading-snug">{r.desc}</p>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
