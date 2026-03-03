"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface QuoteItem {
    label: string;
    qty: number;
    unitPrice: number;
    total: number;
}

interface Quote {
    id: string;
    itemsJson: QuoteItem[];
    subtotal: number;
    rushFee: number;
    discount: number;
    total: number;
    currency: string;
    approvedAt: string | null;
    approvedByName: string | null;
}

interface Lead {
    id: string;
    name: string;
    email: string;
    company: string | null;
    status: string;
    publicToken: string;
    createdAt: string;
    briefJson: any;
    quote: Quote;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
    NEW: { label: "New", cls: "badge-new" },
    QUOTED: { label: "Quote Sent", cls: "badge-quoted" },
    APPROVED: { label: "Approved ✓", cls: "badge-approved" },
    ARCHIVED: { label: "Archived", cls: "badge-archived" },
};

function fmt(n: number, currency = "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
}

export default function QuoteTokenPage({ params }: { params: Promise<{ token: string }> }) {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [approvalName, setApprovalName] = useState("");
    const [accepted, setAccepted] = useState(false);
    const [approving, setApproving] = useState(false);
    const [approvalError, setApprovalError] = useState("");

    useEffect(() => {
        params.then(({ token: t }) => {
            setToken(t);
            fetch(`/api/quote/${t}`)
                .then((r) => r.json())
                .then((d) => {
                    if (d.lead) setLead(d.lead);
                    else setNotFound(true);
                })
                .catch(() => setNotFound(true))
                .finally(() => setLoading(false));
        });
    }, [params]);

    const handleApprove = async () => {
        if (!approvalName.trim() || !accepted || !token) return;
        setApproving(true);
        setApprovalError("");
        try {
            const res = await fetch(`/api/quote/${token}/approve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ approvedByName: approvalName, acceptedTerms: true }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Approval failed");
            // Refresh
            const updated = await fetch(`/api/quote/${token}`).then((r) => r.json());
            if (updated.lead) setLead(updated.lead);
        } catch (e: any) {
            setApprovalError(e.message);
        } finally {
            setApproving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin w-12 h-12 text-indigo-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <p className="text-gray-400">Loading your quote…</p>
                </div>
            </div>
        );
    }

    if (notFound || !lead) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-center px-4">
                <div>
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Quote not found</h1>
                    <p className="text-gray-400 mb-6">This quote link may be invalid or expired.</p>
                    <a href="/quote" className="btn-glow px-6 py-3 rounded-xl text-white font-semibold">
                        Get a New Quote
                    </a>
                </div>
            </div>
        );
    }

    const q = lead.quote;
    const statusCfg = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.NEW;
    const isApproved = !!q.approvedAt;

    return (
        <main className="min-h-screen bg-gray-950">
            {/* Nav */}
            <nav className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
                <a href="/" className="flex items-center gap-2">
                    <span className="text-xl">⬡</span>
                    <span className="font-bold">ClientQuote</span>
                </a>
                <a
                    href={`/api/quote/${token}/pdf`}
                    download
                    className="flex items-center gap-2 glass border border-white/10 px-4 py-2 rounded-xl text-sm text-gray-300 hover:border-indigo-500/50 transition-colors"
                >
                    <span>📄</span> Download PDF
                </a>
            </nav>

            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-1">Project Quote</h1>
                        <p className="text-gray-500 text-sm font-mono">#{token?.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold ${statusCfg.cls}`}>
                        {statusCfg.label}
                    </span>
                </div>

                {/* Client Info */}
                <div className="glass rounded-2xl p-6 mb-6">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Client Information</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Name</div>
                            <div className="text-white font-medium">{lead.name}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Email</div>
                            <div className="text-white">{lead.email}</div>
                        </div>
                        {lead.company && (
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Company</div>
                                <div className="text-white">{lead.company}</div>
                            </div>
                        )}
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Date</div>
                            <div className="text-white">{new Date(lead.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                        </div>
                        {lead.briefJson?.deliveryEstimate && (
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Delivery Estimate</div>
                                <div className="text-indigo-400 font-medium">{lead.briefJson.deliveryEstimate}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Line Items */}
                <div className="glass rounded-2xl p-6 mb-6">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Quote Details</h2>
                    <div className="divide-y divide-white/5">
                        <div className="grid grid-cols-12 text-xs text-gray-500 uppercase tracking-wider pb-3">
                            <div className="col-span-6">Description</div>
                            <div className="col-span-2 text-center">Qty</div>
                            <div className="col-span-2 text-right">Unit Price</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>
                        {(q.itemsJson ?? []).map((item, i) => (
                            <div key={i} className="grid grid-cols-12 py-3 text-sm">
                                <div className="col-span-6 text-white font-medium">{item.label}</div>
                                <div className="col-span-2 text-center text-gray-400">{item.qty}</div>
                                <div className="col-span-2 text-right text-gray-400">{fmt(item.unitPrice, q.currency)}</div>
                                <div className="col-span-2 text-right text-white font-semibold">{fmt(item.total, q.currency)}</div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="mt-6 pt-5 border-t border-white/5 flex flex-col items-end gap-2">
                        <div className="flex gap-12 text-sm">
                            <span className="text-gray-400">Subtotal</span>
                            <span className="text-white font-medium w-24 text-right">{fmt(q.subtotal, q.currency)}</span>
                        </div>
                        {q.rushFee > 0 && (
                            <div className="flex gap-12 text-sm">
                                <span className="text-amber-400">Rush Fee (+20%)</span>
                                <span className="text-amber-400 font-medium w-24 text-right">+{fmt(q.rushFee, q.currency)}</span>
                            </div>
                        )}
                        {q.discount > 0 && (
                            <div className="flex gap-12 text-sm">
                                <span className="text-emerald-400">Volume Discount (−10%)</span>
                                <span className="text-emerald-400 font-medium w-24 text-right">−{fmt(q.discount, q.currency)}</span>
                            </div>
                        )}
                        <div className="flex gap-12 pt-2 border-t border-white/5 mt-1">
                            <span className="text-white font-bold text-base">Total</span>
                            <span className="text-indigo-400 font-black text-xl w-24 text-right">{fmt(q.total, q.currency)}</span>
                        </div>
                    </div>
                </div>

                {/* Approval Section */}
                {isApproved ? (
                    <div className="glass rounded-2xl p-6 border border-emerald-500/30 bg-emerald-500/5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-emerald-600/30 rounded-xl flex items-center justify-center text-emerald-400">✓</div>
                            <h2 className="text-emerald-400 font-bold">Quote Approved</h2>
                        </div>
                        <p className="text-gray-300 text-sm">
                            Approved by <strong className="text-white">{q.approvedByName}</strong> on{" "}
                            <strong className="text-white">{new Date(q.approvedAt!).toLocaleString("en-US")}</strong>
                        </p>
                    </div>
                ) : (
                    <div className="glass rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white mb-2">Approve This Quote</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            By approving, you agree to the scope and pricing outlined above.
                        </p>
                        {approvalError && (
                            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {approvalError}
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                                    Type your full name to sign *
                                </label>
                                <input
                                    type="text"
                                    value={approvalName}
                                    onChange={(e) => setApprovalName(e.target.value)}
                                    placeholder="Your full name"
                                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={accepted}
                                    onChange={(e) => setAccepted(e.target.checked)}
                                    className="mt-0.5 accent-indigo-500 w-4 h-4"
                                />
                                <span className="text-sm text-gray-400">
                                    I have read and accept the project scope, pricing, and terms outlined above.
                                </span>
                            </label>
                            <button
                                onClick={handleApprove}
                                disabled={!approvalName.trim() || !accepted || approving}
                                className="btn-glow py-3 rounded-xl text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {approving ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Approving…
                                    </>
                                ) : (
                                    "✓ Approve This Quote"
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
