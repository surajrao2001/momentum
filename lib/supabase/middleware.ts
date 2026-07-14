import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getEnv } from '@/lib/env';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });
    const { supabaseUrl, supabaseAnonKey } = getEnv();

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value)
                );
                supabaseResponse = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                );
            },
        },
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const isApiRoute = path.startsWith('/api/');
    const isAuthRoute =
        path.startsWith('/login') ||
        path.startsWith('/signup') ||
        path.startsWith('/verify-email');
    const isPublicRoute = isAuthRoute || path.startsWith('/auth/callback');
    const isOnboarding = path.startsWith('/onboarding');

    // API routes should return JSON, never middleware redirects.
    if (isApiRoute) {
        return supabaseResponse;
    }

    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (user) {
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('onboarding_completed')
            .eq('id', user.id)
            .single();

        // If users table/profile row is unavailable, avoid redirect loops.
        // Let the request continue so the app can surface a clear UI/API error.
        if (profileError) {
            return supabaseResponse;
        }

        if (
            !profile?.onboarding_completed &&
            !isOnboarding &&
            !isAuthRoute &&
            path !== '/auth/callback'
        ) {
            const url = request.nextUrl.clone();
            url.pathname = '/onboarding/goals';
            return NextResponse.redirect(url);
        }

        if (profile?.onboarding_completed && (isAuthRoute || isOnboarding)) {
            const url = request.nextUrl.clone();
            url.pathname = '/today';
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
