"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ── Types ──────────────────────────────────────────────────────────────────
interface ChoiceQuestion {
    id: string;
    type: "choice";
    text: string;
    options: { emoji: string; label: string; value: string }[];
}
interface TextQuestion {
    id: string;
    type: "text";
    text: string;
    placeholder: string;
}
type Question = ChoiceQuestion | TextQuestion;

// ── Questions ──────────────────────────────────────────────────────────────
const questions: Question[] = [
    {
        id: "q1_list",
        type: "choice",
        text: "بتجهز لستة طلبات البيت إزاي عشان متنساش حاجة وأنت بتلف في فتح الله؟",
        options: [
            { emoji: "🤦‍♂️", label: "بكتب ورقة..!", value: "paper" },
            { emoji: "📱", label: "بكتب على الموبايل وبفضل رايح جاي بين الأقسام", value: "phone_notes" },
            { emoji: "🤷‍♂️", label: "بشتري بالبركة واللي أفتكره بجيبه", value: "memory" },
            { emoji: "✨", label: "لو العربية فيها لستة ذكية بترتبلي طريقي هتبقى منقذة!", value: "smart_list" },
        ],
    },
    {
        id: "q2_offers",
        type: "choice",
        text: "بتصطاد العروض وتعرف الخصومات إزاي وأنت جوه الفرع؟",
        options: [
            { emoji: "🏷️", label: "بلف في الممرات كلها عشان أدور على اليفط الصفراء", value: "browse_aisles" },
            { emoji: "📖", label: "باخد مجلة العروض من على الباب وأمشي أطابقها بالرفوف", value: "catalog" },
            { emoji: "🏃‍♂️", label: "بالصدفة.. لو لقيت زحمة على منتج بعرف إن عليه عرض", value: "by_chance" },
            { emoji: "🤩", label: "لو شاشة العربية نبهتني بالعروض وأنا ماشي هتبقى عظمة!", value: "smart_alert" },
        ],
    },
    {
        id: "q3_scan",
        type: "choice",
        text: "مسكت منتج عجبك بس مش لاقي سعره ومفيش يافطة.. بتعمل إيه؟",
        options: [
            { emoji: "🚶‍♂️", label: "بلف السوبر ماركت أدور على أقرب موظف أسأله", value: "ask_staff" },
            { emoji: "🔙", label: "برجع المنتج مكانه وأطنش", value: "put_back" },
            { emoji: "🔲", label: "بدور على الأسكانر المتعلق على الحائط بتاع الفرع", value: "wall_scanner" },
        ],
    },
    {
        id: "q4_kids",
        type: "choice",
        text: "عشان تتسوق بهدوء وتركيز من غير ما الأطفال يزهقوا، بتعمل إيه؟",
        options: [
            { emoji: "📱", label: "بديهم موبايلي يلعبوا فيه عشان يسكتوا", value: "phone" },
            { emoji: "🏃‍♂️", label: "بحاول أخلص الطلبات بسرعة كأني في سباق", value: "rush" },
            { emoji: "👤", label: "أو بنزل لوحدي", value: "alone" },
        ],
    },
    {
        id: "q5_feedback",
        type: "text",
        text: "بصراحة، إيه أكتر حاجة بتضايقك في التسوق التقليدي؟ ولو عندك فكرة مجنونة تتمنى تشوفها في ShopMate AI، اكتبهالنا هنا! 👇",
        placeholder: "اكتب رأيك بحرية... كل فكرة هتفرق معانا 💡",
    },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "110%" : "-110%", opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? "110%" : "-110%", opacity: 0, scale: 0.97 }),
};

// ── Feature list for intro ─────────────────────────────────────────────────
const features = [
    { icon: "🤖", title: "المساعد الذكي", desc: "اسأله عن وصفات أكل، أماكن المنتجات، وبدائل التوفير — Chat Bot مدرب بالكامل ومربوط بكل أقسام البرنامج." },
    { icon: "📝", title: "القائمة الذكية", desc: "اكتب طلباتك ومش هتنسى حاجة تاني — هنرتبهالك وننظمهالك." },
    { icon: "🔲", title: "الماسح الضوئي (سكانر)", desc: "امسح أي باركود واعرف سعره وتفاصيله فوراً بدون ما تسأل حد." },
    { icon: "🎮", title: "وضع الأطفال", desc: "ألعاب ذكية تلهي أطفالك عشان تتسوق بهدوء — بتذكرة 5 جنيه لمدة نصف ساعة فقط." },
    { icon: "🏷️", title: "العروض الحصرية", desc: "هننبهك بأقوى عروض فتح الله في وقتها عشان ما تفوتكش فرصة." },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function SurveyPage() {
    const router = useRouter();
    const [introShown, setIntroShown] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [direction, setDirection] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [textInput, setTextInput] = useState("");

    const question = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    // ── INTRO SCREEN ──────────────────────────────────────────────────────
    if (!introShown) {
        return (
            <div className="fixed inset-0 flex flex-col overflow-y-auto" style={{ background: '#dbe3c9' }}>
                <div className="flex flex-col items-center px-6 py-12 max-w-3xl mx-auto w-full">

                    {/* Logo */}
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-8">
                        <Image src="/ShopMate_logo.svg" alt="ShopMate" width={40} height={40} />
                        <span className="text-xl font-bold" style={{ color: '#69482d', fontFamily: 'var(--font-fredoka)' }}>ShopMate AI</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(224,123,55,0.15)', color: '#e07b37' }}>
                            Capstone Team 21
                        </span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-center leading-relaxed mb-4"
                        style={{ color: '#69482d', fontFamily: 'var(--font-fredoka)', direction: 'rtl' }}>
                        مرحباً بك في مستقبل التسوق مع ShopMate AI 🛒✨
                    </motion.h1>

                    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }}
                        className="h-1 w-20 rounded-full mb-6" style={{ background: '#e07b37', transformOrigin: 'center' }} />

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                        className="text-base md:text-lg text-center leading-relaxed mb-10 max-w-xl"
                        style={{ color: 'rgba(105,72,45,0.7)', direction: 'rtl' }}>
                        تخيل عربة تسوق في أسواق فتح الله مزودة بشاشة ذكية تعمل بالذكاء الاصطناعي
                        لتسهيل رحلتك وتوفير وقتك ومجهودك.
                    </motion.p>

                    {/* Feature Cards */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        {features.map((f, i) => (
                            <motion.div key={f.title}
                                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 + i * 0.1, type: "spring", stiffness: 280, damping: 26 }}
                                className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                    style={{ background: 'rgba(224,123,55,0.12)' }}>{f.icon}</div>
                                <div className="text-right flex-1">
                                    <h3 className="font-bold text-base mb-1"
                                        style={{ color: '#69482d', fontFamily: 'var(--font-fredoka)', direction: 'rtl' }}>{f.title}</h3>
                                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(105,72,45,0.65)', direction: 'rtl' }}>{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.0, type: "spring", stiffness: 260 }}
                        whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setIntroShown(true)}
                        className="w-full max-w-sm py-5 rounded-2xl font-bold text-xl text-white"
                        style={{ background: 'linear-gradient(135deg, #e07b37 0%, #c4622a 100%)', boxShadow: '0 8px 24px rgba(224,123,55,0.4)', fontFamily: 'var(--font-fredoka)' }}>
                        رأيك يهمنا.. ابدأ الاستبيان 🚀
                    </motion.button>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                        className="mt-5 text-xs text-center opacity-40" style={{ color: '#69482d' }}>
                        بياناتك آمنة ومش هنشاركها مع أي طرف ثالث 🔒
                    </motion.p>
                </div>
            </div>
        );
    }

    // ── SUBMIT ────────────────────────────────────────────────────────────
    const submitSurvey = async (finalAnswers: Record<string, string>) => {
        setIsSubmitting(true);
        try {
            await fetch('/api/survey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalAnswers),
            });
        } catch (err) {
            console.error('Failed to submit survey:', err);
        }
        setCookie('survey_completed', 'true', 365);
        router.push('/');
    };

    // ── HANDLE CHOICE ANSWER ──────────────────────────────────────────────
    const handleChoiceAnswer = async (value: string) => {
        if (selectedValue) return;
        setSelectedValue(value);
        await new Promise((r) => setTimeout(r, 380));
        const newAnswers = { ...answers, [question.id]: value };
        setAnswers(newAnswers);
        setSelectedValue(null);
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
    };

    // ── HANDLE TEXT SUBMIT ────────────────────────────────────────────────
    const handleTextSubmit = async () => {
        const finalAnswers = { ...answers, [question.id]: textInput.trim() || "بدون تعليق" };
        await submitSurvey(finalAnswers);
    };

    // ── LOADING SCREEN ────────────────────────────────────────────────────
    if (isSubmitting) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center gap-6" style={{ background: '#dbe3c9' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-14 h-14 border-4 border-[#69482d]/20 border-t-[#e07b37] rounded-full" />
                <p className="text-2xl font-bold" style={{ color: '#69482d', fontFamily: 'var(--font-fredoka)' }}>
                    جاري تأكيد مشاركتك...
                </p>
            </div>
        );
    }

    // ── SURVEY SCREEN ─────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ background: '#dbe3c9' }}>

            {/* Header */}
            <div className="flex-shrink-0 px-6 md:px-10 pt-8 pb-5">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <Image src="/ShopMate_logo.svg" alt="ShopMate" width={32} height={32} />
                        <span className="text-base font-bold" style={{ color: '#69482d', fontFamily: 'var(--font-fredoka)' }}>ShopMate AI</span>
                    </div>
                    {/* Pill indicators */}
                    <div className="flex items-center gap-1.5">
                        {questions.map((_, i) => (
                            <motion.div key={i}
                                animate={{ width: i === currentIndex ? 24 : 8, opacity: i <= currentIndex ? 1 : 0.3 }}
                                transition={{ duration: 0.3 }}
                                className="h-2 rounded-full"
                                style={{ background: i === currentIndex ? '#e07b37' : '#69482d' }} />
                        ))}
                    </div>
                </div>
                {/* Progress */}
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(105,72,45,0.12)' }}>
                    <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #e07b37, #f5a05f)' }} />
                </div>
            </div>

            {/* Question area */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 md:px-10 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div key={currentIndex} custom={direction}
                        variants={slideVariants} initial="enter" animate="center" exit="exit"
                        transition={{ type: "spring", stiffness: 350, damping: 35 }}
                        className="w-full max-w-2xl">

                        {/* Question number chip */}
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.02 }}
                            className="flex justify-center mb-4">
                            <span className="text-xs font-bold px-3 py-1 rounded-full"
                                style={{ background: 'rgba(224,123,55,0.15)', color: '#e07b37', letterSpacing: '0.05em' }}>
                                سؤال {currentIndex + 1} من {questions.length}
                            </span>
                        </motion.div>

                        {/* Question text */}
                        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
                            className="text-xl sm:text-2xl md:text-[1.85rem] font-extrabold text-center leading-loose mb-8"
                            style={{
                                color: '#3d2510',
                                direction: 'rtl',
                                fontFamily: 'var(--font-cairo), "Segoe UI", system-ui, sans-serif',
                                lineHeight: 1.7,
                            }}>
                            {question.text}
                        </motion.h2>


                        {/* CHOICE question */}
                        {question.type === "choice" && (
                            <div className={`grid gap-3 ${question.options.length === 4
                                ? 'grid-cols-1 sm:grid-cols-2'
                                : 'grid-cols-1 sm:grid-cols-3'
                                }`}>
                                {question.options.map((option, i) => {
                                    const isSelected = selectedValue === option.value;
                                    return (
                                        <motion.button key={option.value}
                                            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.08 + i * 0.07, type: "spring", stiffness: 300 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => handleChoiceAnswer(option.value)}
                                            className="flex items-center gap-4 w-full px-4 py-4 md:py-5 rounded-2xl text-right outline-none transition-all duration-150"
                                            style={{
                                                background: isSelected ? '#b55820' : '#e07b37',
                                                boxShadow: isSelected
                                                    ? '0 2px 8px rgba(105,72,45,0.25), inset 0 2px 4px rgba(0,0,0,0.1)'
                                                    : '0 5px 18px rgba(224,123,55,0.35)',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (isSelected) return;
                                                (e.currentTarget as HTMLButtonElement).style.background = '#d4702f';
                                                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                if (isSelected) return;
                                                (e.currentTarget as HTMLButtonElement).style.background = '#e07b37';
                                                (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                                            }}>
                                            {/* Emoji bubble */}
                                            <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                                                style={{ background: 'rgba(255,255,255,0.2)' }}>
                                                {option.emoji}
                                            </div>
                                            {/* Label */}
                                            <span className="flex-1 text-sm md:text-base font-bold leading-snug text-white"
                                                style={{ fontFamily: 'var(--font-cairo), var(--font-fredoka), sans-serif', direction: 'rtl' }}>
                                                {option.label}
                                            </span>
                                            {/* Check indicator */}
                                            {isSelected && (
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                                                    style={{ background: 'rgba(255,255,255,0.3)' }}>
                                                    <span className="text-white text-xs font-bold">✓</span>
                                                </div>
                                            )}
                                        </motion.button>

                                    );
                                })}
                            </div>
                        )}

                        {/* TEXT question */}
                        {question.type === "text" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                                className="flex flex-col gap-4">
                                <textarea
                                    rows={5}
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder={(question as TextQuestion).placeholder}
                                    className="w-full rounded-2xl p-5 text-base resize-none outline-none shadow-sm"
                                    style={{
                                        background: '#ffffff',
                                        color: '#69482d',
                                        border: '2px solid rgba(224,123,55,0.25)',
                                        fontFamily: 'var(--font-fredoka)',
                                        direction: 'rtl',
                                    }}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = '#e07b37'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(224,123,55,0.15)'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(224,123,55,0.25)'; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}
                                    onClick={handleTextSubmit}
                                    className="w-full py-5 rounded-2xl font-bold text-xl text-white"
                                    style={{ background: 'linear-gradient(135deg, #e07b37 0%, #c4622a 100%)', boxShadow: '0 8px 24px rgba(224,123,55,0.4)', fontFamily: 'var(--font-fredoka)' }}>
                                    إرسال رأيي 🚀
                                </motion.button>
                                <p className="text-center text-xs opacity-50" style={{ color: '#69482d' }}>
                                    يمكنك تخطي هذا السؤال بالضغط على الزر مباشرة
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-8 pb-8 text-center">
                <p className="text-xs opacity-40" style={{ color: '#69482d' }}>مشاركتك تساعدنا نبني تجربة تسوق أفضل ليك 💪</p>
            </div>
        </div>
    );
}
