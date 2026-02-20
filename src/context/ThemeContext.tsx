"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type PeakHours = 'morning' | 'night' | 'neutral';

interface ThemeContextType {
    peakHours: PeakHours;
    setPeakHours: (hours: PeakHours) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [peakHours, setPeakHours] = useState<PeakHours>('neutral');

    useEffect(() => {
        // Apply accent color to document based on peakHours
        const root = document.documentElement;
        if (peakHours === 'morning') {
            root.style.setProperty('--primary', 'oklch(0.7 0.25 45)'); // Warm orange-red
            root.style.setProperty('--primary-foreground', '#ffffff');
            root.style.setProperty('--ring', 'oklch(0.7 0.25 45)');
        } else if (peakHours === 'night') {
            root.style.setProperty('--primary', 'oklch(0.6 0.2 260)'); // Deep blue-purple
            root.style.setProperty('--primary-foreground', '#ffffff');
            root.style.setProperty('--ring', 'oklch(0.6 0.2 260)');
        } else {
            root.style.setProperty('--primary', '#6366f1'); // Indigo 500 (Default Cosmic)
            root.style.setProperty('--primary-foreground', '#ffffff');
            root.style.setProperty('--ring', '#6366f1');
        }

        // Removed force dark mode for light professional theme
    }, [peakHours]);

    return (
        <ThemeContext.Provider value={{ peakHours, setPeakHours }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
