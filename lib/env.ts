export function getEnv() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    if (!url || !anonKey) {
        if (process.env.NODE_ENV === 'production') {
            console.warn('Missing Supabase environment variables');
        }
    }
    return { supabaseUrl: url, supabaseAnonKey: anonKey };
}
