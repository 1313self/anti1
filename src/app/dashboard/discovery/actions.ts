"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateEmbedding, flashModel } from "@/lib/gemini";

export async function findConnections(userId: string) {
    try {
        // 1. Get user profile and embedding using Admin context
        const { data: userProfile, error: userError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (userError || !userProfile || !userProfile.embedding) {
            return {
                success: false,
                error: "Your profile is incomplete. Please finish the onboarding process to activate the Discovery Engine.",
                onboardingRequired: true
            };
        }

        // 2. Search for similar profiles using match_profiles RPC (Admin bypass RLS)
        const { data: matches, error: matchError } = await supabaseAdmin.rpc('match_profiles', {
            query_embedding: userProfile.embedding,
            match_threshold: 0.5,
            match_count: 10,
        });

        if (matchError) throw matchError;

        // Filter out the user themselves
        const filteredMatches = (matches || []).filter((m: any) => m.id !== userId);

        if (filteredMatches.length === 0) {
            return { success: true, connections: [] };
        }

        // 3. Use Gemini 1.5 Flash to analyze connections
        const prompt = `
      You are an AI Synergy Analyst for "EraConnect", a professional campus networking platform.
      Target User Profile:
      - Name: ${userProfile.full_name}
      - Bio: ${userProfile.bio}
      - Hobbies: ${userProfile.hobbies?.join(", ")}
      - Academic Aim: ${userProfile.academic_aim}
      - Peak Hours: ${userProfile.peak_hours}

      Potential Collaborators:
      ${filteredMatches.map((m: any, i: number) => `
      Collaborator ${i + 1}:
      - Name: ${m.full_name}
      - Bio: ${m.bio}
      - Hobbies: ${m.hobbies?.join(", ")}
      - Major: ${m.academic_aim}
      `).join("\n")}

      For each collaborator, provide:
      1. A compatibility_score (1-100).
      2. A connection_reason (One friendly, short sentence explaining why they are a good match).

      Return the data in a strict JSON array format:
      [
        {"id": "match_id_1", "compatibility_score": 85, "connection_reason": "..."},
        ...
      ]
      Ensure the order matches the potential collaborators provided.
    `.trim();

        const result = await flashModel.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON from response (handling potential markdown formatting)
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        const analyzedMatches = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        // Combine data
        const finalConnections = filteredMatches.map((m: any) => {
            const analysis = analyzedMatches.find((a: any) => a.id === m.id) ||
                analyzedMatches[filteredMatches.indexOf(m)]; // fallback by index
            return {
                ...m,
                compatibility_score: analysis?.compatibility_score || 70,
                connection_reason: analysis?.connection_reason || "You share similar academic interests."
            };
        });

        return { success: true, connections: finalConnections };
    } catch (error) {
        console.error("Error in findConnections:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function generateIcebreaker(connectionId: string, currentUserId: string) {
    try {
        const { data: participants, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .in('id', [connectionId, currentUserId]);

        if (error || participants.length < 2) throw new Error("Could not find profiles");

        const targetProfile = participants.find((p: any) => p.id === connectionId);
        const userProfile = participants.find((p: any) => p.id === currentUserId);

        const prompt = `
      You are a Professional Liaison for "EraConnect".
      Create ONE elegant and personalized conversation starter between two students:
      User: ${userProfile.full_name}, Hobbies: ${userProfile.hobbies?.join(", ")}, Academic Aim: ${userProfile.academic_aim}
      Collaborator: ${targetProfile.full_name}, Hobbies: ${targetProfile.hobbies?.join(", ")}, Academic Aim: ${targetProfile.academic_aim}

      The icebreaker should be ONE sentence focusing on academic synergy or professional growth.
      Output format: Just the sentence.
    `;

        const result = await flashModel.generateContent(prompt);
        return { success: true, icebreaker: result.response.text().trim() };
    } catch (error) {
        console.error("Error in generateIcebreaker:", error);
        return { success: false, error: (error as Error).message };
    }
}


