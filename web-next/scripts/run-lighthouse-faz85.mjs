import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "../../backend/node_modules/dotenv/lib/main.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../backend/.env") });

const BASE_URL = process.env.BASE_URL || "http://localhost:3100";
const CHROME_PATH =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const CONCEPT_CONFIGS = {
  "atlas-editorial": {
    preset: "atlas-editorial",
    mode: "light",
    radius: "sharp",
    density: "airy",
    motion: { level: "full", smoothScroll: true },
    layout: {
      header: "swiss-bar",
      footer: "atlas-columns",
      home: "masthead",
      tourCard: "portrait-4x5",
      destinationIndex: "map-index",
      tourDetail: "dossier",
    },
  },
  "aegean-linen": {
    preset: "aegean-linen",
    mode: "light",
    radius: "soft",
    density: "airy",
    motion: { level: "full", smoothScroll: true },
    layout: {
      header: "minimal-overlay",
      footer: "minimal",
      home: "split-cinema",
      tourCard: "landscape-row",
      destinationIndex: "horizontal-scroll",
      tourDetail: "story-scroll",
    },
  },
  "ottoman-noir": {
    preset: "ottoman-noir",
    mode: "dark",
    radius: "sharp",
    density: "airy",
    motion: { level: "full", smoothScroll: true },
    layout: {
      header: "centered-logo",
      footer: "big-wordmark",
      home: "fullscreen-reel",
      tourCard: "full-bleed-minimal",
      destinationIndex: "grid-mosaic",
      tourDetail: "tabs",
    },
  },
};

const CONCEPTS = ["atlas-editorial", "aegean-linen", "ottoman-noir"];
const ROUTES = ["/", "/tours", "/tours/tour-cappadocia-tuff"];

async function setSsrConceptPreset(conceptId, prisma) {
  const themeConfig = CONCEPT_CONFIGS[conceptId];
  const currentSettings = await prisma.siteSettings.findFirst();
  const currentVal =
    currentSettings?.value && typeof currentSettings.value === "object"
      ? currentSettings.value
      : {};
  const nextVal = {
    ...currentVal,
    theme_config: themeConfig,
  };

  if (currentSettings) {
    await prisma.siteSettings.update({
      where: { id: currentSettings.id },
      data: { value: nextVal },
    });
  } else {
    await prisma.siteSettings.create({
      data: { key: "default", value: nextVal },
    });
  }

  await fetch(`${BASE_URL}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-revalidate-secret":
        process.env.REVALIDATE_SECRET || "nst-internal-revalidate-secret",
    },
    body: JSON.stringify({
      tags: ["site-settings"],
      paths: ["/", "/tours", "/tours/tour-cappadocia-tuff"],
    }),
  });

  // Warm up ISR routes after revalidateTag("site-settings")
  for (const r of ROUTES) {
    await fetch(`${BASE_URL}${r}`);
  }
}

async function run() {
  const { PrismaClient } = await import(
    "../../backend/node_modules/@prisma/client/index.js"
  );
  const prisma = new PrismaClient();
  const results = [];

  console.log("=================================================================");
  console.log(
    "FAZ 8.5 LIGHTHOUSE MOBILE CLI AUDIT PER CONCEPT (SIMULATED 4G + 4x CPU)"
  );
  console.log("=================================================================\n");

  try {
    for (const concept of CONCEPTS) {
      await setSsrConceptPreset(concept, prisma);

      for (const route of ROUTES) {
        const url = `${BASE_URL}${route}`;
        const outFile = path.resolve(
          __dirname,
          `../.lh-faz85-${concept}-${route.replace(/[^a-z0-9]/gi, "_") || "home"}.json`
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

        const perf = Math.round(
          (report.categories.performance?.score || 0) * 100
        );
        const a11y = Math.round(
          (report.categories.accessibility?.score || 0) * 100
        );
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
          (report.audits["cumulative-layout-shift"]?.numericValue || 0).toFixed(
            4
          )
        );
        const fcpMs = Math.round(
          report.audits["first-contentful-paint"]?.numericValue || 0
        );

        const row = {
          concept,
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
          `[LH Mobile] ${concept.padEnd(16)} | ${route.padEnd(28)} | Perf: ${perf} | A11y: ${a11y} | BP: ${bp} | SEO: ${seo} | LCP: ${lcpMs}ms | TBT: ${tbtMs}ms | CLS: ${clsVal}`
        );
      }
    }
  } finally {
    await setSsrConceptPreset("atlas-editorial", prisma);
    await prisma.$disconnect();
  }

  console.log("\nJSON SUMMARY:");
  console.log(JSON.stringify(results, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
