import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { AnalyticsDashboard, SurveyResponse } from "./AnalyticsDashboard";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const cookieStore = cookies();
    const adminAccess = cookieStore.get("admin_access")?.value;
    if (adminAccess !== "true") redirect("/");

    // ── Check env vars ──
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#dbe3c9' }}>
                <div className="bg-white rounded-2xl p-8 text-center max-w-sm shadow-lg">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: '#69482d' }}>Missing Environment Variables</h2>
                    <p className="text-sm opacity-60" style={{ color: '#69482d' }}>
                        NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set on this deployment.
                    </p>
                    <div className="mt-4 p-3 rounded-xl text-xs text-left font-mono" style={{ background: '#f5f0eb', color: '#69482d' }}>
                        URL: {supabaseUrl ? "✅ Set" : "❌ Missing"}<br />
                        KEY: {serviceKey ? "✅ Set" : "❌ Missing"}
                    </div>
                </div>
            </div>
        );
    }

    let responses: SurveyResponse[] = [];
    let fetchError: string | null = null;

    try {
        const supabase = createClient(supabaseUrl, serviceKey);
        const { data, error } = await supabase
            .from("survey_responses")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            fetchError = error.message;
            console.error("Supabase fetch error:", error);
        } else {
            responses = data ?? [];
        }
    } catch (err) {
        fetchError = String(err);
        console.error("Failed to fetch survey responses:", err);
    }

    return (
        <div className="min-h-screen" style={{ background: '#dbe3c9' }}>
            {/* ── Clean Header ── */}
            <div className="px-6 md:px-10 pt-10 pb-8">
                <div className="max-w-6xl mx-auto">
                    {/* Logos row */}
                    <div className="flex items-center gap-3 mb-6">
                        <Image src="/ShopMate_logo.svg" alt="ShopMate" width={36} height={36} />
                        <div className="w-px h-6 opacity-30" style={{ background: '#69482d' }} />
                        <Image src="/fathallah_logo.svg" alt="Fathalla" width={32} height={32} />
                        <span className="text-sm font-medium opacity-50 ml-2" style={{ color: '#69482d' }}>
                            Secret Dashboard 🔐
                        </span>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2"
                                style={{ color: '#69482d', fontFamily: 'var(--font-fredoka)' }}>
                                نتائج الاستبيان
                                <span className="inline-block ml-3 text-4xl">📊</span>
                            </h1>
                            <div className="h-1 w-24 rounded-full" style={{ background: '#e07b37' }} />
                            <p className="mt-3 text-base opacity-60" style={{ color: '#69482d' }}>
                                ShopMate AI — Capstone Team 21 | نتائج الوقت الفعلي
                            </p>
                        </div>
                        {/* Total chip */}
                        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl self-start md:self-auto"
                            style={{ background: '#e07b37' }}>
                            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-fredoka)' }}>
                                {responses.length}
                            </span>
                            <span className="text-sm text-white opacity-90">مشارك</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-px opacity-20 mb-2" style={{ background: '#69482d' }} />

            {/* ── Error Banner ── */}
            {fetchError && (
                <div className="mx-6 md:mx-10 my-4 p-4 rounded-2xl border max-w-6xl"
                    style={{ background: '#fff3f0', borderColor: '#e07b37' }}>
                    <p className="text-sm font-bold mb-1" style={{ color: '#c4622a' }}>⚠️ Supabase Error (check Netlify logs)</p>
                    <p className="text-xs font-mono break-all" style={{ color: '#69482d' }}>{fetchError}</p>
                </div>
            )}

            {/* ── Dashboard Content ── */}
            {responses.length === 0 && !fetchError ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="text-7xl mb-6">📭</div>
                    <h2 className="text-3xl font-bold mb-2"
                        style={{ color: '#69482d', fontFamily: 'var(--font-fredoka)' }}>
                        لا يوجد بيانات حتى الآن
                    </h2>
                    <p className="opacity-50" style={{ color: '#69482d', direction: 'rtl' }}>
                        انتظر حتى يشارك العملاء في الاستبيان
                    </p>
                </div>
            ) : responses.length > 0 ? (
                <AnalyticsDashboard responses={responses} />
            ) : null}
        </div>
    );
}
