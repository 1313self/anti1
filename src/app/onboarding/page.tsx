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
    ChevronRight, ChevronLeft, Check, Sparkles, Loader2,
    UserCircle, Search, FileText
} from "lucide-react";

const steps = [
    { id: 1, title: "Personal Info", description: "What's your name and focus?", icon: UserCircle },
    { id: 2, title: "Interests", description: "What are you studying?", icon: Search },
    { id: 3, title: "Your Story", description: "A quick intro about you.", icon: FileText },
    { id: 4, title: "Socials", description: "Connect beyond the platform.", icon: Globe },
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
        academicAim: "",
        hobbies: [] as string[],
        studyWindow: "",
        peakHours: "neutral" as 'morning' | 'night' | 'neutral',
        bio: "",
        instagram: "",
        discord: "",
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
            router.push("/login");
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
            instagram: formData.instagram,
            discord: formData.discord,
        });
        setLoading(false);

        if (result.success) {
            router.push("/dashboard");
        } else {
            alert("Error saving profile: " + result.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 relative bg-background overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/[0.03] blur-[120px] rounded-full" />

            {/* EraConnect Branding */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-6 md:top-12 flex items-center gap-2"
            >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <span className="text-lg md:text-xl font-black tracking-tighter uppercase text-slate-900">EraConnect</span>
            </motion.div>

            <div className="w-full max-w-xl relative z-10 space-y-6 md:space-y-8 mt-12 md:mt-0">
                {/* Modern Progress Header */}
                <div className="text-center space-y-4 md:space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white border border-slate-100 shadow-sm text-indigo-600 mb-1 md:mb-2"
                    >
                        {(() => {
                            const StepIcon = steps[currentStep - 1].icon;
                            return StepIcon ? <StepIcon className="w-5 h-5 md:w-6 md:h-6" /> : null;
                        })()}
                    </motion.div>
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none px-4">Complete Your Profile</h1>
                        <p className="text-slate-400 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em]">Step {currentStep} of {steps.length} • Set Up Account</p>
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
                        <Card className="glass-card border-white shadow-xl shadow-slate-200/50 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="text-center pb-2 md:pb-3 bg-slate-50/50 border-b border-white">
                                <CardTitle className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">{steps[currentStep - 1].title}</CardTitle>
                                <CardDescription className="text-slate-400 text-[10px] md:text-xs font-semibold">{steps[currentStep - 1].description}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 md:p-10 space-y-6 md:space-y-8">
                                {currentStep === 1 && (
                                    <div className="space-y-6 md:space-y-8">
                                        <div className="space-y-3">
                                            <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest">Full Name</Label>
                                            <Input
                                                placeholder="Enter your name..."
                                                className="input-glow-bottom text-xl md:text-2xl font-black text-slate-900 placeholder:text-slate-200 h-12 md:h-14"
                                                value={formData.fullName}
                                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                                autoFocus
                                            />
                                        </div>
                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest">Study Preference</Label>
                                            <div className="flex gap-3 md:gap-4">
                                                <Button
                                                    variant="outline"
                                                    className={`flex-1 h-20 md:h-24 rounded-2xl md:rounded-3xl border-slate-100 shadow-sm transition-all relative overflow-hidden ${formData.peakHours === 'morning' ? 'border-amber-400 bg-amber-50 ring-1 ring-amber-400' : 'bg-white hover:bg-slate-50'}`}
                                                    onClick={() => handlePeakHoursChange('morning')}
                                                >
                                                    <div className="flex flex-col items-center gap-1 md:gap-2">
                                                        <span className="text-xl md:text-2xl">☀️</span>
                                                        <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${formData.peakHours === 'morning' ? 'text-amber-600' : 'text-slate-400'}`}>Early Bird</span>
                                                    </div>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className={`flex-1 h-20 md:h-24 rounded-2xl md:rounded-3xl border-slate-100 shadow-sm transition-all relative overflow-hidden ${formData.peakHours === 'night' ? 'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-400' : 'bg-white hover:bg-slate-50'}`}
                                                    onClick={() => handlePeakHoursChange('night')}
                                                >
                                                    <div className="flex flex-col items-center gap-1 md:gap-2">
                                                        <span className="text-xl md:text-2xl">🌙</span>
                                                        <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${formData.peakHours === 'night' ? 'text-indigo-600' : 'text-slate-400'}`}>Night Owl</span>
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-6 md:space-y-8 max-h-[350px] md:max-h-[450px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest">Your Major</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
                                                {MAJOR_TAGS.map((tag) => (
                                                    <button
                                                        key={tag.id}
                                                        onClick={() => toggleTag('academicAim', tag.label)}
                                                        className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 ${formData.academicAim === tag.label ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200 opacity-60 hover:opacity-100'}`}
                                                    >
                                                        <div className={`p-1.5 md:p-2 rounded-lg ${formData.academicAim === tag.label ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                                                            <tag.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                        </div>
                                                        <span className={`text-[10px] md:text-xs font-black uppercase tracking-tight ${formData.academicAim === tag.label ? 'text-indigo-700' : 'text-slate-500'}`}>{tag.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest">Interests</Label>
                                            <div className="flex flex-wrap gap-1.5 md:gap-2">
                                                {HOBBY_TAGS.map((tag) => (
                                                    <button
                                                        key={tag.id}
                                                        onClick={() => toggleTag('hobbies', tag.label)}
                                                        className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-full border text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${formData.hobbies.includes(tag.label) ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                                                    >
                                                        <tag.icon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                        {tag.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-6 md:space-y-8">
                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest">About You</Label>
                                            <div className="relative">
                                                <textarea
                                                    className="w-full h-32 md:h-44 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-slate-50/50 border-2 border-slate-100 text-slate-700 font-medium text-base md:text-lg focus:border-indigo-400 focus:bg-white outline-none transition-all resize-none shadow-inner"
                                                    placeholder="Tell us what you're working on or what you're looking for in a collaborator..."
                                                    value={formData.bio}
                                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest">Typically Studying Hours</Label>
                                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                                {['2-3 HOURS', '4-5 HOURS', '6+ HOURS', 'FLEXIBLE'].map((choice) => (
                                                    <Button
                                                        key={choice}
                                                        variant="outline"
                                                        className={`h-12 md:h-16 rounded-xl md:rounded-2xl border-slate-100 font-black text-[8px] md:text-[10px] tracking-widest uppercase transition-all ${formData.studyWindow === choice ? 'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-400 text-indigo-600' : 'bg-white hover:bg-slate-50 text-slate-400'}`}
                                                        onClick={() => setFormData({ ...formData, studyWindow: choice })}
                                                    >
                                                        {choice}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}



                                {currentStep === 4 && (
                                    <div className="space-y-6 md:space-y-8">
                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                                <span className="text-lg">📸</span> Instagram (Optional)
                                            </Label>
                                            <Input
                                                placeholder="@username or profile link"
                                                className="input-glow-bottom text-base md:text-lg font-black text-slate-800 placeholder:text-slate-200 h-12 md:h-14"
                                                value={formData.instagram}
                                                onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                            />
                                            <p className="text-[10px] text-slate-400 font-medium">We'll link this to your discovery card.</p>
                                        </div>

                                        <div className="space-y-3 md:space-y-4">
                                            <Label className="text-slate-400 uppercase font-black text-[9px] md:text-[10px] tracking-widest flex items-center gap-2">
                                                <span className="text-lg">💬</span> Discord (Optional)
                                            </Label>
                                            <Input
                                                placeholder="username or invite link"
                                                className="input-glow-bottom text-base md:text-lg font-black text-slate-800 placeholder:text-slate-200 h-12 md:h-14"
                                                value={formData.discord}
                                                onChange={e => setFormData({ ...formData, discord: e.target.value })}
                                            />
                                            <p className="text-[10px] text-slate-400 font-medium">Share your handle or a server invite.</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 md:gap-4 pt-2 md:pt-4">
                                    <Button
                                        variant="ghost"
                                        onClick={prevStep}
                                        disabled={currentStep === 1}
                                        className="flex-1 h-12 md:h-14 rounded-xl md:rounded-2xl bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100"
                                    >
                                        Back
                                    </Button>

                                    {currentStep < steps.length ? (
                                        <Button
                                            onClick={nextStep}
                                            className="flex-2 h-12 md:h-14 rounded-xl md:rounded-2xl bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleFinish}
                                            disabled={loading || !formData.bio || !formData.fullName}
                                            className="flex-2 h-12 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-200"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Finish Setup</>}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Founder Signature Footer - Only on Last Step */}
            {
                currentStep === 4 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-8 text-center space-y-1"
                    >
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">EraConnect Engineering</p>
                        <p className="text-[11px] font-bold text-slate-400">
                            Developer And Founder <span className="text-indigo-500 font-black">Divyansh Thakur</span>
                        </p>
                    </motion.div>
                )
            }

            <style jsx global>{`
              .custom-scrollbar::-webkit-scrollbar { width: 5px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `}</style>
        </div >
    );
}
