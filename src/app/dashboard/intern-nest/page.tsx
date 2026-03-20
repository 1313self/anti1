"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, ArrowLeft, Briefcase, Star, ExternalLink, 
    CheckCircle2, Globe, Github, Linkedin, Sparkles,
    ShieldCheck, Calendar, MapPin, Zap, Plus, Info, MessageSquare, Building2, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getGigs, applyToGig, createGig, getMyApplications, toggleBookmark, getBookmarkedGigIds } from "../featureActions";
import { useToast } from "@/components/ui/toast";
import { getStudentRepos, GithubRepo } from "@/lib/github";

export default function InternNestPage() {
    const { toast } = useToast();
    const [gigs, setGigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);
    const [reposLoading, setReposLoading] = useState(false);
    
    // Application & Posting State
    const [showApplyModal, setShowApplyModal] = useState<any>(null);
    const [applyMessage, setApplyMessage] = useState("");
    const [appliedGigIds, setAppliedGigIds] = useState<string[]>([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newGig, setNewGig] = useState({
        role: "",
        company: "",
        type: "Internship",
        compensation: "",
        deadline: "",
        description: "",
        tags: "",
        hot: false
    });

    useEffect(() => {
        async function init() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUser(user);
                
                // Fetch profile for GitHub username
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                
                if (profile) {
                    setUserProfile(profile);
                    if (profile.github_username) {
                        fetchRepos(profile.github_username);
                    }
                }

                // Initial data loads
                const [gigsRes, appsRes] = await Promise.all([
                    getGigs(),
                    getMyApplications(user.id)
                ]);

                if (gigsRes.success) setGigs(gigsRes.gigs || []);
                setAppliedGigIds(appsRes || []);
            }
            setLoading(false);
        }
        init();
    }, []);

    const fetchRepos = async (username: string) => {
        setReposLoading(true);
        const repos = await getStudentRepos(username);
        setGithubRepos(repos);
        setReposLoading(false);
    };

    const handleApply = async () => {
        if (!currentUser || !showApplyModal) return;
        setSubmitting(true);
        const result = await applyToGig(showApplyModal.id, currentUser.id, applyMessage);
        if (result.success) {
            setAppliedGigIds(prev => [...prev, showApplyModal.id]);
            setShowApplyModal(null);
            setApplyMessage("");
            toast("Application transmitted to recruiter.", "success");
        } else {
            toast("Transmission failed.", "error");
        }
        setSubmitting(false);
    };

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        setSubmitting(true);
        const result = await createGig({
            ...newGig,
            tags: newGig.tags.split(",").map(t => t.trim()).filter(t => t !== ""),
            user_id: currentUser.id
        });
        if (result.success) {
            setShowPostModal(false);
            setNewGig({ role: "", company: "", type: "Internship", compensation: "", deadline: "", description: "", tags: "", hot: false });
            toast("Opportunity deployed to the hub.", "success");
            const gigsRes = await getGigs();
            if (gigsRes.success) setGigs(gigsRes.gigs || []);
        } else {
            toast("Deployment failed.", "error");
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

            <main className="max-w-6xl mx-auto relative z-10 space-y-12 md:space-y-16 flex-1 w-full">
                {/* Header */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-4">
                    <div className="space-y-6">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] p-0 hover:bg-transparent hover:text-primary transition-all flex items-center gap-2">
                                <ArrowLeft className="w-3 h-3" />
                                Synergy Hub
                            </Button>
                        </Link>
                        <div className="space-y-2">
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-foreground leading-[0.8] mb-2">
                                Intern <span className="text-gradient">Nest</span>
                            </h1>
                            <p className="text-muted-foreground font-bold text-[10px] md:text-xs uppercase tracking-[0.4em]">Integrated Career Command</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setShowPostModal(true)}
                            variant="outline"
                            className="rounded-2xl border-white/10 px-8 h-16 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Post Opportunity
                        </Button>
                        <div className="hidden md:flex flex-col items-end border-l border-border pl-6 ml-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Global Ops</span>
                            <span className="text-3xl font-black text-foreground">{gigs.length}</span>
                        </div>
                    </div>
                </header>

                {/* GitHub Verification Section */}
                <section className={`glass-card rounded-[3rem] p-8 md:p-10 relative overflow-hidden border-primary/20 shadow-neon transition-all ${!userProfile?.github_username ? "opacity-90 grayscale-[0.5]" : ""}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center">
                        <div className="space-y-4 flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest">
                                <ShieldCheck className="w-3 h-3" /> Skill-Proof Protocol
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter uppercase text-foreground leading-none">
                                {userProfile?.github_username ? "Verified" : "Unlock"} <span className="text-gradient">Moat.</span>
                            </h2>
                            <p className="text-muted-foreground text-[11px] font-medium max-w-sm leading-relaxed mx-auto lg:mx-0">
                                {userProfile?.github_username 
                                    ? `Logged in as @${userProfile.github_username}. Your top technical assets are being transmitted to recruiters.`
                                    : "Link your GitHub in Profile to activate live project verification and priority placement."
                                }
                            </p>
                            {!userProfile?.github_username && (
                                <Link href="/dashboard/profile">
                                    <Button className="mt-2 rounded-xl bg-foreground text-background px-8 h-12 font-black uppercase text-[9px] tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95">
                                        <Github className="w-3 h-3 mr-2" /> Link GitHub
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Recent Repos */}
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {reposLoading ? (
                                [1, 2].map(i => <div key={i} className="bg-background/40 h-24 rounded-2xl animate-pulse" />)
                            ) : githubRepos.length > 0 ? (
                                githubRepos.slice(0, 2).map(repo => (
                                    <div key={repo.name} className="bg-background/40 backdrop-blur-md rounded-2xl p-5 border border-white/5 flex flex-col justify-between group">
                                        <div className="flex items-start justify-between">
                                            <h4 className="text-[11px] font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors truncate w-3/4">{repo.name}</h4>
                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        </div>
                                        <div className="flex items-center gap-2 text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
                                            <div className="w-2 h-2 rounded-full bg-primary" /> {repo.language || "Web"}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 bg-background/20 rounded-2xl p-6 border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                                    <Github className="w-6 h-6 text-muted-foreground/30 mb-2" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">No Data Transmitted</span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Opportunity Grid */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Zap className="w-4 h-4 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Live Hub Gigs</h2>
                        </div>
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/20 text-primary px-3 h-6">Active Sync</Badge>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <div key={i} className="glass-card h-64 rounded-[2rem] animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gigs.length > 0 ? gigs.map((gig, i) => (
                                <motion.div
                                    key={gig.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card rounded-[2rem] p-7 border-border hover:border-primary/20 transition-all group flex flex-col h-full"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-sm font-black border border-white/5">
                                                {gig.company[0]}
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-0.5">{gig.type}</p>
                                                <h3 className="text-md font-black text-foreground uppercase tracking-tight truncate max-w-[120px]">{gig.company}</h3>
                                            </div>
                                        </div>
                                        {gig.hot && <Badge className="bg-primary/20 text-primary border-0 text-[7px] font-black animate-pulse px-2 h-5">HOT</Badge>}
                                    </div>
                                    <div className="space-y-1 mb-6 flex-grow">
                                        <p className="text-sm font-bold text-foreground leading-tight">{gig.title || gig.role}</p>
                                        <div className="flex items-center gap-2 text-muted-foreground text-[9px] font-bold uppercase tracking-widest">
                                            <p className="truncate w-full">{gig.compensation || "Competitive"}</p>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => setShowApplyModal(gig)}
                                        disabled={appliedGigIds.includes(gig.id)}
                                        variant="secondary" 
                                        className={`w-full rounded-xl h-11 font-black uppercase text-[9px] tracking-widest border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all ${appliedGigIds.includes(gig.id) ? "opacity-50" : ""}`}
                                    >
                                        {appliedGigIds.includes(gig.id) ? "Applied ✓" : <>Initiate Application <ArrowLeft className="w-3 h-3 ml-2 rotate-180" /></>}
                                    </Button>
                                </motion.div>
                            )) : (
                                <div className="col-span-full py-20 text-center glass-card rounded-[2rem] border-dashed">
                                    <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">No active gigs in orbit.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>

            {/* Post Modal */}
            <AnimatePresence>
                {showPostModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPostModal(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-card rounded-[2.5rem] border border-border p-8 shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]">
                            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-6">Deploy Opportunity</h2>
                            <form onSubmit={handlePost} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input required placeholder="ROLE TITLE" value={newGig.role} onChange={e => setNewGig({...newGig, role: e.target.value})} className="h-12 rounded-xl bg-secondary/50 border-border text-[10px] font-black uppercase" />
                                    <Input required placeholder="COMPANY NAME" value={newGig.company} onChange={e => setNewGig({...newGig, company: e.target.value})} className="h-12 rounded-xl bg-secondary/50 border-border text-[10px] font-black uppercase" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <select value={newGig.type} onChange={e => setNewGig({...newGig, type: e.target.value})} className="h-12 w-full rounded-xl bg-secondary/50 border border-border text-[10px] font-black uppercase px-4 outline-none appearance-none">
                                        <option>Internship</option>
                                        <option>Freelance</option>
                                        <option>One-time</option>
                                        <option>Part-time</option>
                                    </select>
                                    <Input required placeholder="COMPENSATION (e.g. $20/hr)" value={newGig.compensation} onChange={e => setNewGig({...newGig, compensation: e.target.value})} className="h-12 rounded-xl bg-secondary/50 border-border text-[10px] font-black uppercase" />
                                </div>
                                <textarea required placeholder="DESCRIPTION & REQUIREMENTS..." value={newGig.description} onChange={e => setNewGig({...newGig, description: e.target.value})} className="w-full h-32 rounded-xl bg-secondary/50 border border-border p-4 text-[10px] font-bold outline-none resize-none" />
                                <Input placeholder="TAGS (REACT, DESIGN...)" value={newGig.tags} onChange={e => setNewGig({...newGig, tags: e.target.value})} className="h-12 rounded-xl bg-secondary/50 border-border text-[10px] font-black uppercase" />
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" checked={newGig.hot} onChange={e => setNewGig({...newGig, hot: e.target.checked})} className="w-4 h-4 rounded bg-secondary border-border" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mark as Hot Opportunity</span>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setShowPostModal(false)} className="flex-1 h-12 rounded-xl uppercase font-black text-[10px]">Cancel</Button>
                                    <Button disabled={submitting} className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase text-[10px] shadow-neon">
                                        {submitting ? "Deploying..." : "Transmit"}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Apply Modal */}
            <AnimatePresence>
                {showApplyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowApplyModal(null)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-card rounded-[2.5rem] border border-border p-8 shadow-2xl">
                            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground mb-2">Initiate Apply</h2>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Position: {showApplyModal.title || showApplyModal.role}</p>
                            <textarea 
                                value={applyMessage} 
                                onChange={e => setApplyMessage(e.target.value)}
                                placeholder="YOUR VALUE PROPOSITION (MIN 20 CHARS)..." 
                                className="w-full h-40 rounded-xl bg-secondary/50 border border-border p-5 text-[11px] font-bold outline-none resize-none mb-6"
                            />
                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => setShowApplyModal(null)} className="flex-1 h-14 rounded-xl uppercase font-black text-[10px]">Cancel</Button>
                                <Button 
                                    disabled={submitting || applyMessage.length < 20} 
                                    onClick={handleApply}
                                    className="flex-1 h-14 rounded-xl bg-primary text-primary-foreground font-black uppercase text-[10px] shadow-neon"
                                >
                                    {submitting ? "Transmitting..." : "Send Protocol"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <div className="h-20" />
        </div>
    );
}
