// lib/auth.ts

export type UserRole = "owner" | "admin" | "user" | "supplier";

export interface DummyUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export const DUMMY_USERS: DummyUser[] = [
  {
    email: "owner@inventix.com",
    password: "owner123",
    name: "Owner Inventix",
    role: "owner",
  },
  {
    email: "admin@inventix.com",
    password: "admin123",
    name: "Admin Inventix",
    role: "admin",
  },
  {
    email: "staff@inventix.com",
    password: "staff123",
    name: "Staff Gudang",
    role: "user",
  },
  {
    email: "supplier@inventix.com",
    password: "supplier123",
    name: "PT Maju Bersama",
    role: "supplier",
  },
];

// Cari user berdasarkan email + password
export function findUser(email: string, password: string): DummyUser | null {
  return (
    DUMMY_USERS.find(
      (u) => u.email === email && u.password === password
    ) ?? null
  );
}

// Redirect setelah login
export function getRedirectByRole(role: UserRole): string {
  switch (role) {
    case "owner":
    case "admin":
    case "user":
      return "/dashboard";
    case "supplier":
      return "/supplier/portal";
  }
}

// Bisa CRUD (stock, penjualan, supplier, user)?
export function canEdit(role: UserRole): boolean {
  return role === "owner" || role === "admin";
}

// Bisa hapus akun ber-role admin?
export function canDeleteAdmin(role: UserRole): boolean {
  return role === "owner";
}

// Cookie key names
export const COOKIE_TOKEN = "token";
export const COOKIE_ROLE  = "role";
export const COOKIE_NAME  = "user_name";