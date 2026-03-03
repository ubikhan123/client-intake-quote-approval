"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface Lead {
    id: string;
    name: string;
    email: string;
    company: string | null;
    status: string;
    publicToken: string;
    createdAt: string;
    quote: { total: number; approvedAt: string | null } | null;
}

const STATUS_TABS = ["ALL", "NEW", "QUOTED", "APPROVED", "ARCHIVED"];

const STATUS_CONFIG: Record<string, { cls: string; label: string }> = {
    NEW: { cls: "badge-new", label: "New" },
    QUOTED: { cls: "badge-quoted", label: "Quoted" },
    APPROVED: { cls: "badge-approved", label: "Approved" },
    ARCHIVED: { cls: "badge-archived", label: "Archived" },
};

function fmt(n: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function AdminDashboardClient({
    leads,
    activeStatus,
}: {
    leads: Lead[];
    activeStatus: string;
}) {
    const router = useRouter();

    const copyShareLink = (token: string) => {
        const url = `${window.location.origin}/quote/${token}`;
        navigator.clipboard.writeText(url);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Leads Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">{leads.length} leads found</p>
                </div>
                <Link href="/quote" className="btn-glow px-5 py-2.5 rounded-xl text-white font-semibold text-sm">
                    + New Quote
                </Link>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
                {STATUS_TABS.map((s) => (
                    <Link
                        key={s}
                        href={s === "ALL" ? "/admin" : `/admin?status=${s}`}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeStatus === s
                                ? "btn-glow text-white"
                                : "glass text-gray-400 hover:text-white border border-white/5"
                            }`}
                    >
                        {s}
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {leads.length === 0 && (
                <div className="glass rounded-2xl p-16 text-center">
                    <div className="text-5xl mb-4">📭</div>
                    <h3 className="text-xl font-bold text-white mb-2">No leads yet</h3>
                    <p className="text-gray-400 mb-6">
                        {activeStatus !== "ALL"
                            ? `No leads with status "${activeStatus}".`
                            : "Share the quote form link to start collecting leads."}
                    </p>
                    <Link href="/quote" className="btn-glow px-6 py-3 rounded-xl text-white font-semibold inline-block">
                        Create First Quote
                    </Link>
                </div>
            )}

            {/* Table */}
            {leads.length > 0 && (
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-4">Client</th>
                                    <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                                    <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-4">Quote Total</th>
                                    <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-6 py-4">Date</th>
                                    <th className="text-right text-xs text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {leads.map((lead) => {
                                    const sc = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.NEW;
                                    return (
                                        <tr
                                            key={lead.id}
                                            className="hover:bg-white/2 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-white">{lead.name}</div>
                                                <div className="text-gray-400 text-sm">{lead.email}</div>
                                                {lead.company && (
                                                    <div className="text-gray-600 text-xs">{lead.company}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${sc.cls}`}>
                                                    {sc.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-indigo-400 font-mono font-semibold">
                                                    {lead.quote ? fmt(lead.quote.total) : "—"}
                                                </span>
                                                {lead.quote?.approvedAt && (
                                                    <div className="text-emerald-400 text-xs mt-0.5">✓ Approved</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {new Date(lead.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => copyShareLink(lead.publicToken)}
                                                        title="Copy share link"
                                                        className="p-2 rounded-lg glass text-gray-400 hover:text-white text-sm transition-colors"
                                                    >
                                                        🔗
                                                    </button>
                                                    <a
                                                        href={`/api/quote/${lead.publicToken}/pdf`}
                                                        download
                                                        title="Download PDF"
                                                        className="p-2 rounded-lg glass text-gray-400 hover:text-white text-sm transition-colors"
                                                    >
                                                        📄
                                                    </a>
                                                    <Link
                                                        href={`/admin/leads/${lead.id}`}
                                                        className="px-3 py-2 rounded-lg btn-glow text-white text-xs font-semibold"
                                                    >
                                                        View →
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
