"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface QuoteItem {
    label: string;
    qty: number;
    unitPrice: number;
    total: number;
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
    quote: {
        id: string;
        itemsJson: QuoteItem[];
        subtotal: number;
        rushFee: number;
        discount: number;
        total: number;
        currency: string;
        approvedAt: string | null;
        approvedByName: string | null;
    } | null;
}

const STATUSES = ["NEW", "QUOTED", "APPROVED", "ARCHIVED"];

function fmt(n: number, currency = "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
}

export default function LeadDetailClient({ lead }: { lead: Lead }) {
    const router = useRouter();
    const [status, setStatus] = useState(lead.status);
    const [items, setItems] = useState<QuoteItem[]>((lead.quote?.itemsJson as QuoteItem[]) ?? []);
    const [saving, setSaving] = useState(false);
    const [statusSaving, setStatusSaving] = useState(false);
    const [copyMsg, setCopyMsg] = useState("");

    const subtotal = items.reduce((a, i) => a + i.total, 0);
    const total = subtotal + (lead.quote?.rushFee ?? 0) - (lead.quote?.discount ?? 0);

    const updateItem = (idx: number, field: keyof QuoteItem, value: string | number) => {
        setItems((prev) => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: value };
            if (field === "qty" || field === "unitPrice") {
                updated[idx].total = Number(updated[idx].qty) * Number(updated[idx].unitPrice);
            }
            return updated;
        });
    };

    const addItem = () => {
        setItems((prev) => [...prev, { label: "New Item", qty: 1, unitPrice: 0, total: 0 }]);
    };

    const removeItem = (idx: number) => {
        setItems((prev) => prev.filter((_, i) => i !== idx));
    };

    const saveQuote = async () => {
        setSaving(true);
        try {
            await fetch(`/api/admin/quote/${lead.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            });
        } finally {
            setSaving(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        setStatusSaving(true);
        try {
            await fetch(`/api/admin/leads/${lead.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            setStatus(newStatus);
        } finally {
            setStatusSaving(false);
        }
    };

    const copyShareLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/quote/${lead.publicToken}`);
        setCopyMsg("Copied!");
        setTimeout(() => setCopyMsg(""), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link href="/admin" className="hover:text-white transition-colors">Dashboard</Link>
                <span>/</span>
                <span className="text-white">{lead.name}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-white">{lead.name}</h1>
                    <p className="text-gray-400">{lead.email}</p>
                    {lead.company && <p className="text-gray-500 text-sm">{lead.company}</p>}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={copyShareLink}
                        className="flex items-center gap-2 glass border border-white/10 px-4 py-2 rounded-xl text-sm text-gray-300 hover:border-indigo-500/50 transition-all"
                    >
                        🔗 {copyMsg || "Copy Share Link"}
                    </button>
                    <a
                        href={`/api/quote/${lead.publicToken}/pdf`}
                        download
                        className="flex items-center gap-2 glass border border-white/10 px-4 py-2 rounded-xl text-sm text-gray-300 hover:border-indigo-500/50 transition-all"
                    >
                        📄 Download PDF
                    </a>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left: Brief + Status */}
                <div className="flex flex-col gap-6">
                    {/* Status */}
                    <div className="glass rounded-2xl p-5">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Lead Status</h2>
                        <select
                            value={status}
                            onChange={(e) => updateStatus(e.target.value)}
                            disabled={statusSaving}
                            className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        >
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {statusSaving && <p className="text-xs text-indigo-400 mt-2">Updating…</p>}
                    </div>

                    {/* Brief */}
                    <div className="glass rounded-2xl p-5">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Project Brief</h2>
                        <div className="flex flex-col gap-3">
                            {Object.entries(lead.briefJson ?? {}).map(([k, v]) => (
                                <div key={k}>
                                    <div className="text-xs text-gray-500 capitalize">{k.replace(/([A-Z])/g, " $1")}</div>
                                    <div className="text-white text-sm font-medium mt-0.5">
                                        {Array.isArray(v) ? (v.length > 0 ? (v as string[]).join(", ") : "None") : String(v)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Approval info */}
                    {lead.quote?.approvedAt && (
                        <div className="glass rounded-2xl p-5 border border-emerald-500/20">
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Approval</h2>
                            <div className="text-emerald-400 font-bold text-sm mb-1">✓ Approved</div>
                            <div className="text-gray-300 text-sm">{lead.quote.approvedByName}</div>
                            <div className="text-gray-500 text-xs mt-1">{new Date(lead.quote.approvedAt).toLocaleString("en-US")}</div>
                        </div>
                    )}
                </div>

                {/* Right: Quote Editor */}
                <div className="md:col-span-2">
                    <div className="glass rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-white">Quote Items</h2>
                            <button
                                onClick={addItem}
                                className="text-xs glass border border-white/10 px-3 py-1.5 rounded-lg text-indigo-400 hover:border-indigo-500/50 transition-colors"
                            >
                                + Add Item
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex flex-col gap-3 mb-6">
                            <div className="grid grid-cols-12 text-xs text-gray-500 uppercase tracking-wider mb-1">
                                <div className="col-span-5">Description</div>
                                <div className="col-span-2 text-center">Qty</div>
                                <div className="col-span-2 text-center">Unit $</div>
                                <div className="col-span-2 text-right">Total</div>
                                <div className="col-span-1" />
                            </div>
                            {items.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                    <input
                                        value={item.label}
                                        onChange={(e) => updateItem(idx, "label", e.target.value)}
                                        className="col-span-5 bg-gray-900 border border-white/10 rounded-lg px-2.5 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                    <input
                                        type="number" value={item.qty} min={1}
                                        onChange={(e) => updateItem(idx, "qty", parseFloat(e.target.value))}
                                        className="col-span-2 bg-gray-900 border border-white/10 rounded-lg px-2 py-2 text-white text-sm text-center focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                    <input
                                        type="number" value={item.unitPrice} min={0}
                                        onChange={(e) => updateItem(idx, "unitPrice", parseFloat(e.target.value))}
                                        className="col-span-2 bg-gray-900 border border-white/10 rounded-lg px-2 py-2 text-white text-sm text-center focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                    <div className="col-span-2 text-right text-white text-sm font-mono">{fmt(item.total)}</div>
                                    <button
                                        onClick={() => removeItem(idx)}
                                        className="col-span-1 text-gray-600 hover:text-red-400 transition-colors text-center"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t border-white/5 pt-4 flex flex-col items-end gap-2">
                            <div className="flex gap-10 text-sm">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-white font-medium w-24 text-right">{fmt(subtotal)}</span>
                            </div>
                            {(lead.quote?.rushFee ?? 0) > 0 && (
                                <div className="flex gap-10 text-sm">
                                    <span className="text-amber-400">Rush Fee</span>
                                    <span className="text-amber-400 w-24 text-right">+{fmt(lead.quote!.rushFee)}</span>
                                </div>
                            )}
                            {(lead.quote?.discount ?? 0) > 0 && (
                                <div className="flex gap-10 text-sm">
                                    <span className="text-emerald-400">Discount</span>
                                    <span className="text-emerald-400 w-24 text-right">−{fmt(lead.quote!.discount)}</span>
                                </div>
                            )}
                            <div className="flex gap-10 pt-2 border-t border-white/5 mt-1">
                                <span className="text-white font-bold">Total</span>
                                <span className="text-indigo-400 font-black text-lg w-24 text-right">{fmt(total)}</span>
                            </div>
                        </div>

                        <button
                            onClick={saveQuote}
                            disabled={saving}
                            className="mt-6 w-full btn-glow py-3 rounded-xl text-white font-bold disabled:opacity-50"
                        >
                            {saving ? "Saving…" : "Save Quote Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
