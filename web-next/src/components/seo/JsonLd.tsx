import React from "react";

/**
 * Safely serializes a JSON-LD object for embedding inside <script type="application/ld+json">.
 * Escapes `<`, `>`, `&`, `\u2028`, and `\u2029` into Unicode escape sequences so that
 * user- or admin-supplied fields (e.g. `</script><script>alert(1)</script>`) can never
 * break out of the script context or trigger HTML entity parsing issues.
 */
export function serializeJsonLdSafe(schema: Record<string, unknown>): string {
  return JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLdSafe(schema),
          }}
        />
      ))}
    </>
  );
}

export default JsonLd;
