"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, Brain, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FocusTimerProps {
    onToggleStudyMode: (isLive: boolean) => void;
    isStudyModeActive: boolean;
}

export function FocusTimer({ onToggleStudyMode, isStudyModeActive }: FocusTimerProps) {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');

    const toggleTimer = () => {
        if (!isActive && !isStudyModeActive) {
            onToggleStudyMode(true);
        }
        setIsActive(!isActive);
    };

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    }, [mode]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            const nextMode = mode === 'focus' ? 'break' : 'focus';
            setMode(nextMode);
            setTimeLeft(nextMode === 'focus' ? 25 * 60 : 5 * 60);
            setIsActive(false);
            // Notify or play sound could go here
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft, mode]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = (timeLeft / (mode === 'focus' ? 25 * 60 : 5 * 60)) * 100;

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setMode('focus'); resetTimer(); }}
                        className={`rounded-full px-4 h-8 text-[10px] font-black uppercase tracking-widest ${mode === 'focus' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        Focus
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setMode('break'); resetTimer(); }}
                        className={`rounded-full px-4 h-8 text-[10px] font-black uppercase tracking-widest ${mode === 'break' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        Break
                    </Button>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                    <Timer className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Pomodoro 1.0</span>
                </div>
            </div>

            <div className="relative group">
                <div className="h-24 bg-white/5 rounded-3xl border border-white/10 flex items-center px-8 justify-between overflow-hidden">
                    <div 
                        className="absolute left-0 top-0 bottom-0 bg-white/5 transition-all duration-1000 ease-linear"
                        style={{ width: `${100 - progress}%` }}
                    />
                    
                    <div className="relative z-10 space-y-0.5">
                        <div className="text-4xl font-heading font-black text-white tracking-tighter tabular-nums">
                            {formatTime(timeLeft)}
                        </div>
                        <div className="flex items-center gap-2">
                             {mode === 'focus' ? (
                                <Brain className="w-3 h-3 text-indigo-300" />
                             ) : (
                                <Coffee className="w-3 h-3 text-emerald-300" />
                             )}
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">
                                {mode === 'focus' ? 'Deep Work Session' : 'Quick Recharge'}
                             </span>
                        </div>
                    </div>

                    <div className="relative z-10 flex gap-2">
                        <Button
                            size="icon"
                            onClick={toggleTimer}
                            className={`w-12 h-12 rounded-2xl ${isActive ? 'bg-rose-500 hover:bg-rose-600' : 'bg-white text-indigo-600 hover:bg-slate-50'}`}
                        >
                            {isActive ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-indigo-600 ml-1" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={resetTimer}
                            className="w-12 h-12 rounded-2xl text-white/40 hover:text-white hover:bg-white/10"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
