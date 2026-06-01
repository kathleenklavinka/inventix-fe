"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { COOKIE_NAME, COOKIE_ROLE } from "@/lib/auth";
import { api } from "@/lib/api";

const SHOW_OPTIONS = [5, 10, 25, 50];
const HARI  = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconMapPin    = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconPhone     = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconPlus      = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconEdit      = ({ size=13, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconTrash     = ({ size=13, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconSearch    = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconSort      = ({ size=11, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 5 19 12"/></svg>;
const IconSortDown  = ({ size=11, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="5 12 12 19 19 12"/></svg>;
const IconCheck     = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconX         = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconGrid      = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IconList      = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IconFileText  = ({ size=13, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const IconTruck     = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const IconPackage   = ({ size=14, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IconBell      = ({ size=16, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;

// ─── Types ────────────────────────────────────────────────────────────────────
type POStatus = "pending" | "approved" | "supplier_acc" | "completed" | "rejected";

interface PurchaseOrder {
  id: string;
  nomorPO: string;
  namaBarang: string;
  jumlah: number;
  satuan: string;
  nilaiTotal: number;
  status: POStatus;
  tanggal: string;
  stokId?: string;
  catatan?: string;
}

interface SupplierItem {
  id: string;
  nama: string;
  alamat: string;
  telepon: string;
  kategori: string;
  aktif: boolean;
  pendingPOCount: number;
  purchaseOrders: PurchaseOrder[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

const KATEGORI_COLORS: Record<string, { bg: string; text: string }> = {
  "Bahan Pokok":    { bg: "#d1fae5", text: "#065f46" },
  "Bumbu & Rempah": { bg: "#fef3c7", text: "#92400e" },
  "Minuman":        { bg: "#dbeafe", text: "#1e40af" },
  "Kemasan":        { bg: "#ede9fe", text: "#5b21b6" },
};

const PO_STATUS_CFG: Record<POStatus, { label: string; bg: string; text: string; border: string; icon: string }> = {
  pending:      { label: "Menunggu Approval Owner", bg: "#FEF9D6", text: "#7A5A00", border: "#F5C878", icon: "⏳" },
  approved:     { label: "Disetujui — Menunggu ACC",  bg: "#D6EDF5", text: "#1A4D66", border: "#B0D9EE", icon: "📤" },
  supplier_acc: { label: "Sudah Di-ACC Supplier",     bg: "#D6F5E8", text: "#1A6647", border: "#A8DEBC", icon: "✅" },
  completed:    { label: "Selesai — Stok Bertambah",  bg: "#D6F5E8", text: "#1A6647", border: "#78C89A", icon: "🎉" },
  rejected:     { label: "Ditolak",                   bg: "#F5D6D6", text: "#8A2020", border: "#E8A8A8", icon: "❌" },
};

function getInitials(nama: string) {
  return nama.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function AvatarIcon({ nama }: { nama: string }) {
  const idx = nama.charCodeAt(0) % 5;
  const bgs = ["#bbf7d0","#a7f3d0","#6ee7b7","#34d399","#10b981"];
  return (
    <div style={{ width:36, height:36, borderRadius:"10px", background:bgs[idx], display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <span style={{ fontSize:"11px", fontWeight:800, color:"#064e3b", fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
        {getInitials(nama)}
      </span>
    </div>
  );
}

function Inner({ children, className="" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-6xl mx-auto px-4 sm:px-8 ${className}`}>{children}</div>;
}

// ─── PO Status Badge ──────────────────────────────────────────────────────────
function POStatusBadge({ status }: { status: POStatus }) {
  const cfg = PO_STATUS_CFG[status];
  return (
    <span style={{ background:cfg.bg, color:cfg.text, fontSize:9, fontWeight:700, letterSpacing:"0.05em", padding:"3px 9px", borderRadius:20, display:"inline-flex", alignItems:"center", gap:4, border:`1.5px solid ${cfg.border}` }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ─── ACC Confirm Modal ────────────────────────────────────────────────────────
function AccModal({ po, supplierNama, onConfirm, onCancel }: {
  po: PurchaseOrder;
  supplierNama: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(2,44,34,0.50)", backdropFilter:"blur(6px)" }}
      onClick={onCancel}
    >
      <div
        style={{ background:"#FFFFFF", borderRadius:20, padding:"28px 28px 24px", maxWidth:420, width:"100%", boxShadow:"0 24px 64px rgba(2,44,34,0.25)", border:"1.5px solid #A8DEBC" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ width:48, height:48, borderRadius:16, background:"#D6F5E8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:16 }}>
          🚚
        </div>
        <h2 style={{ fontSize:16, fontWeight:800, color:"#022c22", margin:"0 0 6px", fontFamily:"var(--font-plus-jakarta),sans-serif" }}>
          ACC Purchase Order?
        </h2>
        <p style={{ fontSize:12, color:"#4A6B52", margin:"0 0 4px" }}>
          Nomor PO: <strong style={{ color:"#022c22" }}>{po.nomorPO}</strong>
        </p>
        <p style={{ fontSize:12, color:"#4A6B52", margin:"0 0 4px" }}>
          Barang: <strong style={{ color:"#022c22" }}>{po.namaBarang}</strong> · {po.jumlah} {po.satuan}
        </p>
        <p style={{ fontSize:12, color:"#4A6B52", margin:"0 0 16px" }}>
          Nilai: <strong style={{ color:"#1A6647" }}>{formatRupiah(po.nilaiTotal)}</strong>
        </p>
        <div style={{ background:"#D6F5E8", borderRadius:10, padding:"10px 12px", marginBottom:16, fontSize:11, color:"#1A6647", border:"1px solid #A8DEBC" }}>
          Dengan menekan ACC, Anda mengonfirmasi bahwa <strong>{supplierNama}</strong> akan memproses pengiriman. Stok <strong>{po.namaBarang}</strong> akan otomatis bertambah <strong>+{po.jumlah} {po.satuan}</strong> setelah dikirim.
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button
            onClick={onCancel}
            style={{ flex:1, padding:"10px", borderRadius:10, border:"1.5px solid #A8DEBC", background:"#FFFFFF", color:"#4A6B52", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-plus-jakarta),sans-serif" }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            style={{ flex:2, padding:"10px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#3A8F46,#2D6B37)", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-plus-jakarta),sans-serif" }}
          >
            🚚 Ya, ACC & Siapkan Pengiriman
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reject Confirm Modal ─────────────────────────────────────────────────────
function RejectModal({ po, onConfirm, onCancel }: {
  po: PurchaseOrder;
  onConfirm: (alasan: string) => void;
  onCancel: () => void;
}) {
  const [alasan, setAlasan] = useState("");
  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(2,44,34,0.50)", backdropFilter:"blur(6px)" }}
      onClick={onCancel}
    >
      <div
        style={{ background:"#FFFFFF", borderRadius:20, padding:"28px 28px 24px", maxWidth:420, width:"100%", boxShadow:"0 24px 64px rgba(2,44,34,0.25)", border:"1.5px solid #E8A8A8" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ width:48, height:48, borderRadius:16, background:"#F5D6D6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:16 }}>
          ❌
        </div>
        <h2 style={{ fontSize:16, fontWeight:800, color:"#022c22", margin:"0 0 6px", fontFamily:"var(--font-plus-jakarta),sans-serif" }}>
          Tolak Purchase Order?
        </h2>
        <p style={{ fontSize:12, color:"#4A6B52", margin:"0 0 14px" }}>
          Nomor PO: <strong style={{ color:"#022c22" }}>{po.nomorPO}</strong> · {po.namaBarang}
        </p>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, fontWeight:700, color:"#8A2020", display:"block", marginBottom:6 }}>
            Alasan penolakan (opsional)
          </label>
          <textarea
            value={alasan}
            onChange={e => setAlasan(e.target.value)}
            placeholder="Contoh: Stok sudah tersedia, harga tidak sesuai, dll."
            style={{ width:"100%", border:"1.5px solid #E8A8A8", borderRadius:10, padding:"9px 12px", fontSize:12, fontFamily:"var(--font-plus-jakarta),sans-serif", color:"#022c22", background:"#FFF8F8", outline:"none", resize:"vertical", minHeight:80 }}
          />
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button
            onClick={onCancel}
            style={{ flex:1, padding:"10px", borderRadius:10, border:"1.5px solid #A8DEBC", background:"#FFFFFF", color:"#4A6B52", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-plus-jakarta),sans-serif" }}
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(alasan)}
            style={{ flex:2, padding:"10px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#C85040,#A83030)", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-plus-jakarta),sans-serif" }}
          >
            ❌ Ya, Tolak PO
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PO Drawer (list PO per supplier) ────────────────────────────────────────
function PODrawer({ supplier, userRole, onClose, onAcc, onReject }: {
  supplier: SupplierItem;
  userRole: string;
  onClose: () => void;
  onAcc: (supplierId: string, poId: string) => void;
  onReject: (supplierId: string, poId: string) => void;
}) {
  const isSupplier = userRole === "supplier";
  const activePOs  = supplier.purchaseOrders.filter(po => po.status !== "completed" && po.status !== "rejected");
  const historyPOs = supplier.purchaseOrders.filter(po => po.status === "completed" || po.status === "rejected");

  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:50, display:"flex", justifyContent:"flex-end", background:"rgba(2,44,34,0.40)", backdropFilter:"blur(5px)" }}
      onClick={onClose}
    >
      <div
        style={{ width:"100%", maxWidth:520, height:"100%", overflowY:"auto", background:"#F0FDF4", borderLeft:"1.5px solid #A8DEBC", padding:"24px 24px 40px", display:"flex", flexDirection:"column", gap:16, animation:"slideInDrawer .30s cubic-bezier(.22,1,.36,1) both" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
          <AvatarIcon nama={supplier.nama} />
          <div style={{ flex:1 }}>
            <p style={{ fontSize:15, fontWeight:800, color:"#022c22", margin:0, fontFamily:"var(--font-plus-jakarta),sans-serif" }}>{supplier.nama}</p>
            <p style={{ fontSize:11, color:"rgba(6,78,59,0.55)", margin:"2px 0 0" }}>{supplier.kategori} · {supplier.telepon}</p>
          </div>
          <button
            onClick={onClose}
            style={{ width:32, height:32, borderRadius:10, border:"1.5px solid #A8DEBC", background:"#FFFFFF", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#065f46" }}
          >
            <IconX size={14} color="#065f46" />
          </button>
        </div>

        {/* Summary pills */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[
            { label:`${supplier.purchaseOrders.filter(p=>p.status==="approved").length} perlu di-ACC`, bg:"#D6EDF5", text:"#1A4D66", border:"#B0D9EE" },
            { label:`${supplier.purchaseOrders.filter(p=>p.status==="supplier_acc").length} dalam pengiriman`, bg:"#D6F5E8", text:"#1A6647", border:"#A8DEBC" },
            { label:`${historyPOs.length} riwayat`, bg:"rgba(6,78,59,0.08)", text:"#065f46", border:"rgba(6,78,59,0.20)" },
          ].map((p,i) => (
            <span key={i} style={{ fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:20, background:p.bg, color:p.text, border:`1.5px solid ${p.border}` }}>
              {p.label}
            </span>
          ))}
        </div>

        {/* Active POs */}
        {activePOs.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px 0", color:"rgba(6,78,59,0.40)" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>📭</div>
            <p style={{ fontSize:12, fontWeight:600 }}>Tidak ada PO aktif</p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.09em", color:"rgba(6,78,59,0.50)", textTransform:"uppercase", marginBottom:10 }}>
              PO Aktif
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {activePOs.map(po => {
                const needsAcc   = po.status === "approved";
                const inDelivery = po.status === "supplier_acc";
                return (
                  <div
                    key={po.id}
                    style={{
                      background: needsAcc ? "#FFFAF0" : inDelivery ? "#F4FFF8" : "#FFFFFF",
                      border: `1.5px solid ${needsAcc ? "#F5C878" : inDelivery ? "#A8DEBC" : "#D0E8D4"}`,
                      borderLeft: `4px solid ${needsAcc ? "#E8A850" : inDelivery ? "#3A8F46" : "#81C3DE"}`,
                      borderRadius: "0 14px 14px 0",
                      padding: "14px 16px",
                    }}
                  >
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:8 }}>
                      <div>
                        <p style={{ fontSize:12, fontWeight:800, color:"#022c22", margin:0 }}>{po.nomorPO}</p>
                        <p style={{ fontSize:11, color:"rgba(6,78,59,0.65)", margin:"2px 0 0" }}>
                          🛒 {po.namaBarang} · {po.jumlah} {po.satuan}
                        </p>
                      </div>
                      <span style={{ fontSize:12, fontWeight:800, color: needsAcc ? "#8A4A00" : "#1A6647", background: needsAcc ? "#FEF0D6" : "#D6F5E8", padding:"3px 10px", borderRadius:20, whiteSpace:"nowrap" }}>
                        {formatRupiah(po.nilaiTotal)}
                      </span>
                    </div>
                    <div style={{ marginBottom:10 }}>
                      <POStatusBadge status={po.status} />
                    </div>

                    {/* ACC / Tolak buttons — only for "approved" status, and only when user is supplier/admin/owner */}
                    {needsAcc && (
                      <div style={{ display:"flex", gap:8 }}>
                        <button
                          onClick={() => onAcc(supplier.id, po.id)}
                          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#3A8F46,#2D6B37)", color:"#fff", fontSize:11, fontWeight:800, cursor:"pointer", fontFamily:"var(--font-plus-jakarta),sans-serif", flex:2 }}
                        >
                          <IconTruck size={13} color="#fff" />
                          ACC & Siapkan Pengiriman
                        </button>
                        <button
                          onClick={() => onReject(supplier.id, po.id)}
                          style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:10, border:"1.5px solid #E8A8A8", background:"#FFF0F0", color:"#C83030", fontSize:11, fontWeight:800, cursor:"pointer", fontFamily:"var(--font-plus-jakarta),sans-serif", flex:1 }}
                        >
                          <IconX size={11} color="#C83030" />
                          Tolak
                        </button>
                      </div>
                    )}

                    {inDelivery && (
                      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 10px", borderRadius:10, background:"rgba(78,168,90,0.10)", border:"1px solid #A8DEBC" }}>
                        <span style={{ fontSize:14 }}>🚚</span>
                        <p style={{ fontSize:11, color:"#1A6647", fontWeight:600, margin:0 }}>
                          Sedang dalam pengiriman — stok otomatis bertambah saat tiba
                        </p>
                      </div>
                    )}

                    {po.catatan && (
                      <p style={{ fontSize:10, color:"rgba(6,78,59,0.55)", fontStyle:"italic", margin:"8px 0 0" }}>
                        📝 {po.catatan}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History */}
        {historyPOs.length > 0 && (
          <div>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.09em", color:"rgba(6,78,59,0.50)", textTransform:"uppercase", marginBottom:10, marginTop:8 }}>
              Riwayat PO
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {historyPOs.map(po => (
                <div
                  key={po.id}
                  style={{ background:"#FFFFFF", border:"1.5px solid rgba(6,78,59,0.10)", borderRadius:12, padding:"12px 14px", opacity: po.status === "rejected" ? 0.7 : 1 }}
                >
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                    <div>
                      <p style={{ fontSize:11, fontWeight:700, color:"#022c22", margin:0 }}>{po.nomorPO} · {po.namaBarang}</p>
                      <p style={{ fontSize:10, color:"rgba(6,78,59,0.50)", margin:"2px 0 0" }}>{po.jumlah} {po.satuan} · {formatRupiah(po.nilaiTotal)}</p>
                    </div>
                    <POStatusBadge status={po.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success"|"error"|"info"; onClose: () => void }) {
  const c = {
    success: { bg:"#D6F5E8", text:"#1A6647", border:"#A8DEBC", icon:"✅" },
    error:   { bg:"#F5D6D6", text:"#8A2020", border:"#E8A8A8", icon:"❌" },
    info:    { bg:"#D6EDF5", text:"#1A4D66", border:"#B0D9EE", icon:"🚚" },
  }[type];
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:70, display:"flex", alignItems:"center", gap:10, padding:"12px 18px", borderRadius:14, background:c.bg, border:`1.5px solid ${c.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.15)", minWidth:280, maxWidth:400, animation:"slideInRight .3s cubic-bezier(.22,1,.36,1)" }}>
      <span style={{ fontSize:16 }}>{c.icon}</span>
      <p style={{ fontSize:12, fontWeight:600, color:c.text, margin:0, flex:1 }}>{msg}</p>
      <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:c.text, fontSize:14 }}>✕</button>
    </div>
  );
}

// ─── Stat icons ───────────────────────────────────────────────────────────────
const IconBuilding2    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M9 3v18M15 3v18M2 9h20M2 15h20"/></svg>;
const IconCheckCircle2 = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconAlertTri2    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IconTag2         = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SupplierPage() {
  const [mounted, setMounted]           = useState(false);
  const [tanggal, setTanggal]           = useState("");
  const [search, setSearch]             = useState("");
  const [showCount, setShowCount]       = useState(10);
  const [sortCol, setSortCol]           = useState<string | null>(null);
  const [sortDir, setSortDir]           = useState<"asc"|"desc">("asc");
  const [page, setPage]                 = useState(1);
  const [viewMode, setViewMode]         = useState<"table"|"grid">("table");
  const [data, setData]                 = useState<SupplierItem[]>([]);
  const [deleteModal, setDeleteModal]   = useState<SupplierItem | null>(null);
  const [toast, setToast]               = useState<{ msg: string; type: "success"|"error"|"info" } | null>(null);
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [activeDrawer, setActiveDrawer] = useState<SupplierItem | null>(null);
  const [accModal, setAccModal]         = useState<{ supplierId: string; po: PurchaseOrder } | null>(null);
  const [rejectModal, setRejectModal]   = useState<{ supplierId: string; po: PurchaseOrder } | null>(null);

  const [userRole, setUserRole]         = useState("user");
  const [userInitials, setUserInitials] = useState("AP");

  // ─── Derived ───────────────────────────────────────────────────────────────
  const totalPONeedAcc = data.reduce((s, sup) =>
    s + sup.purchaseOrders.filter(po => po.status === "approved").length, 0);

  const loadSupplier = async () => {
    try {
      const res = await api.supplier.getAll();
      // Also try to load POs — adapt to your API shape
      const poBySupplier: Record<string, PurchaseOrder[]> = {};
      try {
        const poRes = await api.purchaseOrder?.getAll?.();
        if (poRes?.data) {
          poRes.data.forEach((po: any) => {
            const sid = String(po.supplier_id ?? po.supplier?.id ?? po.supplierId ?? po.supplier?.supplier_id ?? "");
            if (!sid) return;

            const rawStatus = String(po.status ?? po.status_supplier ?? po.statusSupplier ?? "pending").toLowerCase();
            let mappedStatus: POStatus = "pending";
            if (rawStatus === "approved" || rawStatus === "disetujui") mappedStatus = "approved";
            else if (rawStatus === "supplier_acc" || rawStatus === "dikonfirmasi" || rawStatus === "supplieracc" || rawStatus === "supplier_acc") mappedStatus = "supplier_acc";
            else if (rawStatus === "completed" || rawStatus === "selesai") mappedStatus = "completed";
            else if (rawStatus === "rejected" || rawStatus === "ditolak") mappedStatus = "rejected";

            if (!poBySupplier[sid]) poBySupplier[sid] = [];
            poBySupplier[sid].push({
              id: String(po.id),
              nomorPO: po.nomor_po || po.nomorPO || `PO-${po.id}`,
              namaBarang: po.nama_barang || po.namaBarang || po.stok?.nama || "Barang",
              jumlah: Number(po.jumlah ?? po.jumlah_dipesan ?? po.qty ?? 0),
              satuan: po.satuan || po.satuan_barang || "pcs",
              nilaiTotal: parseFloat(String(po.total_nilai ?? po.total ?? po.nilai ?? 0)) || 0,
              status: mappedStatus,
              tanggal: po.tanggal_po || po.dibuat_pada || new Date().toISOString(),
              stokId: po.stok_id ? String(po.stok_id) : undefined,
              catatan: po.catatan || po.keterangan || undefined,
            });
          });
        }
      } catch (err) {
        // PO endpoint not available — skip
        console.warn("Gagal memuat purchase order untuk supplier:", err);
      }

      const mapped: SupplierItem[] = res.data.map((item: any) => {
        const sid = String(item.id);
        const pos = poBySupplier[sid] || [];
        return {
          id: sid,
          nama: item.nama,
          alamat: item.alamat || "Alamat tidak tersedia",
          telepon: item.nomor_telepon || "–",
          kategori: item.deskripsi || "Bahan Pokok",
          aktif: true,
          pendingPOCount: pos.filter(p => p.status === "approved").length,
          purchaseOrders: pos,
        };
      });
      setData(mapped);
    } catch (err: any) {
      setToast({ msg: err.message || "Gagal memuat supplier.", type: "error" });
    }
  };

  useEffect(() => {
    const name = Cookies.get(COOKIE_NAME) || "Andi Pratama";
    const role = Cookies.get(COOKIE_ROLE) || "user";
    setUserRole(role);
    setUserInitials(decodeURIComponent(name).split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase());
    loadSupplier();
    const now = new Date();
    setTanggal(`${HARI[now.getDay()]}, ${now.getDate()} ${BULAN[now.getMonth()]} ${now.getFullYear()}`);
    setTimeout(() => setMounted(true), 80);
  }, []);

  const isAdmin = userRole === "admin" || userRole === "owner";
  const isSupplier = userRole === "supplier";

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); }
  }, [toast]);

  // ─── ACC handler ───────────────────────────────────────────────────────────
  async function confirmAcc() {
    if (!accModal) return;
    const { supplierId, po } = accModal;
    setAccModal(null);
    try {
      // await api.purchaseOrder.acc(po.id);  — adapt to your backend
      setData(prev => prev.map(sup => {
        if (sup.id !== supplierId) return sup;
        return {
          ...sup,
          purchaseOrders: sup.purchaseOrders.map(p =>
            p.id === po.id ? { ...p, status: "supplier_acc" as POStatus } : p
          ),
          pendingPOCount: sup.pendingPOCount - 1,
        };
      }));
      // Update drawer if open
      if (activeDrawer?.id === supplierId) {
        setActiveDrawer(prev => prev ? ({
          ...prev,
          purchaseOrders: prev.purchaseOrders.map(p =>
            p.id === po.id ? { ...p, status: "supplier_acc" as POStatus } : p
          ),
          pendingPOCount: prev.pendingPOCount - 1,
        }) : prev);
      }
      setToast({ msg:`PO ${po.nomorPO} di-ACC! Stok akan bertambah setelah pengiriman.`, type:"info" });

      // Simulate completed after 5s (replace with real webhook/polling in production)
      setTimeout(() => {
        setData(prev => prev.map(sup => {
          if (sup.id !== supplierId) return sup;
          return {
            ...sup,
            purchaseOrders: sup.purchaseOrders.map(p =>
              p.id === po.id ? { ...p, status: "completed" as POStatus } : p
            ),
          };
        }));
        setToast({ msg:`PO ${po.nomorPO} selesai — stok ${po.namaBarang} sudah bertambah +${po.jumlah} ${po.satuan}!`, type:"success" });
      }, 5000);

    } catch (err: any) {
      setToast({ msg: err.message || "Gagal ACC PO.", type: "error" });
    }
  }

  // ─── Reject handler ─────────────────────────────────────────────────────────
  async function confirmReject(alasan: string) {
    if (!rejectModal) return;
    const { supplierId, po } = rejectModal;
    setRejectModal(null);
    try {
      // await api.purchaseOrder.reject(po.id, alasan);
      setData(prev => prev.map(sup => {
        if (sup.id !== supplierId) return sup;
        return {
          ...sup,
          purchaseOrders: sup.purchaseOrders.map(p =>
            p.id === po.id ? { ...p, status: "rejected" as POStatus, catatan: alasan || p.catatan } : p
          ),
          pendingPOCount: Math.max(0, sup.pendingPOCount - 1),
        };
      }));
      if (activeDrawer?.id === supplierId) {
        setActiveDrawer(prev => prev ? ({
          ...prev,
          purchaseOrders: prev.purchaseOrders.map(p =>
            p.id === po.id ? { ...p, status: "rejected" as POStatus } : p
          ),
        }) : prev);
      }
      setToast({ msg:`PO ${po.nomorPO} ditolak. Owner akan mendapat notifikasi.`, type:"error" });
    } catch (err: any) {
      setToast({ msg: err.message || "Gagal menolak PO.", type: "error" });
    }
  }

  // ─── Delete handler ─────────────────────────────────────────────────────────
  async function handleDelete(item: SupplierItem) {
    try {
      await api.supplier.delete(item.id);
      setData(prev => prev.filter(d => d.id !== item.id));
      setDeleteModal(null);
      setToast({ msg: `${item.nama} berhasil dihapus.`, type: "success" });
    } catch (err: any) {
      setToast({ msg: err.message || "Gagal menghapus supplier.", type: "error" });
    }
  }

  // ─── Derived filtered/sorted ────────────────────────────────────────────────
  const kategoriList = ["Semua", ...Array.from(new Set(data.map(d => d.kategori)))];
  const aktifCount   = data.filter(d => d.aktif).length;

  const filtered = data.filter(d => {
    const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.alamat.toLowerCase().includes(search.toLowerCase()) || d.telepon.includes(search);
    const matchKat = filterKategori === "Semua" || d.kategori === filterKategori;
    return matchSearch && matchKat;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const va = (a as any)[sortCol], vb = (b as any)[sortCol];
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    return sortDir === "asc" ? va - vb : vb - va;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / showCount));
  const paginated  = sorted.slice((page-1)*showCount, page*showCount);

  function handleSort(col: string) {
    if (sortCol === col) setSortDir(d => d==="asc"?"desc":"asc");
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  }

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <span style={{ color:"rgba(6,78,59,0.22)", display:"inline-flex" }}><IconSort size={11}/></span>;
    return <span style={{ color:"#064e3b", display:"inline-flex" }}>{sortDir==="asc"?<IconSort size={11}/>:<IconSortDown size={11}/>}</span>;
  }

  const openDrawerForAcc = (supplierId: string, poId: string) => {
    const sup = data.find(s => s.id === supplierId);
    const po  = sup?.purchaseOrders.find(p => p.id === poId);
    if (sup && po) setAccModal({ supplierId, po });
  };

  const openDrawerForReject = (supplierId: string, poId: string) => {
    const sup = data.find(s => s.id === supplierId);
    const po  = sup?.purchaseOrders.find(p => p.id === poId);
    if (sup && po) setRejectModal({ supplierId, po });
  };

  const statItems = [
    { label:"Total Supplier", val:data.length,       valColor:"#022c22", iconBg:"#d1fae5", icon:<IconBuilding2/> },
    { label:"Aktif",          val:aktifCount,         valColor:"#047857", iconBg:"#d1fae5", icon:<IconCheckCircle2/> },
    { label:"PO Perlu ACC",   val:totalPONeedAcc,     valColor: totalPONeedAcc > 0 ? "#b45309" : "#047857", iconBg: totalPONeedAcc > 0 ? "#fef3c7" : "#d1fae5", icon:<IconAlertTri2/> },
    { label:"Kategori",       val:new Set(data.map(d=>d.kategori)).size, valColor:"#1e40af", iconBg:"#dbeafe", icon:<IconTag2/> },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        @keyframes floatBlob { 0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(30px,-20px) scale(1.05)}70%{transform:translate(-20px,18px) scale(0.97)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)} }
        @keyframes slideInDrawer { from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:translateX(0)} }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.5} }

        .su-fade-up{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) both}
        .d1{animation-delay:.05s}.d2{animation-delay:.10s}.d3{animation-delay:.15s}
        .d4{animation-delay:.20s}.d5{animation-delay:.25s}.d6{animation-delay:.30s}
        .d7{animation-delay:.35s}.d8{animation-delay:.40s}

        .blob-g{animation:floatBlob 10s ease-in-out infinite}
        .blob-g2{animation:floatBlob 14s ease-in-out infinite reverse;animation-delay:4s}
        .pulse-dot{animation:pulse 1.8s ease-in-out infinite}

        .su-card{transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s}
        .su-card:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(6,78,59,0.10)}

        .tbl-row{transition:background .15s,transform .2s cubic-bezier(.22,1,.36,1)}
        .tbl-row:hover{background:rgba(236,253,245,0.80) !important;transform:translateX(3px)}

        .btn-green{background:#064e3b;color:#ecfdf5;border:none;border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;padding:10px 20px;font-size:13px;cursor:pointer;transition:transform .22s cubic-bezier(.22,1,.36,1),box-shadow .22s,background .18s;display:inline-flex;align-items:center;gap:7px}
        .btn-green:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 10px 28px rgba(6,78,59,0.30);background:#065f46}
        .btn-green:active{transform:scale(0.97)}

        .btn-po{background:rgba(6,78,59,0.09);color:#064e3b;border:1.5px solid rgba(6,78,59,0.18);border-radius:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;padding:10px 20px;font-size:13px;cursor:pointer;transition:background .18s,transform .2s,box-shadow .2s;display:inline-flex;align-items:center;gap:7px}
        .btn-po:hover{background:rgba(6,78,59,0.16);transform:scale(1.03);box-shadow:0 4px 12px rgba(6,78,59,0.15)}

        .btn-acc{background:linear-gradient(135deg,#3A8F46,#2D6B37);color:#fff;border:none;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;padding:7px 13px;font-size:11px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:transform .18s,box-shadow .18s}
        .btn-acc:hover{transform:scale(1.04);box-shadow:0 4px 12px rgba(45,107,55,0.30)}

        .btn-ghost-g{background:rgba(6,78,59,0.07);color:#064e3b;border:none;border-radius:10px;font-family:var(--font-sans),sans-serif;font-weight:600;padding:7px 13px;font-size:12px;cursor:pointer;transition:background .18s,transform .2s;display:inline-flex;align-items:center;gap:5px}
        .btn-ghost-g:hover{background:rgba(6,78,59,0.13);transform:scale(1.03)}

        .btn-danger-g{background:rgba(220,38,38,0.07);color:#dc2626;border:none;border-radius:10px;font-family:var(--font-sans),sans-serif;font-weight:600;padding:7px 13px;font-size:12px;cursor:pointer;transition:background .18s,transform .2s;display:inline-flex;align-items:center;gap:5px}
        .btn-danger-g:hover{background:rgba(220,38,38,0.14);transform:scale(1.03)}

        .search-input-g{border:1.5px solid rgba(6,78,59,0.15);border-radius:12px;padding:9px 14px 9px 36px;font-size:13px;background:rgba(255,255,255,0.75);color:#064e3b;outline:none;width:100%;max-width:250px;font-family:var(--font-sans),sans-serif;transition:border-color .2s,box-shadow .2s}
        .search-input-g:focus{border-color:rgba(6,78,59,0.40);box-shadow:0 0 0 3px rgba(6,78,59,0.07)}
        .search-input-g::placeholder{color:rgba(6,78,59,0.30)}

        .select-g{border:1.5px solid rgba(6,78,59,0.15);border-radius:10px;padding:8px 12px;font-size:12px;font-family:var(--font-sans),sans-serif;background:rgba(255,255,255,0.75);color:#064e3b;outline:none;cursor:pointer}

        .page-btn-g{width:32px;height:32px;border-radius:8px;border:none;font-size:12px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .18s}
        .page-btn-g.active{background:#064e3b;color:#d1fae5}
        .page-btn-g:not(.active){background:rgba(6,78,59,0.07);color:#064e3b}
        .page-btn-g:not(.active):hover{background:rgba(6,78,59,0.14)}
        .page-btn-g:disabled{opacity:0.3;cursor:default}

        .view-toggle-btn{width:30px;height:30px;border-radius:8px;border:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .18s}
        .view-toggle-btn.on{background:#064e3b;color:#d1fae5}
        .view-toggle-btn.off{background:rgba(6,78,59,0.08);color:rgba(6,78,59,0.50)}
        .view-toggle-btn.off:hover{background:rgba(6,78,59,0.14);color:#064e3b}

        .kat-pill{padding:5px 12px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;border:none;transition:all .18s;font-family:var(--font-sans),sans-serif}
        .kat-pill.on{background:#064e3b;color:#d1fae5}
        .kat-pill.off{background:rgba(6,78,59,0.08);color:rgba(6,78,59,0.55)}
        .kat-pill.off:hover{background:rgba(6,78,59,0.15);color:#064e3b}

        .sort-th{cursor:pointer;user-select:none}
        .sort-th:hover{color:#064e3b !important}

        .modal-overlay{animation:fadeIn .18s ease both}
        .modal-box{animation:fadeUp .22s cubic-bezier(.22,1,.36,1) both}
        .toast-g{animation:slideIn .32s cubic-bezier(.22,1,.36,1) both}

        .sup-grid-card{border:1.5px solid rgba(6,78,59,0.10);border-radius:16px;padding:20px;background:rgba(255,255,255,0.75);transition:transform .28s cubic-bezier(.22,1,.36,1),box-shadow .28s,border-color .2s;cursor:default}
        .sup-grid-card:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(6,78,59,0.11);border-color:rgba(6,78,59,0.22)}

        .stat-strip-su{display:flex;background:rgba(255,255,255,0.52);border:1px solid rgba(6,78,59,0.12);border-radius:16px;overflow:hidden;backdrop-filter:blur(14px)}
        .stat-strip-item-su{flex:1;padding:16px 18px;display:flex;align-items:center;gap:13px;position:relative;cursor:default;transition:background .2s}
        .stat-strip-item-su:hover{background:rgba(255,255,255,0.72)}
        .stat-strip-item-su+.stat-strip-item-su::before{content:'';position:absolute;left:0;top:20%;height:60%;width:1px;background:rgba(6,78,59,0.10)}
        .stat-strip-icon-su{width:38px;height:38px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:transform .25s cubic-bezier(.22,1,.36,1)}
        .stat-strip-item-su:hover .stat-strip-icon-su{transform:scale(1.14) rotate(4deg)}

        .po-badge{position:relative;display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px}
        .po-badge-pulse::after{content:'';position:absolute;top:-2px;right:-2px;width:7px;height:7px;border-radius:50%;background:#E8A850;border:2px solid #F0FDF4;animation:pulse 1.8s ease-in-out infinite}
      `}</style>

      <div className={`min-h-screen text-[#064e3b] relative overflow-x-hidden transition-opacity duration-500 ${mounted?"opacity-100":"opacity-0"}`}
        style={{ background:"#f0fdf4", fontFamily:"var(--font-sans),sans-serif" }}>

        <Header hasNotification={totalPONeedAcc > 0} userInitials={userInitials} />

        <main>
          {/* ── HERO ── */}
          <section className="w-full relative overflow-hidden pt-16 pb-10 sm:pt-20 sm:pb-12"
            style={{ background:"linear-gradient(160deg,#edf2eb 0%,#e4ece1 45%,#f4f7f3 100%)" }}>
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full blob-g pointer-events-none"
              style={{ background:"#6ee7b7", filter:"blur(80px)", opacity:0.28 }} />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full blob-g2 pointer-events-none"
              style={{ background:"#a7f3d0", filter:"blur(60px)", opacity:0.22 }} />

            <Inner className="relative z-10">
              <div className="su-fade-up flex items-center gap-2 mb-5 text-[11px] font-medium" style={{ color:"rgba(6,78,59,0.40)" }}>
                <Link href="/dashboard" className="hover:text-[#064e3b] transition-colors">Dashboard</Link>
                <span>/</span>
                <span style={{ color:"#064e3b" }} className="font-semibold">Supplier</span>
              </div>

              <div className="su-fade-up d2 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase mb-1.5 font-medium" style={{ color:"rgba(6,78,59,0.40)" }}>Manajemen</p>
                  <h1 className="font-['Plus_Jakarta_Sans'] font-black text-2xl sm:text-[2.1rem] leading-none" style={{ color:"#022c22" }}>
                    Data Supplier
                  </h1>
                  <p className="text-[11px] mt-1.5 font-medium" style={{ color:"rgba(6,78,59,0.38)" }}>{tanggal}</p>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link href="/supplier/po">
                      <button className="btn-po"><IconFileText size={13} color="#064e3b"/> Buat PO</button>
                    </Link>
                    <Link href="/supplier/tambah">
                      <button className="btn-green"><IconPlus size={14} color="#d1fae5"/> Tambah Supplier</button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Stat strip */}
              <div className="su-fade-up d4 mt-6 stat-strip-su">
                {statItems.map((s, i) => (
                  <div key={i} className="stat-strip-item-su">
                    <div className="stat-strip-icon-su" style={{ background:s.iconBg }}>{s.icon}</div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <p className="font-['Plus_Jakarta_Sans'] font-black text-xl sm:text-2xl leading-none" style={{ color:s.valColor }}>{s.val}</p>
                        {s.label === "PO Perlu ACC" && totalPONeedAcc > 0 && (
                          <span className="pulse-dot" style={{ width:8, height:8, borderRadius:"50%", background:"#E8A850", flexShrink:0 }} />
                        )}
                      </div>
                      <p className="text-[10px] sm:text-[11px] mt-1 font-medium" style={{ color:"rgba(6,78,59,0.45)" }}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* PO needs ACC alert banner */}
              {totalPONeedAcc > 0 && (
                <div className="su-fade-up d5 mt-4 flex items-center gap-3 px-4 sm:px-5 py-3.5 border"
                  style={{ background:"rgba(254,243,199,0.80)", backdropFilter:"blur(8px)", borderColor:"rgba(245,200,120,0.50)", borderRadius:"14px" }}>
                  <span className="pulse-dot flex-shrink-0" style={{ width:8, height:8, borderRadius:"50%", background:"#E8A850" }} />
                  <p className="text-xs sm:text-sm font-medium" style={{ color:"#92400e" }}>
                    <strong>{totalPONeedAcc} Purchase Order</strong> sudah disetujui owner dan menunggu ACC dari supplier.
                  </p>
                  <span style={{ marginLeft:"auto", fontSize:11, color:"#92400e", fontWeight:700 }}>
                    Klik nama supplier untuk melihat →
                  </span>
                </div>
              )}
            </Inner>
          </section>

          {/* ── TABLE / GRID ── */}
          <section className="w-full py-10 sm:py-12" style={{ background:"#ffffff" }}>
            <Inner>
              {/* Filter pills */}
              <div className="su-fade-up d3 flex items-center gap-2 flex-wrap mb-5">
                {kategoriList.map(k => (
                  <button key={k} className={`kat-pill ${filterKategori===k?"on":"off"}`}
                    onClick={() => { setFilterKategori(k); setPage(1); }}>{k}</button>
                ))}
              </div>

              {/* Controls */}
              <div className="su-fade-up d4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-medium" style={{ color:"rgba(6,78,59,0.42)" }}>Tampilkan</span>
                  <select className="select-g" value={showCount} onChange={e => { setShowCount(Number(e.target.value)); setPage(1); }}>
                    {SHOW_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span className="text-[11px] font-medium" style={{ color:"rgba(6,78,59,0.42)" }}>entri</span>
                  <div className="flex items-center gap-1 ml-1 border rounded-[8px] p-0.5" style={{ borderColor:"rgba(6,78,59,0.12)" }}>
                    <button className={`view-toggle-btn ${viewMode==="table"?"on":"off"}`} onClick={() => setViewMode("table")}><IconList size={13}/></button>
                    <button className={`view-toggle-btn ${viewMode==="grid"?"on":"off"}`} onClick={() => setViewMode("grid")}><IconGrid size={13}/></button>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"rgba(6,78,59,0.32)", display:"flex" }}><IconSearch size={14}/></span>
                  <input className="search-input-g" placeholder="Cari supplier…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
                </div>
              </div>

              {/* ── TABLE VIEW ── */}
              {viewMode === "table" && (
                <div className="su-fade-up d5 su-card overflow-hidden border"
                  style={{ borderColor:"rgba(6,78,59,0.09)", borderRadius:"18px", background:"rgba(255,255,255,0.70)", backdropFilter:"blur(20px)", boxShadow:"0 6px 28px rgba(6,78,59,0.07)" }}>
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background:"rgba(6,78,59,0.03)", borderBottom:"1px solid rgba(6,78,59,0.07)" }}>
                          {[
                            { label:"No",        col:null },
                            { label:"Supplier",  col:"nama" },
                            { label:"Kategori",  col:"kategori", width:120 },
                            { label:"Alamat",    col:"alamat" },
                            { label:"Telepon",   col:"telepon" },
                            { label:"Status",    col:null },
                            { label:"PO Aktif",  col:null },
                            ...(isAdmin ? [{ label:"Aksi", col:null }] : []),
                          ].map((h, i) => (
                            <th key={i}
                              className={`px-5 py-3.5 text-left text-[10px] font-bold tracking-[0.08em] uppercase ${h.col?"sort-th":""}`}
                              style={{ color:"rgba(6,78,59,0.38)", minWidth: h.width ? `${h.width}px` : undefined }}
                              onClick={() => h.col && handleSort(h.col)}>
                              <span className="flex items-center gap-1.5">{h.label} {h.col && <SortIcon col={h.col}/>}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.length === 0 ? (
                          <tr><td colSpan={isAdmin?8:7} className="px-5 py-12 text-center text-sm" style={{ color:"rgba(6,78,59,0.35)" }}>Tidak ada supplier ditemukan.</td></tr>
                        ) : paginated.map((item, i) => {
                          const hasPOAcc = item.pendingPOCount > 0;
                          return (
                            <tr key={item.id} className="tbl-row"
                              style={{ borderTop:"1px solid rgba(6,78,59,0.05)", background: hasPOAcc ? "rgba(254,243,199,0.15)" : i%2===0?"transparent":"rgba(6,78,59,0.012)" }}>
                              <td className="px-5 py-4 text-[11px] font-bold" style={{ color:"rgba(6,78,59,0.30)" }}>{(page-1)*showCount+i+1}</td>
                              <td className="px-5 py-4">
                                <button
                                  onClick={() => setActiveDrawer(item)}
                                  className="flex items-center gap-3 group"
                                  style={{ background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"left" }}
                                >
                                  <div style={{ position:"relative" }}>
                                    <AvatarIcon nama={item.nama}/>
                                    {hasPOAcc && (
                                      <span className="pulse-dot" style={{ position:"absolute", top:-2, right:-2, width:8, height:8, borderRadius:"50%", background:"#E8A850", border:"2px solid #fff" }} />
                                    )}
                                  </div>
                                  <span className="font-semibold text-xs sm:text-sm group-hover:underline" style={{ color:"#022c22" }}>{item.nama}</span>
                                </button>
                              </td>
                              <td className="px-5 py-4" style={{ textAlign: "center" }}>
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                                  style={{ background:KATEGORI_COLORS[item.kategori]?.bg||"#f3f4f6", color:KATEGORI_COLORS[item.kategori]?.text||"#374151", display:"inline-block", whiteSpace:"normal", wordBreak:"break-word", maxWidth: "150px", textAlign: "center" }}>
                                  {item.kategori}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-xs" style={{ color:"rgba(6,78,59,0.58)", maxWidth:"180px" }}>
                                <div className="flex items-start gap-1.5">
                                  <span className="flex-shrink-0 mt-0.5"><IconMapPin size={11} color="rgba(6,78,59,0.40)"/></span>
                                  <span className="line-clamp-2">{item.alamat}</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-xs font-medium" style={{ color:"rgba(6,78,59,0.60)" }}>
                                <div className="flex items-center gap-1.5"><IconPhone size={11} color="rgba(6,78,59,0.40)"/> {item.telepon}</div>
                              </td>
                              <td className="px-5 py-4">
                                {item.aktif
                                  ? <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background:"#d1fae5", color:"#065f46" }}><IconCheck size={9} color="#065f46"/> Aktif</span>
                                  : <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background:"#fee2e2", color:"#991b1b" }}><IconX size={9} color="#991b1b"/> Nonaktif</span>
                                }
                              </td>
                              <td className="px-5 py-4">
                                {item.purchaseOrders.filter(p => p.status !== "completed" && p.status !== "rejected").length > 0 ? (
                                  <button
                                    onClick={() => setActiveDrawer(item)}
                                    className={`po-badge ${hasPOAcc ? "po-badge-pulse" : ""}`}
                                    style={{ background: hasPOAcc ? "#FEF0D6" : "#D6F5E8", color: hasPOAcc ? "#8A4A00" : "#1A6647", border: `1.5px solid ${hasPOAcc ? "#F5C878" : "#A8DEBC"}`, cursor:"pointer" }}
                                  >
                                    {hasPOAcc ? "⚠️" : "🚚"}
                                    {item.purchaseOrders.filter(p => p.status !== "completed" && p.status !== "rejected").length} PO
                                    {hasPOAcc ? " perlu ACC" : " aktif"}
                                  </button>
                                ) : (
                                  <span className="text-[10px]" style={{ color:"rgba(6,78,59,0.28)" }}>—</span>
                                )}
                              </td>
                              {isAdmin && (
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Link href={`/supplier/po?supplier=${item.id}&nama=${encodeURIComponent(item.nama)}`}>
                                      <button className="btn-po" style={{ padding:"6px 10px", fontSize:11 }} title="Buat PO">
                                        <IconFileText size={12} color="#064e3b"/> PO
                                      </button>
                                    </Link>
                                    <Link href={`/supplier/edit/${item.id}`}>
                                      <button className="btn-ghost-g"><IconEdit size={13}/> Edit</button>
                                    </Link>
                                    <button className="btn-danger-g" onClick={() => setDeleteModal(item)}>
                                      <IconTrash size={13} color="#dc2626"/> Hapus
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile */}
                  <div className="sm:hidden divide-y" style={{ borderColor:"rgba(6,78,59,0.07)" }}>
                    {paginated.length === 0 ? (
                      <div className="py-10 text-center text-sm" style={{ color:"rgba(6,78,59,0.35)" }}>Tidak ada supplier.</div>
                    ) : paginated.map(item => {
                      const hasPOAcc = item.pendingPOCount > 0;
                      return (
                        <div key={item.id} className="tbl-row px-4 py-4" style={{ background: hasPOAcc ? "rgba(254,243,199,0.15)" : "transparent" }}>
                          <div className="flex items-start gap-3 mb-3">
                            <button onClick={() => setActiveDrawer(item)} style={{ position:"relative", background:"none", border:"none", padding:0, cursor:"pointer" }}>
                              <AvatarIcon nama={item.nama}/>
                              {hasPOAcc && <span className="pulse-dot" style={{ position:"absolute", top:-2, right:-2, width:8, height:8, borderRadius:"50%", background:"#E8A850", border:"2px solid #fff" }} />}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <button onClick={() => setActiveDrawer(item)} style={{ background:"none", border:"none", padding:0, cursor:"pointer" }}>
                                  <p className="font-semibold text-sm" style={{ color:"#022c22" }}>{item.nama}</p>
                                </button>
                                {item.aktif
                                  ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ background:"#d1fae5", color:"#065f46" }}>Aktif</span>
                                  : <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ background:"#fee2e2", color:"#991b1b" }}>Nonaktif</span>
                                }
                              </div>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 inline-block"
                                style={{ background:KATEGORI_COLORS[item.kategori]?.bg, color:KATEGORI_COLORS[item.kategori]?.text }}>
                                {item.kategori}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1 mb-3 pl-11">
                            <p className="text-[11px] flex items-start gap-1.5" style={{ color:"rgba(6,78,59,0.55)" }}>
                              <IconMapPin size={11} color="rgba(6,78,59,0.40)"/> {item.alamat}
                            </p>
                            <p className="text-[11px] flex items-center gap-1.5" style={{ color:"rgba(6,78,59,0.55)" }}>
                              <IconPhone size={11} color="rgba(6,78,59,0.40)"/> {item.telepon}
                            </p>
                          </div>
                          {item.purchaseOrders.filter(p => p.status !== "completed" && p.status !== "rejected").length > 0 && (
                            <div className="pl-11 mb-3">
                              <button onClick={() => setActiveDrawer(item)} className={`po-badge ${hasPOAcc ? "po-badge-pulse" : ""}`}
                                style={{ background: hasPOAcc ? "#FEF0D6" : "#D6F5E8", color: hasPOAcc ? "#8A4A00" : "#1A6647", border:`1.5px solid ${hasPOAcc ? "#F5C878" : "#A8DEBC"}`, cursor:"pointer" }}>
                                {hasPOAcc ? "⚠️" : "🚚"}
                                {item.purchaseOrders.filter(p => p.status !== "completed" && p.status !== "rejected").length} PO {hasPOAcc ? "perlu ACC" : "aktif"}
                              </button>
                            </div>
                          )}
                          {isAdmin && (
                            <div className="flex gap-2 pl-11">
                              <Link href={`/supplier/po?supplier=${item.id}&nama=${encodeURIComponent(item.nama)}`} className="flex-1">
                                <button className="btn-po w-full justify-center" style={{ fontSize:11 }}><IconFileText size={12}/> Buat PO</button>
                              </Link>
                              <Link href={`/supplier/edit/${item.id}`} className="flex-1">
                                <button className="btn-ghost-g w-full justify-center"><IconEdit size={13}/> Edit</button>
                              </Link>
                              <button className="btn-danger-g flex-1 justify-center" onClick={() => setDeleteModal(item)}>
                                <IconTrash size={13} color="#dc2626"/> Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── GRID VIEW ── */}
              {viewMode === "grid" && (
                <div className="su-fade-up d5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginated.length === 0 ? (
                    <div className="col-span-3 py-12 text-center text-sm" style={{ color:"rgba(6,78,59,0.35)" }}>Tidak ada supplier ditemukan.</div>
                  ) : paginated.map(item => {
                    const hasPOAcc = item.pendingPOCount > 0;
                    return (
                      <div key={item.id} className="sup-grid-card" style={{ borderColor: hasPOAcc ? "rgba(245,200,120,0.50)" : "rgba(6,78,59,0.10)", background: hasPOAcc ? "rgba(254,243,199,0.12)" : "rgba(255,255,255,0.75)" }}>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <button onClick={() => setActiveDrawer(item)} className="flex items-center gap-3" style={{ background:"none", border:"none", padding:0, cursor:"pointer", textAlign:"left" }}>
                            <div style={{ position:"relative" }}>
                              <AvatarIcon nama={item.nama}/>
                              {hasPOAcc && <span className="pulse-dot" style={{ position:"absolute", top:-2, right:-2, width:8, height:8, borderRadius:"50%", background:"#E8A850", border:"2px solid #fff" }} />}
                            </div>
                            <div>
                              <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm leading-snug hover:underline" style={{ color:"#022c22" }}>{item.nama}</p>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background:KATEGORI_COLORS[item.kategori]?.bg, color:KATEGORI_COLORS[item.kategori]?.text }}>{item.kategori}</span>
                            </div>
                          </button>
                          {item.aktif
                            ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0" style={{ background:"#d1fae5", color:"#065f46" }}>Aktif</span>
                            : <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0" style={{ background:"#fee2e2", color:"#991b1b" }}>Nonaktif</span>
                          }
                        </div>
                        <div className="space-y-2 py-3 border-t border-b mb-3" style={{ borderColor:"rgba(6,78,59,0.08)" }}>
                          <p className="text-[11px] flex items-start gap-2" style={{ color:"rgba(6,78,59,0.55)" }}>
                            <span className="flex-shrink-0 mt-0.5"><IconMapPin size={11} color="rgba(6,78,59,0.42)"/></span>
                            {item.alamat}
                          </p>
                          <p className="text-[11px] flex items-center gap-2" style={{ color:"rgba(6,78,59,0.55)" }}>
                            <IconPhone size={11} color="rgba(6,78,59,0.42)"/> {item.telepon}
                          </p>
                          {item.purchaseOrders.filter(p => p.status !== "completed" && p.status !== "rejected").length > 0 && (
                            <button onClick={() => setActiveDrawer(item)} className={`po-badge ${hasPOAcc ? "po-badge-pulse" : ""}`}
                              style={{ background: hasPOAcc ? "#FEF0D6" : "#D6F5E8", color: hasPOAcc ? "#8A4A00" : "#1A6647", border:`1.5px solid ${hasPOAcc ? "#F5C878" : "#A8DEBC"}`, cursor:"pointer", marginTop:4 }}>
                              {hasPOAcc ? "⚠️" : "🚚"} {item.purchaseOrders.filter(p => p.status !== "completed" && p.status !== "rejected").length} PO {hasPOAcc ? "perlu ACC" : "aktif"}
                            </button>
                          )}
                        </div>
                        {isAdmin && (
                          <div className="flex gap-2">
                            <Link href={`/supplier/po?supplier=${item.id}&nama=${encodeURIComponent(item.nama)}`} className="flex-1">
                              <button className="btn-po w-full justify-center" style={{ fontSize:11 }}><IconFileText size={12}/> Buat PO</button>
                            </Link>
                            <Link href={`/supplier/edit/${item.id}`} className="flex-1">
                              <button className="btn-ghost-g w-full justify-center"><IconEdit size={13}/> Edit</button>
                            </Link>
                            <button className="btn-danger-g flex-1 justify-center" onClick={() => setDeleteModal(item)}>
                              <IconTrash size={13} color="#dc2626"/> Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              <div className="su-fade-up d7 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
                <p className="text-[11px] font-medium" style={{ color:"rgba(6,78,59,0.40)" }}>
                  Menampilkan {Math.min((page-1)*showCount+1, sorted.length)}–{Math.min(page*showCount, sorted.length)} dari {sorted.length} entri
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button className="page-btn-g" disabled={page===1} onClick={() => setPage(p => p-1)}>‹</button>
                  {Array.from({ length:totalPages }, (_,i) => i+1)
                    .filter(p => p===1||p===totalPages||Math.abs(p-page)<=1)
                    .reduce<(number|"…")[]>((acc,p,idx,arr) => {
                      if (idx>0 && p-(arr[idx-1] as number)>1) acc.push("…");
                      acc.push(p); return acc;
                    }, [])
                    .map((p,i) => p==="…"
                      ? <span key={i} className="text-[11px] px-1" style={{ color:"rgba(6,78,59,0.35)" }}>…</span>
                      : <button key={i} className={`page-btn-g${page===p?" active":""}`} onClick={() => setPage(p as number)}>{p}</button>
                    )}
                  <button className="page-btn-g" disabled={page===totalPages} onClick={() => setPage(p => p+1)}>›</button>
                </div>
              </div>
            </Inner>
          </section>
        </main>

        <Footer/>

        {/* ── PO Drawer ── */}
        {activeDrawer && (
          <PODrawer
            supplier={activeDrawer}
            userRole={userRole}
            onClose={() => setActiveDrawer(null)}
            onAcc={(sId, poId) => {
              const sup = data.find(s => s.id === sId);
              const po  = sup?.purchaseOrders.find(p => p.id === poId);
              if (sup && po) setAccModal({ supplierId: sId, po });
            }}
            onReject={(sId, poId) => {
              const sup = data.find(s => s.id === sId);
              const po  = sup?.purchaseOrders.find(p => p.id === poId);
              if (sup && po) setRejectModal({ supplierId: sId, po });
            }}
          />
        )}

        {/* ── ACC Confirm Modal ── */}
        {accModal && (
          <AccModal
            po={accModal.po}
            supplierNama={data.find(s => s.id === accModal.supplierId)?.nama || "Supplier"}
            onConfirm={confirmAcc}
            onCancel={() => setAccModal(null)}
          />
        )}

        {/* ── Reject Confirm Modal ── */}
        {rejectModal && (
          <RejectModal
            po={rejectModal.po}
            onConfirm={confirmReject}
            onCancel={() => setRejectModal(null)}
          />
        )}

        {/* ── Delete Modal ── */}
        {deleteModal && (
          <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background:"rgba(2,44,34,0.45)", backdropFilter:"blur(8px)" }}
            onClick={() => setDeleteModal(null)}>
            <div className="modal-box w-full max-w-sm p-6 sm:p-7 border"
              style={{ background:"#ffffff", borderRadius:"20px", borderColor:"rgba(6,78,59,0.10)", boxShadow:"0 24px 60px rgba(2,44,34,0.22)" }}
              onClick={e => e.stopPropagation()}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background:"#fee2e2" }}>
                <IconTrash size={20} color="#dc2626"/>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-black text-lg mb-1.5" style={{ color:"#022c22" }}>Hapus Supplier?</h2>
              <p className="text-sm mb-6" style={{ color:"rgba(6,78,59,0.55)" }}>
                <span className="font-semibold" style={{ color:"#022c22" }}>{deleteModal.nama}</span> akan dihapus permanen dari sistem.
              </p>
              <div className="flex gap-3">
                <button className="btn-ghost-g flex-1 justify-center" style={{ padding:"10px 16px", fontSize:"13px" }} onClick={() => setDeleteModal(null)}>Batal</button>
                <button className="btn-danger-g flex-1 justify-center font-bold" style={{ padding:"10px 16px", fontSize:"13px" }} onClick={() => handleDelete(deleteModal)}>
                  <IconTrash size={13} color="#dc2626"/> Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Toast ── */}
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}