"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateStudyStatus(userId: string, isLive: boolean) {
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ live_now: isLive })
            .eq('id', userId);

        if (error) throw error;

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error in updateStudyStatus:", error);
        return { success: false, error: (error as Error).message };
    }
}
