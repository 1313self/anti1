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
import {
    Code, Palette, LineChart, Scale, Dna, Mic2,
    Settings, Brain, Globe, Coffee, Book, Gamepad2,
    Activity, Utensils, Plane, Music, Camera, Terminal,
    ChevronRight, ChevronLeft, Check, Sparkles, Loader2
} from "lucide-react";

const steps = [
    { id: 1, title: "Personal Info", description: "What's your name?" },
    { id: 2, title: "Interests", description: "What are you studying and what do you like?" },
    { id: 3, title: "Bio", description: "A quick intro about you." },
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

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const { setPeakHours } = useTheme();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        academicAim: "", // Will be selected from tags
        hobbies: [] as string[],
        studyWindow: "",
        peakHours: "neutral" as 'morning' | 'night' | 'neutral',
        bio: "",
    });

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user);
            }
        });
    }, []);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const toggleTag = (type: 'academicAim' | 'hobbies', tag: string) => {
        if (type === 'academicAim') {
            setFormData(prev => ({ ...prev, academicAim: tag }));
        } else {
            setFormData(prev => {
                const current = prev.hobbies;
                if (current.includes(tag)) {
                    return { ...prev, hobbies: current.filter(h => h !== tag) };
                } else {
                    return { ...prev, hobbies: [...current, tag] };
                }
            });
        }
    };

    const handlePeakHoursChange = (hours: 'morning' | 'night') => {
        setFormData({ ...formData, peakHours: hours });
        setPeakHours(hours);
    };

    const handleFinish = async () => {
        if (!user) {
            alert("Security Protocol: Log in required.");
            return;
        }

        setLoading(true);
        const result = await createProfile({
            userId: user.id,
            fullName: formData.fullName,
            academicAim: formData.academicAim,
            hobbies: formData.hobbies.join(", "),
            studyWindow: formData.studyWindow,
            peakHours: formData.peakHours,
            bio: formData.bio,
        });
        setLoading(false);

        if (result.success) {
            router.push("/dashboard");
        } else {
            alert("Sync Error: " + result.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden bg-[#030712]">
            {/* Background Grain/Noise */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="w-full max-w-xl relative z-10 space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-2"
                    >
                        <Terminal className="w-5 h-5 text-cyan-400" />
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-white">Welcome to <span className="text-gradient">EraConnect</span></h1>
                    <div className="flex justify-center gap-1.5 pt-2">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`h-1 rounded-full transition-all duration-500 ${currentStep >= step.id ? "w-8 bg-cyan-400" : "w-2 bg-white/10"}`}
                            />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Card className="glass-card border-white/5 bg-white/5 backdrop-blur-[40px] shadow-2xl">
                            <CardHeader className="text-center pb-2">
                                <CardTitle className="text-xl font-bold text-white uppercase tracking-widest">{steps[currentStep - 1].title}</CardTitle>
                                <CardDescription className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">{steps[currentStep - 1].description}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <Label className="text-white/40 uppercase font-mono text-[10px] tracking-widest ring-offset-background">Full Name</Label>
                                            <Input
                                                placeholder="Enter your name..."
                                                className="input-glow-bottom text-2xl font-black text-white p-0 uppercase placeholder:text-white/10"
                                                value={formData.fullName}
                                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                autoFocus
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-white/40 uppercase font-mono text-[10px] tracking-widest ring-offset-background">When do you study?</Label>
                                            <div className="flex gap-4">
                                                <Button
                                                    variant="outline"
                                                    className={`flex-1 h-20 rounded-2xl border-white/5 transition-all group overflow-hidden relative ${formData.peakHours === 'morning' ? 'border-orange-500/50 bg-orange-500/10' : 'hover:bg-white/5'}`}
                                                    onClick={() => handlePeakHoursChange('morning')}
                                                >
                                                    <div className="flex flex-col items-center gap-1 z-10">
                                                        <span className="text-2xl group-hover:scale-110 transition-transform">☀️</span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Morning</span>
                                                    </div>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className={`flex-1 h-20 rounded-2xl border-white/5 transition-all group overflow-hidden relative ${formData.peakHours === 'night' ? 'border-cyan-500/50 bg-cyan-500/10' : 'hover:bg-white/5'}`}
                                                    onClick={() => handlePeakHoursChange('night')}
                                                >
                                                    <div className="flex flex-col items-center gap-1 z-10">
                                                        <span className="text-2xl group-hover:scale-110 transition-transform">🌙</span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Night</span>
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="space-y-4">
                                            <Label className="text-white/40 uppercase font-mono text-[10px] tracking-widest ring-offset-background">Your Major</Label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {MAJOR_TAGS.map((tag) => (
                                                    <button
                                                        key={tag.id}
                                                        onClick={() => toggleTag('academicAim', tag.label)}
                                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${formData.academicAim === tag.label ? 'bg-cyan-500/20 border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'bg-white/5 border-white/10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'}`}
                                                    >
                                                        <tag.icon className={`w-5 h-5 ${formData.academicAim === tag.label ? 'text-cyan-400' : 'text-white'}`} />
                                                        <span className="text-xs font-bold text-white uppercase tracking-tight">{tag.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-white/40 uppercase font-mono text-[10px] tracking-widest ring-offset-background">Interests & Hobbies</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {HOBBY_TAGS.map((tag) => (
                                                    <button
                                                        key={tag.id}
                                                        onClick={() => toggleTag('hobbies', tag.label)}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-all duration-300 animate-float`}
                                                        style={{ animationDelay: `${Math.random() * 5}s` }}
                                                    >
                                                        <tag.icon className={`w-3 h-3 ${formData.hobbies.includes(tag.label) ? 'text-green-400' : 'text-white/40'}`} />
                                                        <span className={`${formData.hobbies.includes(tag.label) ? 'text-white' : 'text-white/40'}`}>{tag.label.toUpperCase()}</span>
                                                        {formData.hobbies.includes(tag.label) && <Check className="w-3 h-3 text-green-400" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-white/40 uppercase font-mono text-[10px] tracking-widest">About Me</Label>
                                            </div>
                                            <div className="relative group">
                                                <textarea
                                                    className="w-full h-40 p-10 pl-10 rounded-2xl bg-black/40 border-0 border-b-2 border-white/10 text-cyan-50 font-mono text-sm focus:border-cyan-500 outline-none transition-all resize-none placeholder:text-white/5"
                                                    placeholder="TELL US ABOUT YOURSELF AND YOUR GOALS..."
                                                    value={formData.bio}
                                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                                />
                                                <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/20">
                                                    {formData.bio.length} CHARS
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-white/40 uppercase font-mono text-[10px] tracking-widest">Study Hours</Label>
                                            <Input
                                                placeholder="E.G. 10 PM - 2 AM"
                                                className="input-glow-bottom text-xl font-mono text-white"
                                                value={formData.studyWindow}
                                                onChange={e => setFormData({ ...formData, studyWindow: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-8">
                                    <Button
                                        variant="ghost"
                                        onClick={prevStep}
                                        disabled={currentStep === 1}
                                        className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10"
                                    >
                                        <ChevronLeft className="w-5 h-5 mr-2" /> BACK
                                    </Button>

                                    {currentStep < steps.length ? (
                                        <Button
                                            onClick={nextStep}
                                            className="flex-2 h-14 rounded-2xl bg-white text-black font-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                        >
                                            NEXT <ChevronRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleFinish}
                                            disabled={loading || !formData.bio || !formData.fullName}
                                            className="flex-2 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="mr-2 w-5 h-5" /> COMPLETE SETUP</>}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            <style jsx global>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.02);
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(34, 211, 238, 0.5);
              }
            `}</style>
        </div>
    );
}
