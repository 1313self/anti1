"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function signUpUser(formData: { email: string; password: string }) {
    try {
        const { email, password } = formData;

        // Create user with admin privileges to auto-confirm
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

        if (error) {
            // Handle unique constraint or other auth errors
            if (error.message.includes("User already registered")) {
                throw new Error("Activation Failed: Profile already exists in the EraConnect system.");
            }
            throw error;
        }

        return { success: true, user: data.user };
    } catch (error) {
        console.error("Error in signUpUser:", error);
        return { success: false, error: (error as Error).message };
    }
}
