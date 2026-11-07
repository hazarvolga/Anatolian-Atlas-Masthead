#!/usr/bin/env node
/**
 * Automated OWASP XSS Payload Verification Suite for sanitizeHtml
 */

import sanitize from "sanitize-html";

const SANITIZE_OPTIONS = {
  allowedTags: [
    "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
    "strong", "b", "em", "i", "u", "s", "blockquote", "code", "pre",
    "br", "hr", "span", "div", "section", "article", "figure", "figcaption",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td", "a", "img",
    "sup", "sub", "small",
  ],
  disallowedTagsMode: "discard",
  allowedAttributes: {
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    "*": ["class", "id", "lang", "dir"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    img: ["http", "https"],
  },
  allowProtocolRelative: false,
};

const PAYLOADS = [
  {
    name: "01. Classic <script> injection",
    input: `<p>Welcome</p><script>alert('xss')</script>`,
    mustNotMatch: /<script|alert/i,
  },
  {
    name: "02. <img onerror> attribute injection",
    input: `<img src="https://images.unsplash.com/photo-1" onerror="alert(document.cookie)" alt="test">`,
    mustNotMatch: /onerror|alert/i,
  },
  {
    name: "03. javascript: URI in <a href>",
    input: `<a href="javascript:alert(1)">Click me</a>`,
    mustNotMatch: /javascript:/i,
  },
  {
    name: "04. Entity-obfuscated java&#x09;script: URI",
    input: `<a href="java&#x09;script:alert(1)">Obfuscated</a>`,
    mustNotMatch: /javascript|alert/i,
  },
  {
    name: "05. <svg onload> vector",
    input: `<svg onload="alert(1)"><circle cx="50" cy="50" r="40"/></svg>`,
    mustNotMatch: /<svg|onload|alert/i,
  },
  {
    name: "06. Malformed / unclosed <img src=x onerror=alert(1)//",
    input: `<div><img src=x onerror=alert(1)//<p>Safe paragraph</p></div>`,
    mustNotMatch: /onerror|alert/i,
  },
  {
    name: "07. Nested broken <<script> tag",
    input: `<<script>alert("xss");//<</script>`,
    mustNotMatch: /<script|alert\("xss"\)/i,
  },
  {
    name: "08. data:text/html base64 URI in <img> and <a>",
    input: `<img src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=="><a href="data:text/html,<script>alert(1)</script>">Link</a>`,
    mustNotMatch: /data:text\/html/i,
  },
  {
    name: "09. Inline style expression / CSS URL exfiltration",
    input: `<p style="background:url(javascript:alert(1))">Styled</p>`,
    mustNotMatch: /style=|javascript:/i,
  },
  {
    name: "10. Protocol-relative //evil.example/script.js",
    input: `<a href="//evil.example/phish">External</a><img src="//evil.example/tracker.png">`,
    mustNotMatch: /href="\/\/|src="\/\//i,
  },
];

let failed = 0;
console.log("=== OWASP XSS Sanitizer Verification Suite ===");
for (const test of PAYLOADS) {
  const output = sanitize(test.input, SANITIZE_OPTIONS);
  const leaked = test.mustNotMatch.test(output);
  if (leaked) {
    failed++;
    console.error(`✗ FAIL: ${test.name}\n  Input:  ${test.input}\n  Output: ${output}`);
  } else {
    console.log(`✓ PASS: ${test.name} -> ${JSON.stringify(output)}`);
  }
}

if (failed > 0) {
  process.exit(1);
}
console.log(`\nAll ${PAYLOADS.length}/${PAYLOADS.length} XSS payload vectors neutralized.`);
