"use server";

import { supabase } from "@/lib/supabase";
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
}) {
    try {
        // 1. Generate embedding for the bio
        const embedding = await generateEmbedding(formData.bio);

        if (!embedding) {
            console.warn("Failed to generate embedding for profile");
        }

        // 2. Format hobbies as array
        const hobbiesArray = formData.hobbies.split(",").map(h => h.trim()).filter(h => h !== "");

        // 3. Upsert profile in Supabase
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: formData.userId,
                full_name: formData.fullName,
                academic_aim: formData.academicAim,
                hobbies: hobbiesArray,
                study_window: formData.studyWindow,
                peak_hours: formData.peakHours === 'neutral' ? null : formData.peakHours,
                bio: formData.bio,
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
