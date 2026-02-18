
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProfiles() {
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, bio, embedding')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log('--- Profile Diagnostics ---');
    profiles.forEach(p => {
        console.log(`ID: ${p.id}`);
        console.log(`Name: ${p.full_name}`);
        console.log(`Bio: "${p.bio}"`);
        console.log(`Bio Length: ${p.bio ? p.bio.length : 'NULL'}`);
        console.log(`Has Embedding: ${p.embedding ? 'YES' : 'NO'}`);
        if (p.embedding) {
            console.log(`Embedding Size: ${p.embedding.length || (typeof p.embedding === 'string' ? p.embedding.length : 'unknown')}`);
        }
        console.log('---------------------------');
    });
}

checkProfiles();
