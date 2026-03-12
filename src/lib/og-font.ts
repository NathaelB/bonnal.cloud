/**
 * Fetches Inter font files from Bunny CDN (already used by the site) and
 * caches them in memory for the duration of the build.
 *
 * librsvg (used by sharp) supports @font-face with base64 WOFF data URIs,
 * which avoids any dependency on fonts installed on the build/deploy server.
 */
const cache = new Map<string, string>();

async function fetchBase64(weight: 400 | 700 | 800): Promise<string> {
  const key = String(weight);
  if (cache.has(key)) return cache.get(key)!;

  const url = `https://fonts.bunny.net/inter/files/inter-latin-${weight}-normal.woff`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Inter ${weight}: ${res.status}`);

  const b64 = Buffer.from(await res.arrayBuffer()).toString("base64");
  cache.set(key, b64);
  return b64;
}

export async function ogFontStyle(): Promise<string> {
  const [regular, bold] = await Promise.all([
    fetchBase64(400),
    fetchBase64(800),
  ]);

  return `
    @font-face {
      font-family: 'Inter';
      font-weight: 400;
      src: url('data:font/woff;base64,${regular}') format('woff');
    }
    @font-face {
      font-family: 'Inter';
      font-weight: 800;
      src: url('data:font/woff;base64,${bold}') format('woff');
    }
  `;
}
