import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { resolve } from 'path';

// Manual simple dotenv parser
const envContent = fs.readFileSync(resolve(process.cwd(), '.env'), 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = match[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1]] = val;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("No supabase keys found in .env, exiting...");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log("Fetching students with score 0...");
  
  const { data: skills, error: err1 } = await supabase
    .from('skill_siswa')
    .select('siswa_id')
    .eq('skor', 0);
    
  if (err1) {
    console.error("Error fetching skills:", err1);
    return;
  }
  
  const studentIds = skills.map((s: any) => s.siswa_id);
  console.log(`Found ${studentIds.length} students with score 0`);
  
  if (studentIds.length === 0) return;

  console.log("Deleting invalid competency history...");
  
  const chunkSize = 100;
  let totalDeleted = 0;
  
  for (let i = 0; i < studentIds.length; i += chunkSize) {
    const chunk = studentIds.slice(i, i + chunkSize);
    const { data: deleted, error: err2 } = await supabase
      .from('competency_history')
      .delete()
      .in('siswa_id', chunk)
      .eq('catatan', 'Otomatis dibuat saat import data')
      .select('id');
      
    if (err2) {
      console.error("Error deleting history:", err2);
    } else {
      totalDeleted += deleted?.length || 0;
    }
  }
  
  console.log(`Successfully deleted ${totalDeleted} invalid history records (stamps) for students with 0 score.`);
}

main();
