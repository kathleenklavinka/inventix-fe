"use client";

import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { api, mapRoleToFrontend } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
type Actor = "Admin" | "Gudang" | "Sistem" | "Owner";
type Category = "Stock" | "Penjualan" | "Supplier" | "User" | "Sistem" | "Purchase Order";
type UserRole = "owner" | "admin" | "user" | "supplier";
type POStatus = "pending" | "approved" | "rejected" | "supplier_acc" | "completed";

interface ActivityLog {
  id: string;
  poId?: string;
  timestamp: string;
  actor: Actor;
  actorName: string;
  category: Category;
  action: string;
  detail: string;
  target?: string;
  status: "success" | "warning" | "info";
  readBy: Actor[];
  poAmount?: number;
  isPOWarning?: boolean;
  poStatus?: POStatus;
  supplierName?: string;
  poQty?: number;
  poSatuan?: string;
  stokId?: string;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins} mnt lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function groupByDate(logs: ActivityLog[]): Record<string, ActivityLog[]> {
  return logs.reduce((acc, log) => {
    const key = log.timestamp.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {} as Record<string, ActivityLog[]>);
}

function formatActivityAction(namaTabel: string, aksi: string): string {
  const t = namaTabel?.toLowerCase();
  const a = aksi?.toLowerCase();
  let actionStr = a === "buat" ? "Tambah" : a === "edit" ? "Ubah" : a === "hapus" ? "Hapus" : "Aktivitas";
  let tableStr = t === "stok" ? "Stok" : t === "supplier" ? "Supplier" : (t === "purchaseorder" || t === "purchase_order") ? "Purchase Order" : (t === "pembeliantransaksi" || t === "pembelian_transaksi") ? "Transaksi" : t === "akun" ? "User" : namaTabel || "Sistem";
  return `${actionStr} ${tableStr}`;
}

const ACTOR_STYLE: Record<Actor, { bg: string; text: string; dot: string; border: string }> = {
  Admin: { bg: "#D6EDF5", text: "#1A4D66", dot: "#81C3DE", border: "#B0D9EE" },
  Gudang: { bg: "#F5E6D6", text: "#7A4520", dot: "#E8A87C", border: "#F0C9A8" },
  Sistem: { bg: "#E8D6F5", text: "#5B2D8A", dot: "#C4A0E8", border: "#D8B8F5" },
  Owner: { bg: "#D6F5E8", text: "#1A6647", dot: "#78C89A", border: "#A8DEBC" },
};

const CAT_STYLE: Record<Category, { emoji: string; bg: string }> = {
  Stock: { emoji: "📦", bg: "#FEF9D6" },
  Penjualan: { emoji: "🧾", bg: "#D6F0F5" },
  Supplier: { emoji: "🏭", bg: "#D6F5E8" },
  User: { emoji: "👤", bg: "#E8D6F5" },
  Sistem: { emoji: "⚙️", bg: "#F5D6F0" },
  "Purchase Order": { emoji: "🛒", bg: "#FFF0E0" },
};

const STATUS_STYLE: Record<string, { bar: string; label: string }> = {
  success: { bar: "#78C89A", label: "#1A6647" },
  warning: { bar: "#E8A850", label: "#7A4A10" },
  info: { bar: "#81C3DE", label: "#1A4D66" },
};

const PO_STATUS_CONFIG: Record<POStatus, { label: string; bg: string; text: string; border: string; icon: string }> = {
  pending: { label: "Menunggu Approval", bg: "#FEF9D6", text: "#7A5A00", border: "#F5C878", icon: "⏳" },
  approved: { label: "Disetujui Owner", bg: "#D6F5E8", text: "#1A6647", border: "#A8DEBC", icon: "✅" },
  rejected: { label: "Ditolak Owner", bg: "#F5D6D6", text: "#8A2020", border: "#E8A8A8", icon: "❌" },
  supplier_acc: { label: "Diproses Supplier", bg: "#D6EDF5", text: "#1A4D66", border: "#B0D9EE", icon: "🏭" },
  completed: { label: "Selesai · Stok +", bg: "#D6F5E8", text: "#1A6647", border: "#78C89A", icon: "🎉" },
};

function ActorBadge({ actor }: { actor: Actor }) {
  const s = ACTOR_STYLE[actor] || ACTOR_STYLE.Sistem;
  return (
    <span style={{ background: s.bg, color: s.text, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", padding: "3px 9px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 4, border: `1.5px solid ${s.border}` }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {actor.toUpperCase()}
    </span>
  );
}

// ─── PO Status Badge ──────────────────────────────────────────────────────────
function POStatusBadge({ poStatus }: { poStatus: POStatus }) {
  const cfg = PO_STATUS_CONFIG[poStatus];
  return (
    <span style={{ background: cfg.bg, color: cfg.text, fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", padding: "3px 9px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 4, border: `1.5px solid ${cfg.border}` }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ─── Approve/Reject Confirm Modal ─────────────────────────────────────────────
function ConfirmModal({ log, action, onConfirm, onCancel }: {
  log: ActivityLog;
  action: "approve" | "reject";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const isApprove = action === "approve";
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(10,30,15,0.45)", backdropFilter: "blur(6px)" }}
      onClick={onCancel}
    >
      <div
        style={{ background: "#FFFFFF", borderRadius: 20, padding: "28px 28px 24px", maxWidth: 400, width: "100%", boxShadow: "0 24px 64px rgba(10,30,15,0.22)", border: `1.5px solid ${isApprove ? "#A8DEBC" : "#E8A8A8"}` }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ width: 48, height: 48, borderRadius: 16, background: isApprove ? "#D6F5E8" : "#F5D6D6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>
          {isApprove ? "✅" : "❌"}
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1C3320", margin: "0 0 6px", fontFamily: "var(--font-plus-jakarta),sans-serif" }}>
          {isApprove ? "Setujui Purchase Order?" : "Tolak Purchase Order?"}
        </h2>
        <p style={{ fontSize: 12, color: "#4A6B52", margin: "0 0 6px" }}>
          <strong style={{ color: "#1C3320" }}>{log.target}</strong>
        </p>
        <p style={{ fontSize: 12, color: "#4A6B52", margin: "0 0 16px" }}>
          Nilai: <strong style={{ color: isApprove ? "#1A6647" : "#8A2020" }}>{formatRupiah(log.poAmount!)}</strong>
        </p>
        {isApprove && (
          <div style={{ background: "#D6F5E8", borderRadius: 10, padding: "10px 12px", marginBottom: 16, fontSize: 11, color: "#1A6647", border: "1px solid #A8DEBC" }}>
            PO akan diteruskan ke <strong>{log.supplierName || "supplier"}</strong>. Stok akan bertambah setelah supplier konfirmasi.
          </div>
        )}
        {!isApprove && (
          <div style={{ background: "#F5D6D6", borderRadius: 10, padding: "10px 12px", marginBottom: 16, fontSize: 11, color: "#8A2020", border: "1px solid #E8A8A8" }}>
            PO akan dibatalkan.
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #D0E8D4", background: "#FFFFFF", color: "#4A6B52", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 2, padding: "10px", borderRadius: 10, border: "none", background: isApprove ? "linear-gradient(135deg,#3A8F46,#2D6B37)" : "linear-gradient(135deg,#C85040,#A83030)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            {isApprove ? "✅ Ya, Setujui & Teruskan ke Supplier" : "❌ Ya, Tolak PO"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PO Warning Card ──────────────────────────────────────────────────────────
function POWarningCard({ log, expanded, onToggle, isUnread, onDismiss, onApprove, onReject, userRole }: {
  log: ActivityLog;
  expanded: boolean;
  onToggle: () => void;
  isUnread: boolean;
  onDismiss: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  userRole: UserRole;
}) {
  const poStatus = log.poStatus ?? "pending";
  const cfg = PO_STATUS_CONFIG[poStatus];
  const isOwner = userRole === "owner";
  const isPending = poStatus === "pending";
  const isCompleted = poStatus === "completed";
  const isSupplierAcc = poStatus === "supplier_acc";

  // border color based on status
  const borderColor = poStatus === "pending" ? (expanded ? "#E8A850" : "#F5C878")
    : poStatus === "approved" || poStatus === "completed" || poStatus === "supplier_acc" ? "#A8DEBC"
      : "#E8A8A8";

  const bgColor = poStatus === "rejected" ? "#FFF8F8"
    : poStatus === "approved" || poStatus === "completed" || poStatus === "supplier_acc" ? "#F4FFF8"
      : expanded ? "#FFF8F0" : "#FFFAF4";

  return (
    <div
      onClick={onToggle}
      style={{ background: bgColor, border: `1.5px solid ${borderColor}`, borderRadius: 16, padding: "14px 16px 14px 20px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "box-shadow .2s, transform .2s, border-color .2s", boxShadow: expanded ? "0 8px 32px rgba(0,0,0,0.10)" : "0 2px 8px rgba(0,0,0,0.05)", transform: expanded ? "translateY(-1px)" : "none" }}
    >
      {/* Left accent bar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: poStatus === "rejected" ? "linear-gradient(180deg,#E85040,#C83030)" : poStatus === "approved" || poStatus === "completed" || poStatus === "supplier_acc" ? "linear-gradient(180deg,#4EA85A,#2D6B37)" : "linear-gradient(180deg,#F5A623,#E8792A)", borderRadius: "16px 0 0 16px" }} />

      {/* Dismiss button — only for non-pending */}
      {(poStatus === "rejected" || poStatus === "completed") && (
        <button
          onClick={e => { e.stopPropagation(); onDismiss(log.id); }}
          style={{ position: "absolute", top: 10, right: 10, width: 22, height: 22, borderRadius: 7, background: "rgba(0,0,0,0.08)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#888" }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {/* Icon */}
        <div style={{ width: 40, height: 40, borderRadius: 13, background: poStatus === "rejected" ? "#F5D6D6" : poStatus === "completed" || poStatus === "supplier_acc" || poStatus === "approved" ? "#D6F5E8" : "linear-gradient(135deg,#FFF0CC,#FFE0A0)", border: `1.5px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, position: "relative" }}>
          {cfg.icon}
          {isUnread && poStatus === "pending" && (
            <span style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8, borderRadius: "50%", background: "#F5837A", border: "2px solid #FFFAF4" }} />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0, paddingRight: poStatus === "rejected" || poStatus === "completed" ? 28 : 0 }}>
          {/* Top row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
            {/* Warning badge */}
            <span style={{ background: "#FEF0D6", color: "#8A4A00", fontSize: 9, fontWeight: 800, letterSpacing: "0.08em", padding: "3px 9px", borderRadius: 20, border: "1.5px solid #F5C878", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              PERINGATAN PO
            </span>
            {/* PO Status badge */}
            <POStatusBadge poStatus={poStatus} />
            <ActorBadge actor={log.actor} />
            <span style={{ fontSize: 10, color: "#A07840", fontWeight: 500 }}>{log.actorName}</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#A07840", fontWeight: 500, whiteSpace: "nowrap" }}>
              {formatTime(log.timestamp)} · {relativeTime(log.timestamp)}
            </span>
          </div>

          {/* Title + amount */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: poStatus === "rejected" ? "#8A2020" : "#6A3000", margin: 0 }}>
              {poStatus === "rejected" ? "PO Ditolak" : poStatus === "completed" ? "PO Selesai · Stok Bertambah" : poStatus === "supplier_acc" ? "PO di-ACC Supplier" : "Purchase Order Melebihi Batas"}
            </p>
            <span style={{ background: poStatus === "rejected" ? "linear-gradient(90deg,#E85040,#C83030)" : poStatus === "completed" || poStatus === "supplier_acc" || poStatus === "approved" ? "linear-gradient(90deg,#3A8F46,#2D6B37)" : "linear-gradient(90deg,#F5A623,#E8792A)", color: "#fff", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.02em" }}>
              {formatRupiah(log.poAmount!)}
            </span>
          </div>

          {log.target && (
            <p style={{ fontSize: 11, fontWeight: 600, color: "#8A4A00", margin: "3px 0 0" }}>
              🛒 {log.target}
              {log.supplierName && <span style={{ color: "#4A6B52", fontWeight: 500 }}> · 🏭 {log.supplierName}</span>}
            </p>
          )}

          {/* ── APPROVE / REJECT BUTTONS (owner only, pending only) ── */}
          {isOwner && isPending && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => onApprove(log.id)}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#3A8F46,#2D6B37)", color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.02em", boxShadow: "0 3px 12px rgba(45,107,55,0.30)" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                Setujui & Teruskan ke Supplier
              </button>
              <button
                onClick={() => onReject(log.id)}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1.5px solid #E8A8A8", background: "#FFF0F0", color: "#C83030", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.02em" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                Tolak
              </button>
            </div>
          )}

          {/* Supplier pending hint */}
          {isOwner && (poStatus === "approved" || poStatus === "supplier_acc") && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, padding: "8px 12px", borderRadius: 10, background: "rgba(78,168,90,0.10)", border: "1px solid #A8DEBC" }}>
              <span style={{ fontSize: 13 }}>{poStatus === "supplier_acc" ? "🏭" : "📤"}</span>
              <p style={{ fontSize: 11, color: "#1A6647", fontWeight: 600, margin: 0 }}>
                {poStatus === "supplier_acc"
                  ? `Supplier ${log.supplierName || ""} sedang memproses pengiriman…`
                  : `PO diteruskan ke ${log.supplierName || "supplier"} — menunggu konfirmasi ACC`}
              </p>
            </div>
          )}

          {/* Completed hint */}
          {isOwner && isCompleted && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, padding: "8px 12px", borderRadius: 10, background: "rgba(78,168,90,0.10)", border: "1px solid #A8DEBC" }}>
              <span style={{ fontSize: 13 }}>🎉</span>
              <p style={{ fontSize: 11, color: "#1A6647", fontWeight: 600, margin: 0 }}>
                Stok <strong>{log.target}</strong> sudah bertambah {log.poQty ? `+${log.poQty} ${log.poSatuan}` : ""}
              </p>
            </div>
          )}

          {/* Expanded detail */}
          {expanded && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1.5px dashed #F5C878" }}>
              <p style={{ fontSize: 11, color: "#6A4000", lineHeight: 1.75, margin: "0 0 12px" }}>
                {log.detail}
              </p>

              {/* Over-limit info */}
              {poStatus === "pending" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, background: "rgba(232,168,80,0.12)", border: "1px solid #F5C878", marginBottom: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A07840" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  <p style={{ fontSize: 10, color: "#8A5820", fontWeight: 600, margin: 0 }}>
                    Batas otomatis: <strong>Rp 500.000</strong> · Nilai PO ini{" "}
                    <strong style={{ color: "#C85020" }}>
                      {((log.poAmount! / 500000 - 1) * 100).toFixed(0)}% di atas batas
                    </strong>
                  </p>
                </div>
              )}

              {/* Visibility */}
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", color: "#A07840", marginBottom: 5 }}>
                  HANYA TERLIHAT OLEH
                </p>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {(["Admin", "Gudang", "Sistem", "Owner"] as Actor[]).map(a => {
                    const seen = log.readBy.includes(a);
                    const as = ACTOR_STYLE[a];
                    return (
                      <span key={a} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", padding: "2px 9px", borderRadius: 20, background: seen ? as.bg : "rgba(0,0,0,0.04)", color: seen ? as.text : "#9AAA9F", border: `1.5px solid ${seen ? as.border : "transparent"}` }}>
                        {seen && a === "Owner" ? "👑 " : ""}{a}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Regular Log Card ─────────────────────────────────────────────────────────
function LogCard({ log, expanded, onToggle, isUnread }: {
  log: ActivityLog; expanded: boolean; onToggle: () => void; isUnread: boolean;
}) {
  const cat = CAT_STYLE[log.category] || CAT_STYLE.Sistem;
  const st = STATUS_STYLE[log.status] || STATUS_STYLE.info;
  return (
    <div
      onClick={onToggle}
      style={{ background: isUnread ? "#FAFFF8" : "#FFFFFF", border: expanded ? "1.5px solid #A5D4AB" : "1.5px solid #D0E8D4", borderRadius: 16, padding: "13px 15px 13px 18px", cursor: "pointer", position: "relative", overflow: "hidden", transition: "box-shadow .2s, transform .2s, border-color .2s", boxShadow: expanded ? "0 6px 28px rgba(78,168,90,0.10)" : "0 1px 4px rgba(78,168,90,0.05)", transform: expanded ? "translateY(-1px)" : "none" }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3.5, background: st.bar, borderRadius: "16px 0 0 16px" }} />
      <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
        <div style={{ width: 36, height: 36, borderRadius: 11, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
          {cat.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
            <ActorBadge actor={log.actor} />
            <span style={{ fontSize: 10, color: "#7A9B82", fontWeight: 500 }}>{log.actorName}</span>
            {isUnread && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F5837A", flexShrink: 0 }} />}
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#7A9B82", fontWeight: 500, whiteSpace: "nowrap" }}>
              {formatTime(log.timestamp)} · {relativeTime(log.timestamp)}
            </span>
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#1C3320", margin: "0 0 2px" }}>{log.action}</p>
          {log.target && <p style={{ fontSize: 11, fontWeight: 600, color: st.label, margin: "0 0 2px" }}>{log.target}</p>}
          {expanded && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1.5px dashed #D0E8D4" }}>
              <p style={{ fontSize: 11, color: "#4A6B52", lineHeight: 1.7, margin: 0 }}>{log.detail}</p>
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", color: "#7A9B82", marginBottom: 6 }}>TERLIHAT OLEH</p>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {(["Admin", "Gudang", "Sistem", "Owner"] as Actor[]).map(a => {
                    const seen = log.readBy.includes(a);
                    const as = ACTOR_STYLE[a];
                    return (
                      <span key={a} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", padding: "2px 9px", borderRadius: 20, background: seen ? as.bg : "rgba(0,0,0,0.04)", color: seen ? as.text : "#9AAA9F", border: `1.5px solid ${seen ? as.border : "transparent"}` }}>
                        {a}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error" | "info"; onClose: () => void }) {
  const colors = {
    success: { bg: "#D6F5E8", text: "#1A6647", border: "#A8DEBC", icon: "✅" },
    error: { bg: "#F5D6D6", text: "#8A2020", border: "#E8A8A8", icon: "❌" },
    info: { bg: "#D6EDF5", text: "#1A4D66", border: "#B0D9EE", icon: "📤" },
  }[type];
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 70, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 14, background: colors.bg, border: `1.5px solid ${colors.border}`, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", minWidth: 280, maxWidth: 400, animation: "slideInRight .3s cubic-bezier(.22,1,.36,1)" }}>
      <span style={{ fontSize: 16 }}>{colors.icon}</span>
      <p style={{ fontSize: 12, fontWeight: 600, color: colors.text, margin: 0, flex: 1 }}>{msg}</p>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: colors.text, padding: 0, fontSize: 14, lineHeight: 1 }}>✕</button>
    </div>
  );
}

type FilterKey = "Semua" | "⚠️ PO Warning" | "🗑️ Stok Expired" | Actor | Category;

function buildFilterTabs(role: UserRole): { key: FilterKey; label: string }[] {
  const base: { key: FilterKey; label: string }[] = [
    { key: "Semua", label: "Semua" },
    { key: "Admin", label: "Admin" },
    { key: "Gudang", label: "Gudang" },
    { key: "Sistem", label: "Sistem" },
    { key: "Owner", label: "Owner" },
    { key: "Stock", label: "📦 Stock" },
    { key: "Penjualan", label: "🧾 Penjualan" },
    { key: "Supplier", label: "🏭 Supplier" },
    { key: "User", label: "👤 User" },
  ];
  if (role === "owner") {
    base.splice(1, 0, { key: "⚠️ PO Warning", label: "⚠️ PO Warning" });
  }
  return base;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NotificationPage() {
  const [currentUser, setCurrentUser] = useState({ role: "owner" as UserRole, name: "Owner Inventix", initials: "OI" });
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("Semua");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [readAll, setReadAll] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [showNewPOBanner, setShowNewPOBanner] = useState(false);
  const [unreadIds, setUnreadIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ logId: string; action: "approve" | "reject" } | null>(null);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const FILTER_TABS = buildFilterTabs(currentUser.role);
  const poWarningLogs = logs.filter(l => l.isPOWarning && !dismissed.has(l.id));
  const expiredLogs = logs.filter((l: any) => l.isExpired && !dismissed.has(l.id));
  const pendingPOCount = poWarningLogs.filter(l => l.poStatus === "pending").length;
  const expiredCount = expiredLogs.length;
  const allUnreadCount = readAll ? 0 : logs.filter(l => unreadIds.has(l.id) && !dismissed.has(l.id)).length;

  const loadProfileAndLogs = async () => {
    try {
      const resProfile = await api.akun.profile();
      const p = resProfile.data;
      const fRole = mapRoleToFrontend(p.peran) as UserRole;
      const name = p.nama || "User";
      const initials = name.split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? "").join("");
      setCurrentUser({ role: fRole, name, initials });

      if (fRole === "owner") setShowNewPOBanner(true);

      // ── Fetch activity logs & stok (for expiry detection) in parallel ──
      const [resLogs, resStok] = await Promise.all([
        api.riwayatAktivitas.getAll().catch(() => ({ data: [] })),
        api.stok.getAll().catch(() => ({ data: [] })),
      ]);

      const mapped = resLogs.data.map((item: any) => {
        const u = item.akun || {};
        const actorName = u.nama || "Sistem";
        let actor: Actor = "Sistem";
        const r = u.peran?.toUpperCase();
        if (r === "OWNER") actor = "Owner";
        else if (r === "ADMIN") actor = "Admin";
        else if (r === "GUDANG") actor = "Gudang";
        else if (r === "SUPPLIER") actor = "Gudang";

        const category: Category = (() => {
          const t = item.nama_tabel?.toLowerCase();
          if (t === "stok") return "Stock";
          if (t === "supplier") return "Supplier";
          if (t === "purchaseorder" || t === "purchase_order") return "Purchase Order";
          if (t === "pembeliantransaksi" || t === "pembelian_transaksi") return "Penjualan";
          if (t === "akun") return "User";
          return "Sistem";
        })();

        const target = item.data_baru
          ? (item.data_baru.nama || item.data_baru.nomor_po || item.data_baru.email || item.data_baru.sku || `ID: ${item.data_baru.id || item.record_id}`)
          : (item.data_lama ? (item.data_lama.nama || item.data_lama.nomor_po || item.data_lama.email || `ID: ${item.record_id}`) : `ID: ${item.record_id}`);

        const poAmount = category === "Purchase Order" && item.data_baru?.total_nilai
          ? parseFloat(item.data_baru.total_nilai) : undefined;

        const isPOWarning = poAmount !== undefined && poAmount >= 500000;

        const status: "success" | "warning" | "info" = isPOWarning ? "warning"
          : item.aksi === "buat" ? "success"
            : item.aksi === "edit" ? "info"
              : "warning";

        return {
          id: String(item.id),
          poId: (item.nama_tabel?.toLowerCase() === 'purchase_order' || item.nama_tabel?.toLowerCase() === 'purchaseorder')
            ? String(item.data_baru?.id || item.record_id || '')
            : undefined,
          timestamp: item.dilakukan_pada || new Date().toISOString(),
          actor, actorName, category,
          action: formatActivityAction(item.nama_tabel, item.aksi),
          detail: item.data_baru
            ? `${actorName} berhasil melakukan aksi ${item.aksi} pada data ${category.toLowerCase()}.`
            : `${actorName} berhasil melakukan aksi ${item.aksi} di sistem.`,
          target,
          status,
          readBy: ["Owner", "Admin", "Gudang"] as Actor[],
          poAmount,
          isPOWarning,
          poStatus: isPOWarning ? ((): POStatus => {
            const s = (item.data_baru?.status || '').toUpperCase();
            if (s === 'MENUNGGU_PERSETUJUAN' || s === 'DRAFT') return 'pending';
            if (s === 'DISETUJUI') return 'approved';
            if (s === 'DITOLAK' || s === 'DIBATALKAN') return 'rejected';
            if (s === 'SELESAI') return 'completed';
            return 'pending';
          })() : undefined,
          supplierName: item.data_baru?.supplier_nama || item.data_baru?.nama_supplier || undefined,
          poQty: item.data_baru?.jumlah || undefined,
          poSatuan: item.data_baru?.satuan || undefined,
          stokId: item.data_baru?.stok_id || undefined,
        };
      });

      // ── Inject expired stock notifications ──
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiredLogs: ActivityLog[] = [];

      resStok.data.forEach((stok: any) => {
        // Resolve expiry date from multiple possible field names
        const expiryRaw = stok.tanggal_kadaluarsa ?? stok.expired_at ?? stok.kadaluarsa ?? stok.expiry_date ?? null;
        if (!expiryRaw) return;
        const expiryDate = new Date(expiryRaw);
        if (isNaN(expiryDate.getTime())) return;
        expiryDate.setHours(0, 0, 0, 0);
        if (expiryDate > today) return; // Not yet expired

        const daysOverdue = Math.floor((today.getTime() - expiryDate.getTime()) / (1000 * 60 * 60 * 24));
        const stokNama = stok.nama || "Stok";
        expiredLogs.push({
          id: `expired-${stok.id}`,
          timestamp: expiryRaw,
          actor: "Sistem",
          actorName: "Sistem Inventix",
          category: "Stock",
          action: "Stok Kedaluwarsa Terdeteksi",
          detail: `Stok "${stokNama}" telah melewati tanggal kedaluwarsa ${daysOverdue} hari yang lalu (${expiryDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}). Segera tandai sebagai limbah atau lakukan tindakan yang diperlukan.`,
          target: stokNama,
          status: "warning",
          readBy: ["Owner", "Admin", "Gudang"] as Actor[],
          stokId: String(stok.id),
          isExpired: true,
        } as ActivityLog & { isExpired: boolean });
      });

      const allLogs = [...expiredLogs, ...mapped];
      allLogs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLogs(allLogs);
      const unreads = new Set(allLogs.slice(0, 3).map((l: any) => l.id));
      setUnreadIds(unreads);
    } catch (err) {
      console.error("Gagal memuat profile/logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileAndLogs();
    setTimeout(() => setMounted(true), 80);
  }, []);

  useEffect(() => {
    if (showNewPOBanner) {
      bannerTimerRef.current = setTimeout(() => setShowNewPOBanner(false), 8000);
    }
    return () => { if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current); };
  }, [showNewPOBanner]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // ── Approve handler ──
  function handleApproveClick(id: string) {
    setConfirmModal({ logId: id, action: "approve" });
  }

  function handleRejectClick(id: string) {
    setConfirmModal({ logId: id, action: "reject" });
  }

  async function confirmApprove() {
    if (!confirmModal) return;
    const { logId } = confirmModal;
    setConfirmModal(null);
    try {
      // Optimistic update first
      setLogs(prev => prev.map(l =>
        l.id === logId ? { ...l, poStatus: "approved" as POStatus } : l
      ));
      setToast({ msg: "Memproses persetujuan PO...", type: "info" });

      // Call real API
      const logItem = logs.find(l => l.id === logId);
      const targetId = logItem?.poId ? parseInt(logItem.poId, 10) : parseInt(logId, 10);
      if (!isNaN(targetId)) {
        await api.purchaseOrder.approve(targetId);
      }

      setToast({ msg: "PO disetujui dan diteruskan ke supplier untuk di-ACC.", type: "info" });
    } catch (err) {
      // Revert on failure
      setLogs(prev => prev.map(l =>
        l.id === logId ? { ...l, poStatus: "pending" as POStatus } : l
      ));
      setToast({ msg: "Gagal menyetujui PO. Periksa koneksi dan coba lagi.", type: "error" });
    }
  }

  async function confirmReject() {
    if (!confirmModal) return;
    const { logId } = confirmModal;
    setConfirmModal(null);
    try {
      // Optimistic update
      setLogs(prev => prev.map(l =>
        l.id === logId ? { ...l, poStatus: "rejected" as POStatus } : l
      ));

      const logItem = logs.find(l => l.id === logId);
      const targetId = logItem?.poId ? parseInt(logItem.poId, 10) : parseInt(logId, 10);
      if (!isNaN(targetId)) {
        await api.purchaseOrder.reject(targetId);
      }

      setToast({ msg: "PO ditolak. Admin akan mendapat notifikasi.", type: "error" });
    } catch (err) {
      setLogs(prev => prev.map(l =>
        l.id === logId ? { ...l, poStatus: "pending" as POStatus } : l
      ));
      setToast({ msg: "Gagal menolak PO. Periksa koneksi dan coba lagi.", type: "error" });
    }
  }

  // ── Mark expired stok as waste ──
  async function handleMarkAsWaste(logId: string, stokId: string) {
    try {
      setToast({ msg: "Menandai stok sebagai limbah...", type: "info" });
      const numericId = parseInt(stokId, 10);
      if (!isNaN(numericId)) {
        await api.stok.markAsWaste(numericId);
      }
      // Remove the expired notification on success
      setDismissed(prev => new Set([...prev, logId]));
      setToast({ msg: "Stok berhasil ditandai sebagai limbah ♻️", type: "success" });
    } catch (err) {
      setToast({ msg: "Gagal menandai sebagai limbah. Coba lagi.", type: "error" });
    }
  }

  const filteredLogs = logs.filter(log => {
    if (dismissed.has(log.id)) return false;
    let mf = false;
    if (filter === "Semua") mf = true;
    else if (filter === "⚠️ PO Warning") mf = !!log.isPOWarning;
    else if (filter === "🗑️ Stok Expired") mf = !!(log as any).isExpired;
    else mf = log.actor === filter || log.category === filter || log.readBy.includes(filter as Actor);
    const q = search.toLowerCase();
    const ms = !q || log.action.toLowerCase().includes(q) || log.detail.toLowerCase().includes(q) || (log.target ?? "").toLowerCase().includes(q) || log.actorName.toLowerCase().includes(q);
    return mf && ms;
  });

  const grouped = groupByDate(filteredLogs);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  function dismissLog(id: string) {
    setDismissed(prev => new Set([...prev, id]));
  }

  const confirmLog = confirmModal ? logs.find(l => l.id === confirmModal.logId) : null;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-20px);max-height:0}to{opacity:1;transform:translateY(0);max-height:200px} }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.6} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)} }

        .anim-fade-up  { animation:fadeUp .45s cubic-bezier(.22,1,.36,1) both; }
        .d100{animation-delay:.10s}.d150{animation-delay:.15s}.d200{animation-delay:.20s}.d250{animation-delay:.25s}
        .log-entry     { animation:fadeUp .24s ease both; }
        .po-banner     { animation:slideDown .4s cubic-bezier(.22,1,.36,1) both; overflow:hidden; }
        .pulse-dot     { animation:pulse 1.8s ease-in-out infinite; }

        .notif-search { width:100%;border:1.5px solid #D0E8D4;border-radius:12px;padding:10px 14px 10px 36px;font-size:12px;background:#F7FBF8;outline:none;color:#1C3320;transition:border-color .18s;font-family:var(--font-inter),sans-serif; }
        .notif-search:focus { border-color:#78BC82; }
        .notif-search::placeholder { color:#7A9B82; }

        .tab-btn { flex-shrink:0;padding:12px 14px 14px;font-size:11px;font-weight:700;color:#7A9B82;border:none;background:none;cursor:pointer;font-family:var(--font-inter),sans-serif;letter-spacing:0.03em;border-bottom:2.5px solid transparent;transition:all .18s;white-space:nowrap; }
        .tab-btn:hover { color:#2D6B37; }
        .tab-btn.tab-active { color:#2D6B37;border-bottom-color:#4EA85A; }
        .tab-btn.tab-warning { color:#A06020 !important; }
        .tab-btn.tab-warning.tab-active { border-bottom-color:#E8A850 !important; }

        .log-card-wrap { transition:transform .22s cubic-bezier(.22,1,.36,1); }
        .log-card-wrap:hover { transform:translateY(-2px); }

        .date-label { font-size:10px;font-weight:700;letter-spacing:0.10em;color:#7A9B82;text-transform:uppercase;display:flex;align-items:center;gap:8px;margin-bottom:6px; }
        .date-label::after { content:'';flex:1;height:1px;background:#D0E8D4; }

        .mark-read-btn { display:inline-flex;align-items:center;gap:6px;background:#FFFFFF;border:1.5px solid #A5D4AB;border-radius:10px;padding:8px 14px;font-size:11px;font-weight:700;letter-spacing:0.02em;color:#2D6B37;cursor:pointer;font-family:inherit;transition:background .18s,border-color .18s,color .18s,transform .15s;box-shadow:0 1px 4px rgba(78,168,90,0.12); }
        .mark-read-btn:hover { background:#4EA85A;border-color:#4EA85A;color:#fff;transform:translateY(-1px);box-shadow:0 4px 14px rgba(78,168,90,0.25); }
        .mark-read-btn:active { transform:scale(0.97); }
        .mark-read-btn .btn-icon { width:18px;height:18px;border-radius:6px;background:#D6F5E8;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .18s; }
        .mark-read-btn:hover .btn-icon { background:rgba(255,255,255,0.22); }

        .po-section-header { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;margin-bottom:10px;background:linear-gradient(90deg,#FFF5E0,#FFF9F0);border:1.5px solid #F5C878; }
      `}</style>

      <div
        className={`min-h-screen text-[#1C3320] transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ background: "#E8F5EC", fontFamily: "var(--font-inter),sans-serif" }}
      >
        <Header userInitials={currentUser.initials} hasNotification={allUnreadCount > 0 || pendingPOCount > 0} />

        {/* PO Warning Banner */}
        {showNewPOBanner && currentUser.role === "owner" && pendingPOCount > 0 && (
          <div className="po-banner" style={{ background: "linear-gradient(90deg,#7A3800,#A05000)" }}>
            <div style={{ maxWidth: 896, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#F5C878", flexShrink: 0 }} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5C878" strokeWidth="2.2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#FFF5E0", margin: 0, flex: 1 }}>
                <strong style={{ color: "#F5C878" }}>{pendingPOCount} Purchase Order</strong> menunggu persetujuan Anda.
              </p>
              <button
                onClick={() => { setFilter("⚠️ PO Warning"); setShowNewPOBanner(false); }}
                style={{ background: "#F5C878", color: "#7A3800", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}
              >
                Tinjau Sekarang →
              </button>
              <button onClick={() => setShowNewPOBanner(false)} style={{ background: "transparent", border: "none", color: "#F5C878", cursor: "pointer", padding: 4, flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          </div>
        )}

        <main className="w-full">
          {/* Hero section */}
          <section className="w-full relative overflow-hidden pt-16 sm:pt-20" style={{ background: "linear-gradient(160deg,#C8E6CC 0%,#D4EDD9 50%,#C5E4CA 100%)", borderBottom: "1.5px solid #B5D9BB" }}>
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none opacity-20" style={{ background: "#78BC82", filter: "blur(64px)" }} />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full pointer-events-none opacity-15" style={{ background: "#A5D4AB", filter: "blur(50px)" }} />

            <div className="max-w-4xl mx-auto px-4 sm:px-8">
              <div className="anim-fade-up d100 flex items-start sm:items-center justify-between gap-4 pt-6 pb-5 relative z-10 flex-wrap">
                <div className="flex items-center gap-4">
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(255,255,255,0.80)", border: "1.5px solid #B5D9BB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3A8F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {(allUnreadCount > 0 || pendingPOCount > 0) && (
                      <span className="pulse-dot" style={{ position: "absolute", top: 8, right: 8, width: 9, height: 9, borderRadius: "50%", background: "#F5837A", border: "2px solid #D4EDD9" }} />
                    )}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#2D6B37", letterSpacing: "-0.03em", lineHeight: 1, margin: 0, fontFamily: "var(--font-plus-jakarta),sans-serif" }}>
                        Notifikasi
                      </h1>
                      {allUnreadCount > 0 && (
                        <span style={{ background: "#F5837A", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.04em", lineHeight: 1.6 }}>
                          {allUnreadCount} baru
                        </span>
                      )}
                      {currentUser.role === "owner" && pendingPOCount > 0 && (
                        <span style={{ background: "linear-gradient(90deg,#F5A623,#E8792A)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.04em", lineHeight: 1.6, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          ⚠️ {pendingPOCount} perlu disetujui
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#4A6B52", fontWeight: 500 }}>
                      Log audit · Admin · Sistem · {currentUser.role === "owner" ? "Owner" : "Gudang"}
                    </p>
                  </div>
                </div>
                {allUnreadCount > 0 && (
                  <button className="mark-read-btn" onClick={() => setReadAll(true)}>
                    <span className="btn-icon">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1A6647" strokeWidth="2.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </span>
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              {/* Filter tabs */}
              <div className="anim-fade-up d150 flex gap-0 overflow-x-auto relative z-10" style={{ borderTop: "1px solid rgba(53,139,70,0.12)", scrollbarWidth: "none" }}>
                {FILTER_TABS.map(({ key, label }) => (
                  <button
                    key={key}
                    className={`tab-btn${filter === key ? " tab-active" : ""}${key === "⚠️ PO Warning" ? " tab-warning" : ""}`}
                    onClick={() => setFilter(key)}
                  >
                    {label}
                    {key === "⚠️ PO Warning" && pendingPOCount > 0 && (
                      <span style={{ marginLeft: 4, background: "#E8A850", color: "#fff", fontSize: 8, fontWeight: 800, padding: "1px 5px", borderRadius: 10 }}>
                        {pendingPOCount}
                      </span>
                    )}
                  </button>
                ))}
                {/* Dynamic expired stock tab */}
                {expiredCount > 0 && (
                  <button
                    className={`tab-btn${filter === "🗑️ Stok Expired" ? " tab-active" : ""}`}
                    style={filter === "🗑️ Stok Expired" ? { color: "#8A2020", borderBottomColor: "#E85040" } : { color: "#8A2020" }}
                    onClick={() => setFilter("🗑️ Stok Expired" as FilterKey)}
                  >
                    🗑️ Stok Expired
                    <span style={{ marginLeft: 4, background: "#E85040", color: "#fff", fontSize: 8, fontWeight: 800, padding: "1px 5px", borderRadius: 10 }}>
                      {expiredCount}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="w-full py-6 sm:py-8" style={{ background: "#FFFFFF" }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-8">

              {/* PO summary banner (owner, all view) */}
              {currentUser.role === "owner" && filter === "Semua" && pendingPOCount > 0 && (
                <div className="anim-fade-up po-section-header mb-5">
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#FFE0A0,#F5C050)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A4A00" strokeWidth="2.2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: "#7A3800", margin: "0 0 1px" }}>
                      {pendingPOCount} Purchase Order Menunggu Persetujuan Anda
                    </p>
                    <p style={{ fontSize: 10, color: "#A06020", margin: 0, fontWeight: 500 }}>
                      Total nilai: <strong>{formatRupiah(poWarningLogs.filter(l => l.poStatus === "pending").reduce((s, l) => s + (l.poAmount ?? 0), 0))}</strong> · Semua melebihi batas Rp 500.000
                    </p>
                  </div>
                  <button
                    onClick={() => setFilter("⚠️ PO Warning")}
                    style={{ background: "#F5A623", color: "#fff", border: "none", borderRadius: 9, padding: "6px 12px", fontSize: 11, fontWeight: 800, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
                  >
                    Tinjau PO →
                  </button>
                </div>
              )}

              {/* Search */}
              <div className="anim-fade-up d200 relative mb-5">
                <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#7A9B82", pointerEvents: "none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input className="notif-search" placeholder="Cari aktivitas, produk, atau pengguna..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>

              {/* Log list */}
              {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#7A9B82" }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>Memuat log aktivitas…</p>
                </div>
              ) : sortedDates.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#7A9B82" }}>
                  <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>Tidak ada aktivitas ditemukan</p>
                </div>
              ) : (
                sortedDates.map(date => (
                  <div key={date} style={{ marginBottom: 24 }}>
                    <p className="date-label">{formatDate(date)}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {grouped[date].map((log, i) => (
                        <div key={log.id} className="log-entry log-card-wrap" style={{ animationDelay: `${i * 35}ms` }}>
                          {/* Expired stock card */}
                          {(log as any).isExpired ? (
                            <div
                              style={{ background: "#FFF8F0", border: "1.5px solid #F5C878", borderRadius: 16, padding: "14px 16px 14px 20px", position: "relative", overflow: "hidden" }}
                            >
                              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "linear-gradient(180deg,#E85040,#C83030)", borderRadius: "16px 0 0 16px" }} />
                              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                                <div style={{ width: 40, height: 40, borderRadius: 13, background: "#F5D6D6", border: "1.5px solid #E8A8A8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                                  🗑️
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                                    <span style={{ background: "#F5D6D6", color: "#8A2020", fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 9px", borderRadius: 20, border: "1.5px solid #E8A8A8" }}>KEDALUWARSA</span>
                                    <span style={{ fontSize: 10, color: "#A07840", fontWeight: 500, marginLeft: "auto" }}>{relativeTime(log.timestamp)}</span>
                                  </div>
                                  <p style={{ fontSize: 12, fontWeight: 800, color: "#8A2020", margin: "0 0 2px" }}>Stok Kedaluwarsa: {log.target}</p>
                                  <p style={{ fontSize: 11, color: "#6A4000", margin: 0, lineHeight: 1.65 }}>{log.detail}</p>
                                  {log.stokId && (
                                    <button
                                      onClick={() => handleMarkAsWaste(log.id, log.stokId!)}
                                      style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#E85040,#C83030)", color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.02em", boxShadow: "0 3px 12px rgba(200,48,48,0.28)" }}
                                    >
                                      ♻️ Ubah ke Limbah
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : log.isPOWarning ? (
                            <POWarningCard
                              log={log}
                              expanded={expanded === log.id}
                              isUnread={!readAll && unreadIds.has(log.id)}
                              onToggle={() => setExpanded(expanded === log.id ? null : log.id)}
                              onDismiss={dismissLog}
                              onApprove={handleApproveClick}
                              onReject={handleRejectClick}
                              userRole={currentUser.role}
                            />
                          ) : (
                            <LogCard
                              log={log}
                              expanded={expanded === log.id}
                              isUnread={!readAll && unreadIds.has(log.id)}
                              onToggle={() => setExpanded(expanded === log.id ? null : log.id)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              <p style={{ textAlign: "center", fontSize: 10, color: "#9AAA9F", fontWeight: 500, letterSpacing: "0.04em", marginTop: 16 }}>
                Inventix Audit Log · Data diperbarui real-time
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* Confirm Modal */}
      {confirmModal && confirmLog && (
        <ConfirmModal
          log={confirmLog}
          action={confirmModal.action}
          onConfirm={confirmModal.action === "approve" ? confirmApprove : confirmReject}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}