import Cookies from "js-cookie";
import { COOKIE_TOKEN } from "./auth";

export const API_BASE_URL = "https://api.stockinventix.cloud/api";

// Role Mapping Helper 
export type FrontendRole = "owner" | "admin" | "user" | "supplier";
export type BackendRole = "OWNER" | "ADMIN" | "GUDANG" | "SUPPLIER" | "PEMBELI";

export function mapRoleToFrontend(role: string): FrontendRole {
  switch (role?.toUpperCase()) {
    case "OWNER":
      return "owner";
    case "ADMIN":
      return "admin";
    case "GUDANG":
      return "user";
    case "SUPPLIER":
      return "supplier";
    default:
      return "user";
  }
}

export function mapRoleToBackend(role: string): BackendRole {
  switch (role?.toLowerCase()) {
    case "owner":
      return "OWNER";
    case "admin":
      return "ADMIN";
    case "user":
      return "GUDANG";
    case "supplier":
      return "SUPPLIER";
    default:
      return "PEMBELI";
  }
}

//  Generic HTTP Request Wrapper 
async function apiRequest<T>(
  method: string,
  path: string,
  body?: any
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const token = Cookies.get(COOKIE_TOKEN);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    
    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API error (${response.status})`);
    }

    return data as T;
  } catch (error: any) {
    console.error(`API Request failed [${method} ${path}]:`, error);
    throw error;
  }
}

//  API Endpoint Functions 

export const api = {
  // Auth
  auth: {
    login: (body: any) =>
      apiRequest<{ data: { token: string; user: any }; message: string }>(
        "POST",
        "/auth/login",
        body
      ),
    register: (body: any) =>
      apiRequest<{ data: { token: string; user: any }; message: string }>(
        "POST",
        "/auth/register",
        body
      ),
  },

  // Akun / Users
  akun: {
    getAll: () =>
      apiRequest<{ data: any[]; message: string }>("GET", "/akun"),
    getById: (id: number) =>
      apiRequest<{ data: any; message: string }>("GET", `/akun/${id}`),
    create: (body: any) =>
      apiRequest<{ data: any; message: string }>("POST", "/akun", body),
    update: (id: number, body: any) =>
      apiRequest<{ data: any; message: string }>("PUT", `/akun/${id}`, body),
    delete: (id: number) =>
      apiRequest<{ message: string }>("DELETE", `/akun/${id}`),
    profile: () =>
      apiRequest<{ data: any; message: string }>("GET", "/akun/profile"),
  },

  // Stok Barang
  stok: {
    getAll: () =>
      apiRequest<{ data: any[]; message: string }>("GET", "/stok"),
    getById: (id: number) =>
      apiRequest<{ data: any; message: string }>("GET", `/stok/${id}`),
    create: (body: any) =>
      apiRequest<{ data: any; message: string }>("POST", "/stok", body),
    update: (id: number, body: any) =>
      apiRequest<{ data: any; message: string }>("PUT", `/stok/${id}`, body),
    delete: (id: number) =>
      apiRequest<{ message: string }>("DELETE", `/stok/${id}`),
    // Waste management — mark expired stock as waste
    markAsWaste: (id: number) =>
      apiRequest<{ data: any; message: string }>("PUT", `/stok/${id}`, {
        status: "waste",
        keterangan: "Ditandai sebagai limbah karena kedaluwarsa",
      }),
    // Fetch only expired items (backend filtered)
    getExpired: () =>
      apiRequest<{ data: any[]; message: string }>("GET", "/stok?status=expired"),
  },

  // Klasifikasi Stok
  klasifikasiStok: {
    getAll: () =>
      apiRequest<{ data: any[]; message: string }>("GET", "/klasifikasi-stok"),
    getById: (id: number) =>
      apiRequest<{ data: any; message: string }>("GET", `/klasifikasi-stok/${id}`),
    create: (body: any) =>
      apiRequest<{ data: any; message: string }>("POST", "/klasifikasi-stok", body),
    update: (id: number, body: any) =>
      apiRequest<{ data: any; message: string }>("PUT", `/klasifikasi-stok/${id}`, body),
    delete: (id: number) =>
      apiRequest<{ message: string }>("DELETE", `/klasifikasi-stok/${id}`),
  },

  // Supplier
  supplier: {
    getAll: () =>
      apiRequest<{ data: any[]; message: string }>("GET", "/supplier"),
    getById: (id: number) =>
      apiRequest<{ data: any; message: string }>("GET", `/supplier/${id}`),
    create: (body: any) =>
      apiRequest<{ data: any; message: string }>("POST", "/supplier", body),
    update: (id: number, body: any) =>
      apiRequest<{ data: any; message: string }>("PUT", `/supplier/${id}`, body),
    delete: (id: number) =>
      apiRequest<{ message: string }>("DELETE", `/supplier/${id}`),
  },

  // Purchase Order
  purchaseOrder: {
    getAll: () =>
      apiRequest<{ data: any[]; message: string }>("GET", "/purchase-order"),
    getById: (id: number) =>
      apiRequest<{ data: any; message: string }>("GET", `/purchase-order/${id}`),
    create: (body: any) =>
      apiRequest<{ data: any; message: string }>("POST", "/purchase-order", body),
    update: (id: number, body: any) =>
      apiRequest<{ data: any; message: string }>("PUT", `/purchase-order/${id}`, body),
    delete: (id: number) =>
      apiRequest<{ message: string }>("DELETE", `/purchase-order/${id}`),
    // Owner approval workflow
    approve: (id: number) =>
      apiRequest<{ data: any; message: string }>("PATCH", `/purchase-order/${id}/owner-approve`),
    reject: (id: number) =>
      apiRequest<{ data: any; message: string }>("PATCH", `/purchase-order/${id}/owner-reject`),
    // Supplier confirmation (updates stock automatically on backend)
    supplierConfirm: (id: number) =>
      apiRequest<{ data: any; message: string }>("PATCH", `/purchase-order/${id}/supplier-confirm`),
    supplierReject: (id: number) =>
      apiRequest<{ data: any; message: string }>("PATCH", `/purchase-order/${id}/supplier-reject`),
  },

  // Pembelian Transaksi (Stock Transactions)
  pembelianTransaksi: {
    getAll: () =>
      apiRequest<{ data: any[]; message: string }>("GET", "/pembelian-transaksi"),
    getById: (id: number) =>
      apiRequest<{ data: any; message: string }>("GET", `/pembelian-transaksi/${id}`),
    create: (body: any) =>
      apiRequest<{ data: any; message: string }>("POST", "/pembelian-transaksi", body),
    bulkCreate: (body: { transaksi: any[] }) =>
      apiRequest<{ data: any[]; message: string }>("POST", "/pembelian-transaksi/bulk", body),
    delete: (id: number) =>
      apiRequest<{ message: string }>("DELETE", `/pembelian-transaksi/${id}`),
  },

  // Riwayat Aktivitas
  riwayatAktivitas: {
    getAll: () =>
      apiRequest<{ data: any[]; message: string }>("GET", "/riwayat-aktivitas"),
    getById: (id: number) =>
      apiRequest<{ data: any; message: string }>("GET", `/riwayat-aktivitas/${id}`),
  },

  // Laporan Pengeluaran (Owner only)
  laporan: {
    getPengeluaran: (params?: { from?: string; to?: string }) => {
      let qs = "";
      if (params?.from) qs += `?from=${params.from}`;
      if (params?.to)   qs += `${qs ? "&" : "?"}to=${params.to}`;
      return apiRequest<{ data: any[]; message: string }>("GET", `/laporan/pengeluaran${qs}`);
    },
    getSummary: () =>
      apiRequest<{ data: any; message: string }>("GET", "/laporan/summary"),
  },
};
