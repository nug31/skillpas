
const { createClient } = require('@supabase/supabase-client');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const jurusanId = '550e8400-e29b-41d4-a716-446655440004'; // ELIND
    const className = 'XI ELIND 10 03';

    console.log('--- Checking Siswa Count ---');
    const { data: allSiswa, count } = await supabase
        .from('siswa')
        .select('*', { count: 'exact' })
        .eq('jurusan_id', jurusanId);

    console.log(`Total siswa in Jurusan: ${count}`);

    const { data: classSiswa, count: classCount } = await supabase
        .from('siswa')
        .select('*', { count: 'exact' })
        .eq('jurusan_id', jurusanId)
        .eq('kelas', className);

    console.log(`Students in Class "${className}": ${classCount}`);

    if (classSiswa) {
        console.log('Names found:');
        classSiswa.forEach(s => console.log(`- ${s.nama}`));
    }
}

check();
