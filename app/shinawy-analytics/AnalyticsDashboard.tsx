"use client";

import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

export interface SurveyResponse {
    id: string;
    created_at: string;
    q1_list: string;
    q2_offers: string;
    q3_scan: string;
    q4_kids: string;
    q5_feedback: string;
}

const BRAND_COLORS = ["#e07b37", "#69482d", "#8c6b51", "#b0927a", "#c4a882"];

const LABELS: Record<string, Record<string, string>> = {
    q1_list: {
        paper: "بكتب ورقة 🤦‍♂️",
        phone_notes: "موبايل بين الأقسام 📱",
        memory: "بالبركة 🤷‍♂️",
        smart_list: "لستة ذكية ✨",
    },
    q2_offers: {
        browse_aisles: "بلف على اليفط 🏷️",
        catalog: "مجلة العروض 📖",
        by_chance: "بالصدفة 🏃‍♂️",
        smart_alert: "تنبيه شاشة العربية 🤩",
    },
    q3_scan: {
        ask_staff: "أسأل موظف 🚶‍♂️",
        put_back: "برجعه وأطنش 🔙",
        wall_scanner: "أسكانر الحائط 🔲",
    },
    q4_kids: {
        phone: "موبايلي 📱",
        rush: "أخلص بسرعة 🏃‍♂️",
        alone: "بنزل لوحدي 👤",
    },
};

const Q_LABELS: Record<string, string> = {
    q1_list: "تجهيز لستة التسوق",
    q2_offers: "صيد العروض",
    q3_scan: "منتج بدون سعر",
    q4_kids: "التسوق مع الأطفال",
};

function tally(responses: SurveyResponse[], field: keyof SurveyResponse) {
    const counts: Record<string, number> = {};
    responses.forEach((r) => {
        const val = r[field] as string;
        if (val) counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts)
        .map(([key, value]) => ({ name: LABELS[field]?.[key] ?? key, value }))
        .sort((a, b) => b.value - a.value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
    if (active && payload && payload.length) {
        const entry = payload[0];
        return (
            <div className="bg-white rounded-xl px-4 py-2 shadow-lg border border-stone-100">
                <p className="text-sm font-bold" style={{ color: '#69482d', direction: 'rtl' }}>{entry?.name}</p>
                <p className="text-lg font-bold" style={{ color: '#e07b37' }}>{entry?.value} مشاركين</p>
            </div>
        );
    }
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderCustomLabel(props: any) {
    const { cx, cy, midAngle, innerRadius, outerRadius, value, percent } = props;
    if ((percent ?? 0) < 0.08) return null;
    const RADIAN = Math.PI / 180;
    const r = (Number(innerRadius) + Number(outerRadius)) * 0.5;
    const x = Number(cx) + r * Math.cos(-Number(midAngle) * RADIAN);
    const y = Number(cy) + r * Math.sin(-Number(midAngle) * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="bold">
            {value}
        </text>
    );
}

interface PieCardProps { title: string; data: { name: string; value: number }[]; }
function PieCard({ title, data }: PieCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100/80 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-base font-bold mb-4 text-center" style={{ color: '#69482d', fontFamily: 'var(--font-fredoka)', direction: 'rtl' }}>
                {title}
            </h3>
            <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={75} labelLine={false} label={renderCustomLabel}>
                        {data.map((_, index) => <Cell key={`cell-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "20px", fontSize: "12px", direction: "rtl" }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export function AnalyticsDashboard({ responses }: { responses: SurveyResponse[] }) {
    const choiceFields: (keyof SurveyResponse)[] = ["q1_list", "q2_offers", "q3_scan", "q4_kids"];

    const summaryCards = [
        { label: "إجمالي المشاركين", value: responses.length, emoji: "👥", sub: "شاركوا في الاستبيان" },
        { label: "يريدون لستة ذكية", value: responses.filter(r => r.q1_list === 'smart_list').length, emoji: "✨", sub: "اختاروا الخيار الذكي" },
        { label: "يريدون تنبيه العروض", value: responses.filter(r => r.q2_offers === 'smart_alert').length, emoji: "🤩", sub: "يريدون إشعار فوري" },
        { label: "بينزلوا لوحدهم للتسوق", value: responses.filter(r => r.q4_kids === 'alone').length, emoji: "👤", sub: "بسبب الأطفال" },
    ];

    const overviewData = [
        { name: "لستة ذكية", value: responses.filter(r => r.q1_list === 'smart_list').length },
        { name: "تنبيه عروض", value: responses.filter(r => r.q2_offers === 'smart_alert').length },
        { name: "أسكانر ذكي", value: responses.filter(r => r.q3_scan === 'wall_scanner').length },
        { name: "بينزلوا لوحدهم", value: responses.filter(r => r.q4_kids === 'alone').length },
    ];

    const feedbacks = responses
        .map(r => ({ text: r.q5_feedback, date: r.created_at }))
        .filter(r => r.text && r.text !== "بدون تعليق");

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summaryCards.map((card) => (
                    <div key={card.label}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100/80 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-default">
                        <div className="text-3xl mb-2">{card.emoji}</div>
                        <div className="text-4xl font-bold mb-1" style={{ color: '#e07b37', fontFamily: 'var(--font-fredoka)' }}>{card.value}</div>
                        <div className="text-sm font-semibold" style={{ color: '#69482d', direction: 'rtl' }}>{card.label}</div>
                        <div className="text-xs mt-0.5 opacity-50" style={{ color: '#69482d', direction: 'rtl' }}>{card.sub}</div>
                    </div>
                ))}
            </div>

            {/* Bar Chart */}
            {responses.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100/80">
                    <h3 className="text-lg font-bold mb-6" style={{ color: '#69482d', fontFamily: 'var(--font-fredoka)' }}>📊 أبرز النتائج</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={overviewData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(105,72,45,0.08)" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#69482d', fontFamily: 'var(--font-fredoka)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis allowDecimals={false} tick={{ fill: '#69482d', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(224,123,55,0.06)' }} />
                            <Bar dataKey="value" fill="#e07b37" radius={[8, 8, 0, 0]} maxBarSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Pie Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {choiceFields.map((field) => {
                    const data = tally(responses, field);
                    if (data.length === 0) return null;
                    return <PieCard key={field as string} title={Q_LABELS[field as string]} data={data} />;
                })}
            </div>

            {/* Answer Details Table */}
            {responses.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100/80">
                    <h3 className="text-lg font-bold mb-5" style={{ color: '#69482d', fontFamily: 'var(--font-fredoka)' }}>📋 تفاصيل الإجابات</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '2px solid rgba(105,72,45,0.1)' }}>
                                    {["السؤال", "الإجابة", "العدد", "النسبة"].map(h => (
                                        <th key={h} className="pb-3 px-3 text-right font-bold" style={{ color: '#69482d', direction: 'rtl' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {choiceFields.map((field) =>
                                    tally(responses, field).map((row, ri) => (
                                        <tr key={`${field as string}-${ri}`} className="hover:bg-orange-50 transition-colors"
                                            style={{ borderBottom: '1px solid rgba(105,72,45,0.06)' }}>
                                            <td className="py-3 px-3 font-medium text-right" style={{ color: '#69482d', direction: 'rtl' }}>
                                                {ri === 0 ? Q_LABELS[field as string] : ""}
                                            </td>
                                            <td className="py-3 px-3 text-right" style={{ color: '#8c6b51', direction: 'rtl' }}>{row.name}</td>
                                            <td className="py-3 px-3 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                                                    style={{ background: '#fff3eb', color: '#e07b37' }}>{row.value}</span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(105,72,45,0.1)' }}>
                                                        <div className="h-full rounded-full"
                                                            style={{ width: `${responses.length ? Math.round((row.value / responses.length) * 100) : 0}%`, background: '#e07b37' }} />
                                                    </div>
                                                    <span className="text-xs font-bold w-8" style={{ color: '#e07b37' }}>
                                                        {responses.length ? Math.round((row.value / responses.length) * 100) : 0}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── User Feedback Section ── */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100/80">
                <h3 className="text-lg font-bold mb-2" style={{ color: '#69482d', fontFamily: 'var(--font-fredoka)' }}>
                    💬 آراء ومقترحات المستخدمين
                </h3>
                <p className="text-sm mb-6 opacity-50" style={{ color: '#69482d', direction: 'rtl' }}>
                    {feedbacks.length} رد مكتوب من أصل {responses.length} مشارك
                </p>

                {feedbacks.length === 0 ? (
                    <div className="text-center py-10 opacity-40">
                        <div className="text-5xl mb-3">📭</div>
                        <p style={{ color: '#69482d', direction: 'rtl' }}>لا توجد آراء مكتوبة بعد</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {feedbacks.map((fb, i) => (
                            <div key={i}
                                className="rounded-2xl p-5 border hover:shadow-sm transition-shadow duration-150"
                                style={{ background: 'rgba(224,123,55,0.05)', borderColor: 'rgba(224,123,55,0.15)' }}>
                                <p className="text-sm leading-relaxed mb-3 font-medium"
                                    style={{ color: '#69482d', direction: 'rtl', fontFamily: 'var(--font-fredoka)' }}>
                                    &ldquo;{fb.text}&rdquo;
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#e07b37' }} />
                                    <span className="text-xs opacity-40" style={{ color: '#69482d' }}>
                                        {new Date(fb.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
