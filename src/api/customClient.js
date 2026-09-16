const BASE_URL = import.meta.env?.VITE_BACKEND_URL?.replace(/\\/+$/, "") || "";

const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

async function request(path, options = {}) {
  const resp = await fetch(`${BASE_URL}${path}`, {
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
  // POST /auth/login {email,password}
  login: ({ email, password }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  // POST /auth/logout
  logout: () => request("/auth/logout", { method: "POST" }),
  // GET /auth/me
  me: () => request("/auth/me"),
  // POST /auth/register {email,password}
  register: ({ email, password }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ email, password }) }),
  // POST /auth/otp/verify {email,otpCode}
  verifyOtp: ({ email, otpCode }) =>
    request("/auth/otp/verify", { method: "POST", body: JSON.stringify({ email, otpCode }) }),
  // POST /auth/otp/resend {email}
  resendOtp: (email) =>
    request("/auth/otp/resend", { method: "POST", body: JSON.stringify({ email }) }),
  // POST /auth/forgot-password {email}
  forgotPassword: (email) =>
    request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  // POST /auth/reset-password {token,password}
  resetPassword: ({ token, password }) =>
    request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) }),
};

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};
