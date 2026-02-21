"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { createProfile } from "./actions";
import { supabase } from "@/lib/supabase";
import { updateSkills } from "@/app/dashboard/featureActions";
import {
    Code, Palette, LineChart, Scale, Dna, Mic2,
    Settings, Brain, Globe, Coffee, Book, Gamepad2,
    Activity, Utensils, Plane, Music, Camera,
    ChevronRight, Check, Sparkles, Loader2,
    UserCircle, Search, FileText, Wrench
} from "lucide-react";

const steps = [
    { id: 1, title: "Personal Info", description: "What's your name and focus?", icon: UserCircle },
    { id: 2, title: "Interests", description: "What are you studying?", icon: Search },
    { id: 3, title: "Your Story", description: "A quick intro about you.", icon: FileText },
    { id: 4, title: "Skills", description: "What do you bring to the table?", icon: Wrench },
    { id: 5, title: "Socials", description: "Connect beyond the platform.", icon: Globe },
];

const MAJOR_TAGS = [
    { id: "cs", label: "Computer Science", icon: Code },
    { id: "design", label: "Design", icon: Palette },
    { id: "business", label: "Business", icon: LineChart },
    { id: "law", label: "Law", icon: Scale },
    { id: "bio", label: "BioTech", icon: Dna },
    { id: "arts", label: "Fine Arts", icon: Mic2 },
    { id: "eng", label: "Engineering", icon: Settings },
    { id: "psych", label: "Psychology", icon: Brain },
    { id: "ir", label: "Intl Relations", icon: Globe },
];

const HOBBY_TAGS = [
    { id: "coffee", label: "Caffeine", icon: Coffee },
    { id: "read", label: "Reading", icon: Book },
    { id: "game", label: "Gaming", icon: Gamepad2 },
    { id: "fit", label: "Fitness", icon: Activity },
    { id: "cook", label: "Culinary", icon: Utensils },
    { id: "travel", label: "Voyager", icon: Plane },
    { id: "music", label: "Melody", icon: Music },
    { id: "foto", label: "Optics", icon: Camera },
];

const SKILL_OPTIONS = [
    "React", "Python", "Machine Learning", "UI/UX Design",
    "Finance", "Marketing", "Data Analysis", "Node.js",
    "Figma", "Research", "Content Writing", "Public Speaking",
    "DevOps", "Swift / iOS", "Android", "Video Editing",
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const { setPeakHours } = useTheme();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [resumeLoading, setResumeLoading] = useState(true);

    const [formData, setFormData] = useState({
        fullName: "",
        academicAim: "",
        hobbies: [] as string[],
        studyWindow: "",
        peakHours: "neutral" as 'morning' | 'night' | 'neutral',
        bio: "",
        skills: [] as string[],
        instagram: "",
        discord: "",
    });

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                // Restore step progress
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("onboarding_step, full_name, skills")
                    .eq("id", user.id)
                    .single();
                if (profile?.onboarding_step && profile.onboarding_step > 1) {
                    setCurrentStep(profile.onboarding_step);
                }
                if (profile?.full_name) setFormData(prev => ({ ...prev, fullName: profile.full_name }));
                if (profile?.skills) setFormData(prev => ({ ...prev, skills: profile.skills }));
            }
            setResumeLoading(false);
        }
        init();
    }, []);

    const saveStep = async (step: number) => {
        if (!user) return;
        await supabase.from("profiles").upsert({ id: user.id, onboarding_step: step }, { onConflict: "id" });
    };

    const nextStep = () => {
        const next = Math.min(currentStep + 1, steps.length);
        setCurrentStep(next);
        saveStep(next);
    };

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const toggleTag = (type: 'academicAim' | 'hobbies', tag: string) => {
        if (type === 'academicAim') {
            setFormData(prev => ({ ...prev, academicAim: tag }));
        } else {
            setFormData(prev => {
                const current = prev.hobbies;
                return { ...prev, hobbies: current.includes(tag) ? current.filter(h => h !== tag) : [...current, tag] };
            });
        }
    };

    const toggleSkill = (skill: string) => {
        setFormData(prev => {
            const s = prev.skills;
            return { ...prev, skills: s.includes(skill) ? s.filter(x => x !== skill) : [...s, skill] };
        });
    };

    const handlePeakHoursChange = (hours: 'morning' | 'night') => {
        setFormData({ ...formData, peakHours: hours });
        setPeakHours(hours);
    };

    const handleFinish = async () => {
        if (!user) { router.push("/login"); return; }
        setLoading(true);
        const result = await createProfile({
            userId: user.id,
            fullName: formData.fullName,
            academicAim: formData.academicAim,
            hobbies: formData.hobbies.join(", "),
            studyWindow: formData.studyWindow,
            peakHours: formData.peakHours,
            bio: formData.bio,
            instagram: formData.instagram,
            discord: formData.discord,
        });
        if (result.success) {
            // Save skills separately
            if (formData.skills.length > 0) {
                await updateSkills(user.id, formData.skills);
            }
            router.push("/dashboard");
        } else {
            alert("Error saving profile: " + result.error);
        }
        setLoading(false);
    };

    if (resumeLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 relative bg-background overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] blur-[120px] rounded-full" />

            {/* Branding */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-6 md:top-12 flex items-center gap-2"
            >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
                </div>
                <span className="text-lg md:text-xl font-black tracking-tighter uppercase text-foreground">EraConnect</span>
            </motion.div>

            <div className="w-full max-w-xl relative z-10 space-y-6 md:space-y-8 mt-12 md:mt-0">
                {/* Progress header */}
                <div className="text-center space-y-4 md:space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-secondary border border-border shadow-sm text-primary mb-1 md:mb-2"
                    >
                        {(() => {
                            const StepIcon = steps[currentStep - 1].icon;
                            return StepIcon ? <StepIcon className="w-5 h-5 md:w-6 md:h-6" /> : null;
                        })()}
                    </motion.div>
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter leading-none px-4">Complete Your Profile</h1>
                        <p className="text-muted-foreground font-mono text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em]">
                            Step {currentStep} of {steps.length} • {steps[currentStep - 1].title}
                        </p>
                    </div>

                    {/* Progress dots */}
                    <div className="flex items-center justify-center gap-2">
                        {steps.map((s, i) => (
                            <div key={s.id} className={`transition-all duration-300 rounded-full ${i + 1 === currentStep ? "w-6 h-2 bg-primary" : i + 1 < currentStep ? "w-2 h-2 bg-primary/50" : "w-2 h-2 bg-secondary"}`} />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="glass-card border-white/5 shadow-xl rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="text-center pb-2 md:pb-3 bg-secondary/20 border-b border-white/5">
                                <CardTitle className="text-lg md:text-xl font-black text-foreground uppercase tracking-tight">{steps[currentStep - 1].title}</CardTitle>
                                <CardDescription className="text-muted-foreground text-[10px] md:text-xs font-semibold">{steps[currentStep - 1].description}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-10 space-y-6 md:space-y-8">

                                {/* Step 1 – Personal Info */}
                                {currentStep === 1 && (
                                    <div className="space-y-6 md:space-y-8">
                                        <div className="space-y-3">
                                            <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest">Full Name</Label>
                                            <Input
                                                placeholder="Enter your name..."
                                                className="input-glow-bottom text-xl md:text-2xl font-black text-foreground placeholder:text-muted-foreground/40 h-12 md:h-14"
                                                value={formData.fullName}
                                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                autoFocus
                                            />
                                        </div>
                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest">Study Preference</Label>
                                            <div className="flex gap-3 md:gap-4">
                                                <Button variant="outline" className={`flex-1 h-20 md:h-24 rounded-2xl md:rounded-3xl border-border transition-all relative overflow-hidden ${formData.peakHours === 'morning' ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400' : 'hover:bg-secondary/50'}`} onClick={() => handlePeakHoursChange('morning')}>
                                                    <div className="flex flex-col items-center gap-1 md:gap-2">
                                                        <span className="text-xl md:text-2xl">☀️</span>
                                                        <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${formData.peakHours === 'morning' ? 'text-amber-500' : 'text-muted-foreground'}`}>Early Bird</span>
                                                    </div>
                                                </Button>
                                                <Button variant="outline" className={`flex-1 h-20 md:h-24 rounded-2xl md:rounded-3xl border-border transition-all relative overflow-hidden ${formData.peakHours === 'night' ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'hover:bg-secondary/50'}`} onClick={() => handlePeakHoursChange('night')}>
                                                    <div className="flex flex-col items-center gap-1 md:gap-2">
                                                        <span className="text-xl md:text-2xl">🌙</span>
                                                        <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${formData.peakHours === 'night' ? 'text-primary' : 'text-muted-foreground'}`}>Night Owl</span>
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2 – Interests */}
                                {currentStep === 2 && (
                                    <div className="space-y-6 md:space-y-8 max-h-[350px] md:max-h-[450px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest">Your Major</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
                                                {MAJOR_TAGS.map(tag => (
                                                    <button key={tag.id} onClick={() => toggleTag('academicAim', tag.label)} className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 ${formData.academicAim === tag.label ? 'bg-primary/10 border-primary/30' : 'border-border hover:border-border/80 opacity-60 hover:opacity-100'}`}>
                                                        <div className={`p-1.5 md:p-2 rounded-lg ${formData.academicAim === tag.label ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                                                            <tag.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                        </div>
                                                        <span className={`text-[10px] md:text-xs font-black uppercase tracking-tight ${formData.academicAim === tag.label ? 'text-primary' : 'text-muted-foreground'}`}>{tag.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest">Interests</Label>
                                            <div className="flex flex-wrap gap-1.5 md:gap-2">
                                                {HOBBY_TAGS.map(tag => (
                                                    <button key={tag.id} onClick={() => toggleTag('hobbies', tag.label)} className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full border text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${formData.hobbies.includes(tag.label) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'border-border text-muted-foreground hover:border-border/80'}`}>
                                                        <tag.icon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                        {tag.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3 – Bio + Study Hours */}
                                {currentStep === 3 && (
                                    <div className="space-y-6 md:space-y-8">
                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest">About You</Label>
                                            <textarea
                                                className="w-full h-32 md:h-44 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-secondary/30 border-2 border-border text-foreground font-medium text-base md:text-lg focus:border-primary focus:bg-card outline-none transition-all resize-none shadow-inner"
                                                placeholder="Tell us what you're working on or what you're looking for in a collaborator..."
                                                value={formData.bio}
                                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest">Typically Studying Hours</Label>
                                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                                {['2-3 HOURS', '4-5 HOURS', '6+ HOURS', 'FLEXIBLE'].map(choice => (
                                                    <Button key={choice} variant="outline" className={`h-12 md:h-16 rounded-xl md:rounded-2xl border-border font-black text-[8px] md:text-[10px] tracking-widest uppercase transition-all ${formData.studyWindow === choice ? 'border-primary bg-primary/10 ring-1 ring-primary text-primary' : 'hover:bg-secondary/50 text-muted-foreground'}`} onClick={() => setFormData({ ...formData, studyWindow: choice })}>
                                                        {choice}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4 – Skills */}
                                {currentStep === 4 && (
                                    <div className="space-y-4">
                                        <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest">Pick your skills (select all that apply)</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {SKILL_OPTIONS.map(skill => (
                                                <button
                                                    key={skill}
                                                    onClick={() => toggleSkill(skill)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.skills.includes(skill)
                                                        ? "bg-primary text-white border-primary shadow-md"
                                                        : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                                        }`}
                                                >
                                                    {formData.skills.includes(skill) && <Check className="w-3 h-3" />}
                                                    {skill}
                                                </button>
                                            ))}
                                        </div>
                                        {formData.skills.length > 0 && (
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                {formData.skills.length} skill{formData.skills.length > 1 ? "s" : ""} selected
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Step 5 – Socials */}
                                {currentStep === 5 && (
                                    <div className="space-y-6 md:space-y-8">
                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                                <span className="text-lg">📸</span> Instagram (Optional)
                                            </Label>
                                            <Input
                                                placeholder="https://instagram.com/yourprofile"
                                                className="input-glow-bottom text-base md:text-lg font-black text-foreground placeholder:text-muted-foreground/40 h-12 md:h-14"
                                                value={formData.instagram}
                                                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                            />
                                            <p className="text-[10px] text-muted-foreground font-medium">We'll link this to your discovery card.</p>
                                        </div>
                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-muted-foreground uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                                <span className="text-lg">💬</span> Discord (Optional)
                                            </Label>
                                            <Input
                                                placeholder="username or invite link"
                                                className="input-glow-bottom text-base md:text-lg font-black text-foreground placeholder:text-muted-foreground/40 h-12 md:h-14"
                                                value={formData.discord}
                                                onChange={e => setFormData({ ...formData, discord: e.target.value })}
                                            />
                                            <p className="text-[10px] text-muted-foreground font-medium">Share your handle or a server invite.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex gap-3 md:gap-4 pt-2 md:pt-4">
                                    <Button variant="ghost" onClick={prevStep} disabled={currentStep === 1} className="flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl bg-secondary/50 text-muted-foreground font-black uppercase text-[10px] tracking-widest hover:bg-secondary">
                                        Back
                                    </Button>
                                    {currentStep < steps.length ? (
                                        <Button onClick={nextStep} className="flex-2 h-12 md:h-14 rounded-xl md:rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest hover:bg-primary/90 shadow-lg">
                                            Next <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    ) : (
                                        <Button onClick={handleFinish} disabled={loading || !formData.bio || !formData.fullName} className="flex-2 h-12 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finish Setup"}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            {currentStep === 5 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute bottom-8 text-center space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">EraConnect Engineering</p>
                    <p className="text-[11px] font-bold text-muted-foreground">
                        Developer And Founder <span className="text-primary font-black">Divyansh Thakur</span>
                    </p>
                </motion.div>
            )}

            <style jsx global>{`
              .custom-scrollbar::-webkit-scrollbar { width: 5px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 10px; }
            `}</style>
        </div>
    );
}
