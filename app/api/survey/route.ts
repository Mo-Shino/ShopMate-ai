import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// POST: Submit survey answers
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { q1_list, q2_offers, q3_scan, q4_kids, q5_feedback } = body;

        const { error } = await supabase
            .from('survey_responses')
            .insert([{ q1_list, q2_offers, q3_scan, q4_kids, q5_feedback }]);

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json({ error: 'Failed to save response' }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error('Survey POST error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// GET: Fetch all survey responses for admin dashboard
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('survey_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase fetch error:', error);
            return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
        }

        return NextResponse.json({ responses: data }, { status: 200 });
    } catch (err) {
        console.error('Survey GET error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
