import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AnalyticsDashboard, SurveyResponse } from "./AnalyticsDashboard";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const cookieStore = cookies();
    const adminAccess = cookieStore.get("admin_access")?.value;
    if (adminAccess !== "true") redirect("/");

    let responses: SurveyResponse[] = [];
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/survey`, { cache: "no-store" });
        const data = await res.json();
        responses = data.responses ?? [];
    } catch (err) {
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
                            <h1
                                className="text-4xl md:text-5xl font-bold mb-2"
                                style={{ color: '#69482d', fontFamily: 'var(--font-fredoka)' }}
                            >
                                نتائج الاستبيان
                                <span className="inline-block ml-3 text-4xl">📊</span>
                            </h1>
                            {/* Orange accent underline */}
                            <div className="h-1 w-24 rounded-full" style={{ background: '#e07b37' }} />
                            <p className="mt-3 text-base opacity-60" style={{ color: '#69482d' }}>
                                ShopMate AI — Capstone Team 21 | نتائج الوقت الفعلي
                            </p>
                        </div>
                        {/* Total chip */}
                        <div
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl self-start md:self-auto"
                            style={{ background: '#e07b37' }}
                        >
                            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-fredoka)' }}>
                                {responses.length}
                            </span>
                            <span className="text-sm text-white opacity-90">مشارك</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle divider */}
            <div className="w-full h-px opacity-20 mb-2" style={{ background: '#69482d' }} />

            {/* ── Dashboard Content ── */}
            {responses.length === 0 ? (
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
            ) : (
                <AnalyticsDashboard responses={responses} />
            )}
        </div>
    );
}
