"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, MessageSquare, BookOpen, Brain, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFlashModel } from "@/lib/gemini";

export function StudyAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAsk = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            const model = getFlashModel();
            const result = await model.generateContent(`You are an academic study assistant for the EraConnect platform. 
            User prompt: ${prompt}
            Keep your answer concise, academic, and supportive. Use markdown formatting.`);
            setResponse(result.response.text());
        } catch (error) {
            setResponse("Sorry, I encountered an error. Please check your API key.");
        }
        setLoading(false);
    };

    const quickAction = (action: string) => {
        setPrompt(action);
        setIsOpen(true);
    };

    return (
        <>
            {/* Quick Action Floating Buttons */}
             <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
                <AnimatePresence>
                    {!isOpen && (
                        <>
                            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                                <Button
                                    onClick={() => quickAction("Summarize this topic: ")}
                                    className="bg-white/80 backdrop-blur-md text-indigo-600 border border-indigo-100 hover:bg-white rounded-2xl h-12 px-4 shadow-xl flex gap-2 font-black uppercase text-[10px] tracking-widest"
                                >
                                    <BookOpen className="w-4 h-4" /> Summarize
                                </Button>
                            </motion.div>
                            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ delay: 0.1 }}>
                                <Button
                                    onClick={() => quickAction("Create a 3-question quiz about: ")}
                                    className="bg-white/80 backdrop-blur-md text-emerald-600 border border-emerald-100 hover:bg-white rounded-2xl h-12 px-4 shadow-xl flex gap-2 font-black uppercase text-[10px] tracking-widest"
                                >
                                    <Brain className="w-4 h-4" /> Quiz Me
                                </Button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 rounded-2xl shadow-2xl transition-all duration-500 ${isOpen ? 'bg-slate-900 border-slate-800' : 'bg-indigo-600 border-indigo-500 hover:scale-110'}`}
                >
                    {isOpen ? <X className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
                </Button>
            </div>

            {/* AI Assistant Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-28 right-8 w-[400px] max-w-[calc(100vw-4rem)] bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-xs tracking-widest">Study Buddy AI</h3>
                                    <p className="text-[10px] text-white/50 uppercase font-bold tracking-tighter">Powered by Gemini</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setResponse("")} className="text-white/40 hover:text-white">
                                <Eraser className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto max-h-[400px] space-y-4">
                            {response ? (
                                <div className="prose prose-sm font-medium text-slate-600">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-wrap">
                                        {response}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center text-center space-y-3">
                                    <MessageSquare className="w-8 h-8 text-slate-200" />
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">How can I help you <br /> today?</p>
                                </div>
                            )}
                            {loading && (
                                <div className="flex gap-2 p-4 bg-indigo-50 rounded-2xl animate-pulse">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleAsk} className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                            <Input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Ask about your studies..."
                                className="rounded-xl border-slate-200 bg-white h-12 text-sm font-medium"
                            />
                            <Button disabled={loading || !prompt.trim()} size="icon" className="h-12 w-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                                <Send className="w-5 h-5" />
                            </Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
