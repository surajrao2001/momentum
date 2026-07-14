import { NextResponse } from 'next/server';
import { generatePlan } from '@/lib/scheduling/plan-generator';
import { createClient } from '@/lib/supabase/server';
import type {
    ApiResponse,
    PlanGenerateRequest,
    PlanGenerateResponse,
} from '@/types';

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

    const body = (await request.json()) as PlanGenerateRequest;
    const data = generatePlan(body);
    return NextResponse.json<ApiResponse<PlanGenerateResponse>>({
        success: true,
        data,
        error: null,
    });
}
