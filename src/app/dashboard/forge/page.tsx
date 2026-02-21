"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal, Plus, Users as UsersIcon,
    ArrowLeft, Rocket, Code, Lightbulb, Target,
    Sparkles, X, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getProjects, createProject, getMyForgeRequests, requestToJoin } from "../featureActions";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast";

type ProjectStatus = "Ideation" | "Development" | "Prototyping" | "Launched";

const STATUS_STYLES: Record<string, string> = {
    Ideation: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    Development: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    Prototyping: "bg-purple-500/10 border-purple-500/20 text-purple-500",
    Launched: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
};

export default function ForgePage() {
    const { toast } = useToast();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [myRequests, setMyRequests] = useState<{ project_id: string; status: string }[]>([]);

    // Initiate project modal
    const [showInitiateModal, setShowInitiateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newProject, setNewProject] = useState({ name: "", vision: "", type: "Software", needs: "", status: "Ideation" });

    // Join request modal
    const [joinTarget, setJoinTarget] = useState<any>(null);
    const [joinMessage, setJoinMessage] = useState("");
    const [joining, setJoining] = useState(false);

    const loadProjects = async () => {
        setLoading(true);
        const result = await getProjects();
        if (result.success) setProjects(result.projects || []);
        setLoading(false);
    };

    useEffect(() => {
        loadProjects();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setCurrentUser(user);
                getMyForgeRequests(user.id).then(setMyRequests);
            }
        });
    }, []);

    const getRequestStatus = (projectId: string) =>
        myRequests.find(r => r.project_id === projectId)?.status;

    const handleInitiate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { toast("Please log in.", "error"); return; }

            const result = await createProject({
                ...newProject,
                needs: newProject.needs.split(",").map(n => n.trim()).filter(n => n !== ""),
                user_id: user.id
            });

            if (result.success) {
                setShowInitiateModal(false);
                setNewProject({ name: "", vision: "", type: "Software", needs: "", status: "Ideation" });
                toast("Project initiated!", "success");
                loadProjects();
            } else {
                toast("Initiation failed: " + (result.error || "Unknown error"), "error");
            }
        } catch {
            toast("An error occurred.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleJoinRequest = async () => {
        if (!currentUser || !joinTarget) return;
        setJoining(true);
        const result = await requestToJoin(currentUser.id, joinTarget.id, joinMessage);
        if (result.success) {
            setMyRequests(prev => [...prev, { project_id: joinTarget.id, status: "pending" }]);
            toast("Join request sent!", "success");
            setJoinTarget(null);
            setJoinMessage("");
        } else {
            toast("Could not send request. " + (result.error || ""), "error");
        }
        setJoining(false);
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.03] blur-[120px] rounded-full" />

            <main className="max-w-6xl mx-auto relative z-10 space-y-12">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 py-4 md:py-8">
                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] p-0 hover:bg-transparent hover:text-primary transition-all flex items-center gap-2">
                                <ArrowLeft className="w-3 h-3" />
                                Hub Dashboard
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-secondary flex items-center justify-center shadow-xl relative overflow-hidden shrink-0">
                                <Terminal className="w-6 h-6 md:w-8 md:h-8 text-foreground z-10" />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-amber-500/20 blur-xl" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-foreground truncate">The <span className="text-gradient">Forge</span></h1>
                                <p className="text-muted-foreground font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold truncate">Innovation Incubator</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={() => setShowInitiateModal(true)}
                        className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 md:px-10 h-14 md:h-16 font-black uppercase text-[10px] md:text-xs tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Initiate Project
                    </Button>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                        <Terminal className="w-12 h-12 text-muted-foreground/20" />
                        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Firing Up Furnaces...</p>
                    </div>
                ) : projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <AnimatePresence mode="popLayout">
                            {projects.map((project, index) => {
                                const requestStatus = getRequestStatus(project.id);
                                const isOwn = currentUser?.id === project.lead_id;

                                return (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="h-full"
                                    >
                                        <Card className="glass-card rounded-[2rem] md:rounded-[2.5rem] overflow-hidden group border-white/5 shadow-lg h-full flex flex-col">
                                            <div className="p-6 md:p-8 space-y-4 md:space-y-6 flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${project.type === 'Software' ? 'bg-indigo-500/10 text-indigo-400' : project.type === 'Business' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                        {project.type === 'Software' ? <Code className="w-4 h-4 md:w-5 md:h-5" /> : project.type === 'Business' ? <Target className="w-4 h-4 md:w-5 md:h-5" /> : <Lightbulb className="w-4 h-4 md:w-5 md:h-5" />}
                                                    </div>
                                                    <Badge className={`font-black text-[8px] md:text-[9px] px-2 md:px-3 h-5 md:h-6 uppercase tracking-widest border ${STATUS_STYLES[project.status as ProjectStatus] || STATUS_STYLES.Ideation}`}>
                                                        {project.status}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-1 md:space-y-2">
                                                    <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight leading-none group-hover:text-primary transition-colors truncate">
                                                        {project.name}
                                                    </h2>
                                                    <p className="text-muted-foreground font-bold text-[9px] md:text-[10px] uppercase tracking-widest truncate">Project Lead</p>
                                                </div>

                                                <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed font-bold italic border-l-2 border-border pl-4 line-clamp-2 md:line-clamp-none">
                                                    &ldquo;{project.vision}&rdquo;
                                                </p>

                                                <div className="space-y-2 md:space-y-3">
                                                    <span className="text-[8px] md:text-[9px] font-black uppercase text-muted-foreground/50 tracking-[0.2em]">Seeking Talent:</span>
                                                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                                                        {project.needs?.map((skill: string) => (
                                                            <Badge key={skill} className="text-[7px] md:text-[8px] bg-secondary border-secondary text-muted-foreground font-black tracking-widest px-1.5 md:px-2 h-4 md:h-5 uppercase shadow-sm">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <CardContent className="px-6 md:px-8 pb-6 md:pb-8 pt-0 mt-auto">
                                                <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/5 gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex -space-x-1.5 md:-space-x-2">
                                                            {[...Array(Math.min(3, project.members_count || 1))].map((_, i) => (
                                                                <div key={i} className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[7px] md:text-[8px] font-black text-muted-foreground">
                                                                    {String.fromCharCode(65 + i)}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <span className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest">+{project.members_count || 1} Team</span>
                                                    </div>

                                                    {isOwn ? (
                                                        <Badge className="bg-primary/10 border-primary/20 text-primary font-black text-[8px] uppercase tracking-widest px-3 h-8">Your Project</Badge>
                                                    ) : requestStatus === "pending" ? (
                                                        <Badge className="bg-amber-500/10 border-amber-500/20 text-amber-500 font-black text-[8px] uppercase tracking-widest px-3 h-8">Pending</Badge>
                                                    ) : requestStatus === "accepted" ? (
                                                        <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 font-black text-[8px] uppercase tracking-widest px-3 h-8">Accepted</Badge>
                                                    ) : (
                                                        <Button
                                                            onClick={() => { if (!currentUser) { toast("Log in to join projects.", "error"); return; } setJoinTarget(project); }}
                                                            className="rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase text-[8px] md:text-[10px] tracking-widest px-4 md:px-6 h-10 md:h-12 shadow-lg"
                                                        >
                                                            Join
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                        <div className="w-24 h-24 rounded-[2rem] bg-secondary flex items-center justify-center border border-white/5 shadow-xl animate-float">
                            <Rocket className="w-10 h-10 text-amber-500" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Forge Is Cold</h3>
                            <p className="text-muted-foreground font-bold max-w-xs mx-auto text-[10px] uppercase tracking-widest leading-relaxed">No active innovation projects found. Great ventures start with a single initialization.</p>
                        </div>
                        <Button onClick={() => setShowInitiateModal(true)} className="bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl px-10 h-14 shadow-xl transition-all hover:scale-105">
                            <Plus className="w-4 h-4 mr-2" />
                            Initialize Project
                        </Button>
                    </div>
                )}
            </main>

            {/* Initiate Modal */}
            <AnimatePresence>
                {showInitiateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowInitiateModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-card/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 max-h-[90vh] overflow-y-auto">
                            <div className="p-8 md:p-10 space-y-8">
                                <div className="space-y-2 text-center">
                                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Initiate Project</h2>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Start your journey in the Forge</p>
                                </div>

                                <form onSubmit={handleInitiate} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Project Name</label>
                                            <Input required value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} placeholder="E.G. AI STUDY BUDDY" className="rounded-xl border-white/10 bg-secondary/50 h-12 text-xs uppercase font-bold tracking-widest text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Vision / Description</label>
                                            <textarea required value={newProject.vision} onChange={e => setNewProject({ ...newProject, vision: e.target.value })} placeholder="DESCRIBE YOUR VISION..." className="w-full rounded-xl border border-white/10 p-4 text-xs font-bold tracking-widest outline-none bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px] resize-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Type</label>
                                                <select value={newProject.type} onChange={e => setNewProject({ ...newProject, type: e.target.value })} className="w-full rounded-xl border border-white/10 h-12 text-xs uppercase font-bold tracking-widest px-3 bg-secondary/50 text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer">
                                                    <option>Software</option><option>Hardware</option><option>Business</option><option>Research</option><option>Social</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status</label>
                                                <select value={newProject.status} onChange={e => setNewProject({ ...newProject, status: e.target.value })} className="w-full rounded-xl border border-white/10 h-12 text-xs uppercase font-bold tracking-widest px-3 bg-secondary/50 text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer">
                                                    <option>Ideation</option><option>Development</option><option>Prototyping</option><option>Launched</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Seeking Talent (Skills needed)</label>
                                            <Input value={newProject.needs} onChange={e => setNewProject({ ...newProject, needs: e.target.value })} placeholder="E.G. REACT, MARKETING, UI/UX" className="rounded-xl border-white/10 bg-secondary/50 h-12 text-xs uppercase font-bold tracking-widest text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <Button type="button" variant="ghost" onClick={() => setShowInitiateModal(false)} className="flex-1 rounded-xl h-14 uppercase font-black text-[10px] tracking-widest text-muted-foreground hover:bg-white/5">Cancel</Button>
                                        <Button disabled={submitting} className="flex-1 rounded-xl h-14 bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-neon hover:scale-105 transition-all">
                                            {submitting ? "Processing..." : "Ignite Forge"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Join Request Modal */}
            <AnimatePresence>
                {joinTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setJoinTarget(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-card/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
                            <div className="p-8 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Request to Join</h2>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{joinTarget.name}</p>
                                    </div>
                                    <button onClick={() => setJoinTarget(null)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Why do you want to join? (Optional)</label>
                                    <textarea
                                        value={joinMessage}
                                        onChange={e => setJoinMessage(e.target.value)}
                                        placeholder="Briefly introduce yourself and what you bring to the project..."
                                        className="w-full rounded-xl border border-white/10 bg-secondary/50 p-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px] resize-none"
                                        maxLength={400}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="ghost" onClick={() => setJoinTarget(null)} className="flex-1 rounded-xl h-12 uppercase font-bold text-[10px] tracking-widest text-muted-foreground hover:bg-white/5">Cancel</Button>
                                    <Button onClick={handleJoinRequest} disabled={joining} className="flex-1 rounded-xl h-12 bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-neon hover:scale-105 transition-all">
                                        {joining ? "Sending..." : <><Send className="w-3.5 h-3.5 mr-2" />Send Request</>}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
