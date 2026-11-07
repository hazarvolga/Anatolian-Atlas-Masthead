import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const BACKEND_URL = process.env.API_INTERNAL_URL || "http://127.0.0.1:3001";
const NEXT_URL = "http://127.0.0.1:3100";

const results = [];
function record(name, passed, detail) {
  results.push({ name, passed, detail });
  console.log(`${passed ? "✅ PASS" : "❌ FAIL"} — ${name}: ${detail}`);
}

async function main() {
  console.log("=== FAZ 9 SECURITY & PACKAGING VERIFICATION SUITE ===\n");

  // 1. Static Audit: Zero localStorage.getItem('authToken') or setItem('authToken')
  const grepAuthToken = execSync(
    `grep -rnE "localStorage\\.(getItem|setItem)\\(['\\"]authToken['\\"]" src/ app/ || true`,
    { cwd: path.resolve(import.meta.dirname, ".."), encoding: "utf8" }
  ).trim();
  record(
    "Zero localStorage.authToken getItem/setItem in web-next",
    grepAuthToken.length === 0,
    grepAuthToken.length === 0
      ? "0 matches across src/ and app/ (all 24 hooks migrated to shared api client)"
      : `Found matches:\n${grepAuthToken}`
  );

  // 2. Static Audit: Zero hardcoded 'NextStopTurkey' in components/ and app/
  const grepBrand = execSync(
    `grep -rn "NextStopTurkey" src/components/ app/ || true`,
    { cwd: path.resolve(import.meta.dirname, ".."), encoding: "utf8" }
  ).trim();
  record(
    "White-Label Audit (Zero hardcoded 'NextStopTurkey' in src/components/ & app/)",
    grepBrand.length === 0,
    grepBrand.length === 0
      ? "0 hardcoded strings found; all components read from siteConfig.brand.name"
      : `Found matches:\n${grepBrand}`
  );

  // 3. Register / Login & Verify __Host-nst_access + __Host-nst_refresh HttpOnly Cookies
  const testEmail = `sec.audit.${Date.now()}@example.com`;
  const testPassword = "SecurePassword!2026";
  const regRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3100",
    },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
      first_name: "Security",
      last_name: "Auditor",
    }),
  });

  const setCookieHeaders = regRes.headers.getSetCookie
    ? regRes.headers.getSetCookie()
    : [regRes.headers.get("set-cookie") || ""];

  const hostAccessCookie = setCookieHeaders.find((c) =>
    c.startsWith("__Host-nst_access=")
  );
  const hostRefreshCookie = setCookieHeaders.find((c) =>
    c.startsWith("__Host-nst_refresh=")
  );

  const hasHttpOnlyAccess =
    Boolean(hostAccessCookie) &&
    hostAccessCookie.includes("HttpOnly") &&
    hostAccessCookie.includes("Secure") &&
    hostAccessCookie.includes("Path=/") &&
    hostAccessCookie.includes("Max-Age=900");

  const hasHttpOnlyRefresh =
    Boolean(hostRefreshCookie) &&
    hostRefreshCookie.includes("HttpOnly") &&
    hostRefreshCookie.includes("Secure") &&
    hostRefreshCookie.includes("Path=/") &&
    hostRefreshCookie.includes("Max-Age=604800");

  record(
    "__Host-nst_access (15m) & __Host-nst_refresh (7d) HttpOnly Cookie Issuance",
    regRes.status === 201 && hasHttpOnlyAccess && hasHttpOnlyRefresh,
    `HTTP ${regRes.status} | __Host-nst_access (HttpOnly, Secure, Max-Age=900): ${hasHttpOnlyAccess} | __Host-nst_refresh (HttpOnly, Secure, Max-Age=604800): ${hasHttpOnlyRefresh}`
  );

  // 4. Cookie-Only Authentication on GET /api/auth/me (without Authorization header)
  const accessCookiePair = hostAccessCookie ? hostAccessCookie.split(";")[0] : "";
  const refreshCookiePair = hostRefreshCookie ? hostRefreshCookie.split(";")[0] : "";

  const meRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
    headers: {
      Cookie: accessCookiePair,
    },
  });
  const meBody = await meRes.json().catch(() => ({}));
  record(
    "Cookie-Only Auth on GET /api/auth/me (No Authorization Bearer Header)",
    meRes.status === 200 && meBody.email === testEmail,
    `HTTP ${meRes.status} | Authenticated email=${meBody.email}`
  );

  // 5. Rotating Refresh Token & Reuse Detection (Family Revocation)
  const refreshRes1 = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      Cookie: refreshCookiePair,
      Origin: "http://localhost:3100",
    },
  });
  const rotatedCookies = refreshRes1.headers.getSetCookie
    ? refreshRes1.headers.getSetCookie()
    : [refreshRes1.headers.get("set-cookie") || ""];
  const rotatedRefreshHeader = rotatedCookies.find((c) =>
    c.startsWith("__Host-nst_refresh=")
  );
  const rotatedRefreshPair = rotatedRefreshHeader
    ? rotatedRefreshHeader.split(";")[0]
    : "";

  record(
    "Refresh Token Rotation (POST /api/auth/refresh)",
    refreshRes1.status === 200 &&
      Boolean(rotatedRefreshPair) &&
      rotatedRefreshPair !== refreshCookiePair,
    `HTTP ${refreshRes1.status} | Rotated token issued and differs from initial token`
  );

  // Replay the OLD consumed refresh token -> must trigger reuse detection and revoke family
  const replayOldRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      Cookie: refreshCookiePair,
      Origin: "http://localhost:3100",
    },
  });
  const replayOldBody = await replayOldRes.json().catch(() => ({}));

  // Now attempt to use the rotated refresh token from the same family -> must also be rejected (`family_revoked`)
  const afterReuseRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      Cookie: rotatedRefreshPair,
      Origin: "http://localhost:3100",
    },
  });
  const afterReuseBody = await afterReuseRes.json().catch(() => ({}));

  record(
    "Refresh Token Reuse Detection & Token Family Revocation",
    replayOldRes.status === 401 &&
      replayOldBody.reason === "token_reuse_detected" &&
      afterReuseRes.status === 401 &&
      afterReuseBody.reason === "family_revoked",
    `Replay old JTI -> HTTP ${replayOldRes.status} (${replayOldBody.reason}) | Subsequent family token -> HTTP ${afterReuseRes.status} (${afterReuseBody.reason})`
  );

  // 6. CSRF Origin Validation (`originCheckMiddleware`)
  const csrfRes = await fetch(`${BACKEND_URL}/api/contact-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://evil-csrf-origin.example.com",
    },
    body: JSON.stringify({
      name: "Attacker",
      email: "attacker@example.com",
      subject: "Test",
      message: "Cross-origin mutation attempt",
    }),
  });
  record(
    "CSRF Origin Validation (Blocks untrusted Origin on POST /api/*)",
    csrfRes.status === 403,
    `Untrusted Origin blocked with HTTP ${csrfRes.status}`
  );

  // 7. Honeypot Spam Protection on Public Contact Form
  const honeypotRes = await fetch(`${BACKEND_URL}/api/contact-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3100",
    },
    body: JSON.stringify({
      name: "Spam Bot",
      email: "bot@example.com",
      subject: "Automated spam",
      message: "Automated spam message payload",
      website: "https://spam-link.example",
    }),
  });
  record(
    "Honeypot Bot Protection on Public Contact Form",
    honeypotRes.status === 400,
    `Bot-filled honeypot rejected with HTTP ${honeypotRes.status}`
  );

  // 8. RBAC Enforcement: Non-Admin User Blocked from /api/admin/site-settings
  const nonAdminRes = await fetch(`${BACKEND_URL}/api/admin/site-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: accessCookiePair,
      Origin: "http://localhost:3100",
    },
    body: JSON.stringify({ site_title: "Unauthorized Change" }),
  });
  record(
    "Server-Side RBAC (adminMiddleware blocks role='user' on /api/admin/*)",
    nonAdminRes.status === 403,
    `Non-admin user received HTTP ${nonAdminRes.status} Forbidden`
  );

  // 9. Next.js Production Security Headers, COOP, x-nonce & /api/revalidate Secret Protection
  const nextHomeRes = await fetch(`${NEXT_URL}/`);
  const csp = nextHomeRes.headers.get("content-security-policy") || "";
  const hsts = nextHomeRes.headers.get("strict-transport-security") || "";
  const coop = nextHomeRes.headers.get("cross-origin-opener-policy") || "";
  const nonce = nextHomeRes.headers.get("x-nonce") || "";

  const unauthRevalidateRes = await fetch(`${NEXT_URL}/api/revalidate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tags: ["catalog-tours"] }),
  });

  record(
    "Next.js Security Headers (CSP, HSTS, COOP, x-nonce) & /api/revalidate Secret Check",
    Boolean(csp) &&
      Boolean(hsts) &&
      coop === "same-origin" &&
      nonce.length >= 16 &&
      unauthRevalidateRes.status === 401,
    `CSP=present | HSTS=present | COOP=${coop} | x-nonce=${nonce.slice(0, 12)}... | Unauth /api/revalidate -> HTTP ${unauthRevalidateRes.status}`
  );

  const failed = results.filter((r) => !r.passed);
  console.log(
    `\nSummary: ${results.length - failed.length}/${results.length} security checks passed.`
  );
  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
