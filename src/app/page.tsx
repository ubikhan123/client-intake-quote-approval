import Link from "next/link";

const features = [
    {
        icon: "⚡",
        title: "Instant Quote",
        desc: "Fill out a brief and get a detailed, itemized quote in seconds — no waiting, no back-and-forth.",
    },
    {
        icon: "🔒",
        title: "Secure Approval",
        desc: "Review line items, delivery estimates, and approve with your digital signature from any device.",
    },
    {
        icon: "📄",
        title: "PDF Export",
        desc: "Download a professional PDF quote for your records — complete with all pricing details.",
    },
];

const projectTypes = [
    { label: "Landing Page", icon: "🎯", price: "From $150" },
    { label: "Corporate Site", icon: "🏢", price: "From $360" },
    { label: "E-commerce", icon: "🛒", price: "From $700" },
    { label: "Web App UI", icon: "💻", price: "From $450" },
];

const steps = [
    { step: "01", title: "Describe Your Project", desc: "Tell us what you need — pages, type, timeline, features." },
    { step: "02", title: "Get Your Quote", desc: "Our engine generates a detailed, itemized quote instantly." },
    { step: "03", title: "Review & Approve", desc: "Share the quote link, review, and digitally approve online." },
];

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gray-950 overflow-x-hidden">
            {/* Nav */}
            <nav className="glass sticky top-0 z-50 border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">⬡</span>
                    <span className="font-bold text-lg tracking-tight">ClientQuote</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/quote" className="text-gray-400 hover:text-white text-sm transition-colors animated-link">
                        Get Quote
                    </Link>
                    <Link href="/admin" className="text-gray-400 hover:text-white text-sm transition-colors animated-link">
                        Admin
                    </Link>
                    <Link
                        href="/quote"
                        className="btn-glow px-4 py-2 rounded-xl text-sm font-semibold text-white"
                    >
                        Start Project →
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative px-6 pt-24 pb-32 text-center max-w-5xl mx-auto">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-indigo-400 text-sm font-medium mb-8 border border-indigo-500/20">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Instant quotes, no sign-up required
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
                        <span className="text-white">From brief to</span>
                        <br />
                        <span className="gradient-text">approved quote</span>
                        <br />
                        <span className="text-white">in minutes.</span>
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stop wasting time on back-and-forth emails. Get a transparent, itemized project quote instantly — then share a link for client approval.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/quote"
                            className="btn-glow px-8 py-4 rounded-2xl text-white font-bold text-lg w-full sm:w-auto"
                        >
                            Get Your Free Quote →
                        </Link>
                        <Link
                            href="/admin"
                            className="glass border border-white/10 px-8 py-4 rounded-2xl text-gray-300 font-semibold text-base hover:border-indigo-500/50 transition-colors w-full sm:w-auto text-center"
                        >
                            View Admin Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Project Types */}
            <section className="px-6 pb-24 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {projectTypes.map((pt) => (
                        <Link
                            key={pt.label}
                            href="/quote"
                            className="glass rounded-2xl p-6 text-center hover:border-indigo-500/40 transition-all hover:-translate-y-1 group"
                        >
                            <div className="text-4xl mb-3">{pt.icon}</div>
                            <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{pt.label}</div>
                            <div className="text-indigo-400 text-sm mt-1 font-mono">{pt.price}</div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="px-6 py-24 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-white mb-4">
                        Everything you need to <span className="gradient-text">close faster</span>
                    </h2>
                    <p className="text-gray-400 text-lg">Professional quotes that convert clients.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((f) => (
                        <div key={f.title} className="glass rounded-2xl p-8 hover:border-indigo-500/30 transition-all">
                            <div className="text-4xl mb-4">{f.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it Works */}
            <section className="px-6 py-24 bg-gray-900/30 border-y border-white/5">
                <div className="max-w-5xl mx-auto text-center mb-16">
                    <h2 className="text-4xl font-black text-white mb-4">
                        How it <span className="gradient-text">works</span>
                    </h2>
                </div>
                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
                    {steps.map((s) => (
                        <div key={s.step} className="flex flex-col items-center text-center glass rounded-2xl p-8">
                            <div className="w-14 h-14 btn-glow rounded-2xl flex items-center justify-center text-white font-black text-xl mb-5">
                                {s.step}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">{s.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-32 text-center max-w-3xl mx-auto">
                <h2 className="text-5xl font-black text-white mb-6">
                    Ready to get your <span className="gradient-text">quote?</span>
                </h2>
                <p className="text-gray-400 text-lg mb-10">
                    No account needed. Takes 2 minutes. Instantly shareable.
                </p>
                <Link
                    href="/quote"
                    className="btn-glow inline-block px-10 py-5 rounded-2xl text-white font-bold text-xl"
                >
                    Start Your Free Quote →
                </Link>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 px-6 py-10 text-center text-gray-500 text-sm">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-xl">⬡</span>
                    <span className="font-semibold text-gray-400">ClientQuote</span>
                </div>
                <p>Built with Next.js · Prisma · Clerk · pdfkit</p>
            </footer>
        </main>
    );
}
