/**
 * Fetches Inter font files from Bunny CDN and caches them for the build.
 * Returns ArrayBuffer for use with satori.
 */
const cache = new Map<string, ArrayBuffer>();

async function fetchFont(weight: 400 | 800): Promise<ArrayBuffer> {
  const key = String(weight);
  if (cache.has(key)) return cache.get(key)!;

  const url = `https://fonts.bunny.net/inter/files/inter-latin-${weight}-normal.woff`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch Inter ${weight}: ${res.status}`);

  const buf = await res.arrayBuffer();
  cache.set(key, buf);
  return buf;
}

export async function ogFonts() {
  const [regular, bold] = await Promise.all([fetchFont(400), fetchFont(800)]);
  return [
    { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: bold,    weight: 800 as const, style: "normal" as const },
  ];
}
