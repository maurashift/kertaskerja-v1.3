import { AlertNotification } from "../lib/alert";

/* opsi tambahan cookie */
type CookieOptions = {
  path?: string;
  maxAge?: number; // detik
  expires?: Date;
  sameSite?: "lax" | "strict" | "none" | "Lax" | "Strict" | "None";
  secure?: boolean;
};

/* set cookie (client only) */
export const setCookie = (
  name: string,
  value: string,
  opts: CookieOptions = {},
) => {
  if (typeof document === "undefined") return;

  const {
    path = "/",
    sameSite = "Lax",
    secure = process.env.NODE_ENV === "production",
    maxAge,
    expires,
  } = opts;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value,
  )}; Path=${path}; SameSite=${sameSite}`;

  if (secure) cookie += "; Secure";
  if (typeof maxAge === "number") cookie += `; Max-Age=${maxAge}`;
  if (expires instanceof Date)
    cookie += `; Expires=${expires.toUTCString()}`;

  document.cookie = cookie;
};

/* ambil cookie (aman untuk SSR) */
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const target = `; ${encodeURIComponent(name)}=`;
  const value = `; ${document.cookie}`;
  const parts = value.split(target);

  if (parts.length === 2) {
    const raw = parts.pop()!.split(";").shift()!;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  return null;
};

/* hapus cookie */
export const removeCookie = (name: string, path = "/") => {
  if (typeof document === "undefined") return;

  document.cookie = `${encodeURIComponent(
    name,
  )}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

/* login user */
export async function login(username: string, password: string): Promise<void> {
  const API_LOGIN = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_LOGIN}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Login gagal");
  }

  const data = await res.json();

  AlertNotification({
  title: "Berhasil Login",
  icon: "success",
  timer: 2000,
  showConfirmButton: true,
});


  localStorage.setItem("sessionId", data.sessionId);
  document.cookie = `sessionId=${data.sessionId}; path=/; secure; samesite=strict`;
}

/* logout & bersih-bersih */
export const logout = () => {
  removeCookie("sessionId");
  removeCookie("token");
  removeCookie("user");
  removeCookie("opd");
  removeCookie("periode");
  removeCookie("tahun");

  try {
    localStorage.removeItem("sessionId");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("opd");
    localStorage.removeItem("periode");
  } catch {}

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

/* ambil user dari cookie */
export const getUser = () => {
  const raw = getCookie("user");
  if (!raw) return undefined;

  try {
    return { user: JSON.parse(raw) };
  } catch {
    return undefined;
  }
};

/* ambil token auth */
export const getToken = () => {
  return getCookie("token");
};

/* ambil session id */
export const getSessionId = () => {
  return localStorage.getItem("sessionId") ?? "-";
};

/* ambil opd & tahun aktif */
export const getOpdTahun = () => {
  const tRaw = getCookie("tahun");
  const oRaw = getCookie("opd");

  let tahun = null;
  let opd = null;

  try {
    if (tRaw) tahun = JSON.parse(tRaw);
  } catch {}

  try {
    if (oRaw) opd = JSON.parse(oRaw);
  } catch {}

  return { tahun, opd };
};

/* ambil periode aktif */
export const getPeriode = () => {
  const raw = getCookie("periode");

  try {
    if (raw) return { periode: JSON.parse(raw) };
  } catch {}

  return { periode: null };
};
