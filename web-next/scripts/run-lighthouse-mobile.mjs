import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.BASE_URL || "http://localhost:3100";
const CHROME_PATH =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const ROUTES = [
  "/",
  "/tours",
  "/tours/tour-cappadocia-tuff",
  "/journal/mimar-sinan-acoustic-vessels-and-structural-geometry-in-istanbul",
  "/book/tour-cappadocia-tuff",
];

const results = [];

console.log("=================================================================");
console.log(
  "LIGHTHOUSE MOBILE CLI AUDIT (SIMULATED 4G NETWORK + 4x CPU THROTTLING)"
);
console.log("=================================================================\n");

for (const route of ROUTES) {
  const url = `${BASE_URL}${route}`;
  const outFile = path.resolve(
    __dirname,
    `../.lh-mobile-${route.replace(/[^a-z0-9]/gi, "_") || "home"}.json`
  );

  execFileSync(
    "npx",
    [
      "lighthouse",
      url,
      "--form-factor=mobile",
      "--throttling-method=simulate",
      "--screenEmulation.mobile=true",
      "--screenEmulation.width=360",
      "--screenEmulation.height=800",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--output=json",
      `--output-path=${outFile}`,
      `--chrome-flags=--headless=new --no-sandbox --disable-gpu`,
      "--quiet",
    ],
    {
      env: { ...process.env, CHROME_PATH },
      stdio: "inherit",
    }
  );

  const report = JSON.parse(fs.readFileSync(outFile, "utf8"));
  fs.unlinkSync(outFile);

  const perf = Math.round((report.categories.performance?.score || 0) * 100);
  const a11y = Math.round((report.categories.accessibility?.score || 0) * 100);
  const bp = Math.round(
    (report.categories["best-practices"]?.score || 0) * 100
  );
  const seo = Math.round((report.categories.seo?.score || 0) * 100);

  const lcpMs = Math.round(
    report.audits["largest-contentful-paint"]?.numericValue || 0
  );
  const tbtMs = Math.round(
    report.audits["total-blocking-time"]?.numericValue || 0
  );
  const clsVal = Number(
    (report.audits["cumulative-layout-shift"]?.numericValue || 0).toFixed(4)
  );
  const fcpMs = Math.round(
    report.audits["first-contentful-paint"]?.numericValue || 0
  );

  const row = {
    route,
    performance: perf,
    accessibility: a11y,
    bestPractices: bp,
    seo,
    fcpMs,
    lcpMs,
    tbtMs,
    cls: clsVal,
  };
  results.push(row);

  console.log(
    `[Lighthouse Mobile] ${route.padEnd(72)} | Perf: ${perf} | A11y: ${a11y} | BP: ${bp} | SEO: ${seo} | LCP: ${lcpMs}ms | TBT: ${tbtMs}ms | CLS: ${clsVal}`
  );
}

console.log("\nJSON SUMMARY:");
console.log(JSON.stringify(results, null, 2));
