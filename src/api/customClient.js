const BACKEND_ENV = import.meta.env.VITE_BACKEND_URL || "";
const BASE_URL = BACKEND_ENV.endsWith("/") ? BACKEND_ENV.slice(0, -1) : BACKEND_ENV;

const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

async function request(path, options = {}) {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const resp = await fetch(url, {
    credentials: "include",
    ...options,
    headers: { ...(options.headers || {}), ...jsonHeaders },
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const err = new Error(data.message || resp.statusText);
    err.status = resp.status;
    err.body = data;
    throw err;
  }
  return data;
}

export const auth = {
  login: ({ email, password }) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/auth/me"),
  register: ({ email, password }) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password }) }),
  verifyOtp: ({ email, otpCode }) =>
    request("/api/auth/otp/verify", { method: "POST", body: JSON.stringify({ email, otpCode }) }),
  resendOtp: (email) =>
    request("/api/auth/otp/resend", { method: "POST", body: JSON.stringify({ email }) }),
  forgotPassword: (email) =>
    request("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: ({ token, password }) =>
    request("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }),
};

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};
