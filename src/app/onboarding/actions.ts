"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateEmbedding } from "@/lib/gemini";
import { revalidatePath } from "next/cache";

export async function createProfile(formData: {
    userId: string;
    fullName: string;
    academicAim: string;
    hobbies: string;
    studyWindow: string;
    peakHours: 'morning' | 'night' | 'neutral';
    bio: string;
    instagram?: string;
    discord?: string;
}) {
    try {
        // 1. Generate embedding for the bio
        const embedding = await generateEmbedding(formData.bio);

        if (!embedding) {
            console.warn("Generating zero-vector fallback for profile embedding due to API limitation.");
        }

        const fullNameClean = formData.fullName.trim();
        if (!fullNameClean) throw new Error("Full name protocol failed: Name cannot be empty.");

        // 2. Format hobbies as array
        const hobbiesArray = formData.hobbies.split(",").map(h => h.trim()).filter(h => h !== "");

        // 3. Upsert profile in Supabase using Admin client
        const { error } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: formData.userId,
                full_name: formData.fullName,
                academic_aim: formData.academicAim,
                hobbies: hobbiesArray,
                study_window: formData.studyWindow,
                peak_hours: formData.peakHours === 'neutral' ? null : formData.peakHours,
                bio: formData.bio,
                instagram: formData.instagram || null,
                discord: formData.discord || null,
                embedding: embedding,
                updated_at: new Date().toISOString(),
            });

        if (error) throw error;

        revalidatePath("/dashboard");
        revalidatePath("/onboarding");

        return { success: true };
    } catch (error) {
        console.error("Error in createProfile:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function updateProfile(formData: {
    userId: string;
    fullName: string;
    academicAim: string;
    hobbies: string;
    bio: string;
    studyWindow: string;
    instagram?: string;
    discord?: string;
}) {
    try {
        const { error } = await supabaseAdmin
            .from('profiles')
            .update({
                full_name: formData.fullName,
                academic_aim: formData.academicAim,
                hobbies: formData.hobbies.split(",").map(h => h.trim()).filter(h => h !== ""),
                bio: formData.bio,
                study_window: formData.studyWindow,
                instagram: formData.instagram || null,
                discord: formData.discord || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', formData.userId);

        if (error) throw error;
        revalidatePath("/dashboard/profile");
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: (error as Error).message };
    }
}
