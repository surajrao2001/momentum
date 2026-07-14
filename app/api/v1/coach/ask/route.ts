import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ApiResponse } from '@/types';

export async function POST(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                data: null,
                error: { code: 'UNAUTHORIZED', message: 'Not authenticated' },
            },
            { status: 401 }
        );
    }

    const { message } = (await request.json()) as { message: string };
    const reply = `Thanks for your question! I see you're working on your goals. Regarding "${message.slice(0, 80)}", I'd suggest focusing on your next scheduled block. Want me to adjust your plan?`;

    return NextResponse.json<ApiResponse<{ reply: string }>>({
        success: true,
        data: { reply },
        error: null,
    });
}
