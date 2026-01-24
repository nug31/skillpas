
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCriteria() {
    const { data, error } = await supabase
        .from('level_skill_jurusan')
        .select('*')
        .eq('jurusan_id', 'tkr')
        .eq('level_id', 'intermediate')
        .single();

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    console.log('TKR Intermediate Criteria:');
    console.log(JSON.parse(data.hasil_belajar));
}

checkCriteria();
