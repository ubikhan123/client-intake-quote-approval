"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3 | 4;

const STEPS = [
    { num: 1, label: "Project" },
    { num: 2, label: "Timeline" },
    { num: 3, label: "Features" },
    { num: 4, label: "Contact" },
];

const PROJECT_TYPES = [
    { value: "landing", label: "Landing Page", icon: "🎯", desc: "Single-page marketing site" },
    { value: "corporate", label: "Corporate Site", icon: "🏢", desc: "Multi-page company website" },
    { value: "ecommerce", label: "E-commerce", icon: "🛒", desc: "Online store with products" },
    { value: "webapp-ui", label: "Web App UI", icon: "💻", desc: "Dashboard or SaaS UI" },
];

const COMPLEXITY_OPTIONS = [
    { value: "simple", label: "Simple", desc: "Clean, minimal design", price: "$50/page" },
    { value: "standard", label: "Standard", desc: "Custom design with interactions", price: "$90/page" },
    { value: "premium", label: "Premium", desc: "Bespoke, production-grade", price: "$140/page" },
];

const TIMELINE_OPTIONS = [
    { value: "3days", label: "3 Days ⚡", desc: "Rush delivery", rush: true },
    { value: "1week", label: "1 Week 🔥", desc: "Fast delivery", rush: true },
    { value: "2to4weeks", label: "2–4 Weeks ✅", desc: "Standard delivery", rush: false },
];

const FEATURES = [
    { value: "auth", label: "Authentication", icon: "🔐", price: "+$120" },
    { value: "adminPanel", label: "Admin Panel", icon: "⚙️", price: "+$200" },
    { value: "payments", label: "Payments", icon: "💳", price: "+$250" },
    { value: "blogCMS", label: "Blog / CMS", icon: "📝", price: "+$120" },
    { value: "multilingual", label: "Multilingual", icon: "🌍", price: "+$100" },
    { value: "animations", label: "Animations", icon: "✨", price: "+$80" },
];

const BUDGET_RANGES = ["Under $500", "$500–$1,000", "$1,000–$2,500", "$2,500–$5,000", "$5,000+"];

interface FormData {
    projectType: string;
    pages: number;
    complexity: string;
    timeline: string;
    rush: boolean;
    features: string[];
    budgetRange: string;
    name: string;
    email: string;
    company: string;
}

const defaultForm: FormData = {
    projectType: "",
    pages: 5,
    complexity: "",
    timeline: "",
    rush: false,
    features: [],
    budgetRange: "",
    name: "",
    email: "",
    company: "",
};

export default function QuotePage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>(1);
    const [form, setForm] = useState<FormData>(defaultForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const set = (key: keyof FormData, value: any) => setForm((f) => ({ ...f, [key]: value }));

    const toggleFeature = (val: string) => {
        set("features", form.features.includes(val)
            ? form.features.filter((f) => f !== val)
            : [...form.features, val]
        );
    };

    const canProceed = () => {
        if (step === 1) return form.projectType && form.complexity && form.pages >= 1;
        if (step === 2) return form.timeline !== "";
        if (step === 3) return true;
        return form.name.trim() && form.email.includes("@");
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    pages: Number(form.pages),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.[0]?.message ?? "Failed to submit");
            router.push(`/quote/${data.publicToken}`);
        } catch (e: any) {
            setError(e.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-950 flex flex-col">
            {/* Nav */}
            <nav className="glass border-b border-white/5 px-6 py-4 flex items-center gap-3">
                <a href="/" className="flex items-center gap-2">
                    <span className="text-xl">⬡</span>
                    <span className="font-bold text-base tracking-tight">ClientQuote</span>
                </a>
                <span className="text-gray-600">/</span>
                <span className="text-gray-400 text-sm">New Quote</span>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-start py-12 px-4">
                <div className="w-full max-w-2xl">
                    {/* Progress */}
                    <div className="flex items-center gap-3 mb-10">
                        {STEPS.map((s, i) => (
                            <div key={s.num} className="flex items-center gap-3 flex-1">
                                <button
                                    onClick={() => step > s.num && setStep(s.num as Step)}
                                    className={`w-9 h-9 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${step === s.num
                                            ? "btn-glow text-white scale-110"
                                            : step > s.num
                                                ? "bg-indigo-600/40 text-indigo-300 hover:bg-indigo-600/60 cursor-pointer"
                                                : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {step > s.num ? "✓" : s.num}
                                </button>
                                <span className={`text-sm font-medium hidden sm:block ${step === s.num ? "text-white" : "text-gray-500"}`}>
                                    {s.label}
                                </span>
                                {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-px ${step > s.num ? "bg-indigo-600/40" : "bg-gray-800"}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Card */}
                    <div className="glass rounded-3xl p-8 border border-white/5">
                        {/* Step 1: Project Basics */}
                        {step === 1 && (
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">Project Basics</h2>
                                <p className="text-gray-400 text-sm mb-8">Tell us what kind of project you need.</p>

                                <div className="mb-7">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">Project Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {PROJECT_TYPES.map((pt) => (
                                            <button
                                                key={pt.value}
                                                onClick={() => set("projectType", pt.value)}
                                                className={`text-left p-4 rounded-2xl border transition-all ${form.projectType === pt.value
                                                        ? "border-indigo-500 bg-indigo-600/15"
                                                        : "border-white/5 bg-white/2 hover:border-white/15"
                                                    }`}
                                            >
                                                <div className="text-2xl mb-1">{pt.icon}</div>
                                                <div className="font-semibold text-white text-sm">{pt.label}</div>
                                                <div className="text-gray-500 text-xs mt-0.5">{pt.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-7">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">
                                        Number of Pages: <span className="text-indigo-400 font-mono">{form.pages}</span>
                                    </label>
                                    <input
                                        type="range" min={1} max={30} value={form.pages}
                                        onChange={(e) => set("pages", parseInt(e.target.value))}
                                        className="w-full accent-indigo-500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>1 page</span><span>30 pages</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">Design Complexity</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {COMPLEXITY_OPTIONS.map((c) => (
                                            <button
                                                key={c.value}
                                                onClick={() => set("complexity", c.value)}
                                                className={`p-4 rounded-2xl border text-center transition-all ${form.complexity === c.value
                                                        ? "border-indigo-500 bg-indigo-600/15"
                                                        : "border-white/5 bg-white/2 hover:border-white/15"
                                                    }`}
                                            >
                                                <div className="font-bold text-white text-sm">{c.label}</div>
                                                <div className="text-gray-500 text-xs mt-1">{c.desc}</div>
                                                <div className="text-indigo-400 font-mono text-xs mt-2">{c.price}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Timeline */}
                        {step === 2 && (
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">Timeline</h2>
                                <p className="text-gray-400 text-sm mb-8">When do you need this delivered?</p>
                                <div className="flex flex-col gap-4">
                                    {TIMELINE_OPTIONS.map((t) => (
                                        <button
                                            key={t.value}
                                            onClick={() => { set("timeline", t.value); set("rush", t.rush); }}
                                            className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all ${form.timeline === t.value
                                                    ? "border-indigo-500 bg-indigo-600/15"
                                                    : "border-white/5 bg-white/2 hover:border-white/15"
                                                }`}
                                        >
                                            <div className="flex-1">
                                                <div className="font-bold text-white">{t.label}</div>
                                                <div className="text-gray-400 text-sm">{t.desc}</div>
                                            </div>
                                            {t.rush && (
                                                <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                                                    RUSH +20%
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Features */}
                        {step === 3 && (
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">Add-on Features</h2>
                                <p className="text-gray-400 text-sm mb-8">Select any features you need (optional).</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {FEATURES.map((f) => {
                                        const selected = form.features.includes(f.value);
                                        return (
                                            <button
                                                key={f.value}
                                                onClick={() => toggleFeature(f.value)}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${selected
                                                        ? "border-indigo-500 bg-indigo-600/15"
                                                        : "border-white/5 bg-white/2 hover:border-white/15"
                                                    }`}
                                            >
                                                <div className="text-2xl">{f.icon}</div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-white text-sm">{f.label}</div>
                                                    <div className="text-indigo-400 font-mono text-xs">{f.price}</div>
                                                </div>
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${selected ? "bg-indigo-600 border-indigo-500 text-white" : "border-gray-700"
                                                    }`}>
                                                    {selected && "✓"}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Contact */}
                        {step === 4 && (
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">Your Details</h2>
                                <p className="text-gray-400 text-sm mb-8">Where should we send the quote?</p>
                                {error && (
                                    <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}
                                <div className="flex flex-col gap-5">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Full Name *</label>
                                        <input
                                            type="text" value={form.name} placeholder="Jane Smith"
                                            onChange={(e) => set("name", e.target.value)}
                                            className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Email Address *</label>
                                        <input
                                            type="email" value={form.email} placeholder="jane@company.com"
                                            onChange={(e) => set("email", e.target.value)}
                                            className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Company (optional)</label>
                                        <input
                                            type="text" value={form.company} placeholder="Acme Inc."
                                            onChange={(e) => set("company", e.target.value)}
                                            className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Budget Range (optional)</label>
                                        <select
                                            value={form.budgetRange}
                                            onChange={(e) => set("budgetRange", e.target.value)}
                                            className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        >
                                            <option value="">Select a range…</option>
                                            {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer nav */}
                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                            <button
                                onClick={() => step > 1 && setStep((step - 1) as Step)}
                                disabled={step === 1}
                                className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 transition-colors text-sm font-medium"
                            >
                                ← Back
                            </button>
                            {step < 4 ? (
                                <button
                                    onClick={() => setStep((step + 1) as Step)}
                                    disabled={!canProceed()}
                                    className="btn-glow px-7 py-3 rounded-xl text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                                >
                                    Continue →
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || loading}
                                    className="btn-glow px-7 py-3 rounded-xl text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Generating…
                                        </>
                                    ) : (
                                        "Generate My Quote →"
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
