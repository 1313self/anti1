"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

// --- Resources (Library) ---

export async function getResources() {
    try {
        const { data, error } = await supabaseAdmin
            .from('resources')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, resources: data };
    } catch (error) {
        console.error("Error fetching resources:", error);
        return { success: false, error: (error as Error).message };
    }
}

// --- Gigs (Hustle) ---

export async function getGigs() {
    try {
        const { data, error } = await supabaseAdmin
            .from('gigs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, gigs: data };
    } catch (error) {
        console.error("Error fetching gigs:", error);
        return { success: false, error: (error as Error).message };
    }
}

// --- Projects (Forge) ---

export async function getProjects() {
    try {
        const { data, error } = await supabaseAdmin
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, projects: data };
    } catch (error) {
        console.error("Error fetching projects:", error);
        return { success: false, error: (error as Error).message };
    }
}
