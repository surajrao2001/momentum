import { NextResponse } from 'next/server';
import { parseTaskNlp } from '@/lib/ai/nlp-parser';
import { createClient } from '@/lib/supabase/server';
import type { ApiResponse, NlpParseResult } from '@/types';

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

    const { text, goal_ids } = (await request.json()) as {
        text: string;
        goal_ids: string[];
    };
    const data = parseTaskNlp(text, goal_ids);
    return NextResponse.json<ApiResponse<NlpParseResult>>({
        success: true,
        data,
        error: null,
    });
}
