import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import sharp from "sharp";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

type Props = { post: CollectionEntry<"blog"> };

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Rough text wrap based on approximate char widths at a given font size. */
function wrapText(text: string, maxWidth: number, fontSize: number, bold = false): string[] {
  const charWidth = fontSize * (bold ? 0.58 : 0.52);
  const charsPerLine = Math.floor(maxWidth / charWidth);
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > charsPerLine && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as Props;
  const { title, description } = post.data;

  const W = 1200;
  const H = 630;
  const PAD_X = 80;
  const usableWidth = W - PAD_X * 2;

  const titleLines = wrapText(title, usableWidth, 56, true).slice(0, 2);
  const descLines = wrapText(description, usableWidth, 24, false).slice(0, 3);

  const titleFontSize = 56;
  const titleLineHeight = 72;
  const descFontSize = 24;
  const descLineHeight = 38;

  const titleStartY = 200;
  const descStartY = titleStartY + titleLines.length * titleLineHeight + 36;

  const accentBarHeight = titleLines.length * titleLineHeight - 8;

  const titleSvg = titleLines
    .map(
      (line, i) =>
        `<text x="${PAD_X + 20}" y="${titleStartY + i * titleLineHeight}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="${titleFontSize}" font-weight="800" fill="#0f0f0e">${escapeXml(line)}</text>`
    )
    .join("\n  ");

  const descSvg = descLines
    .map(
      (line, i) =>
        `<text x="${PAD_X + 20}" y="${descStartY + i * descLineHeight}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="${descFontSize}" font-weight="400" fill="#4a4a47">${escapeXml(line)}</text>`
    )
    .join("\n  ");

  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#f7f6f3"/>

  <!-- Decorative blobs -->
  <circle cx="1100" cy="80" r="220" fill="#1a56db" opacity="0.05"/>
  <circle cx="1180" cy="${H - 60}" r="120" fill="#1a56db" opacity="0.04"/>
  <circle cx="60" cy="${H - 40}" r="80" fill="#1a56db" opacity="0.03"/>

  <!-- Bottom border line -->
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="#1a56db" opacity="0.15"/>

  <!-- Left accent bar -->
  <rect x="${PAD_X}" y="${titleStartY - titleFontSize + 10}" width="4" height="${accentBarHeight}" rx="2" fill="#1a56db"/>

  <!-- Title -->
  ${titleSvg}

  <!-- Description -->
  ${descSvg}

  <!-- Author / domain -->
  <text x="${PAD_X + 20}" y="${H - 36}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="17" font-weight="500" fill="#8a8a85">bonnal.cloud — Nathael Bonnal</text>
</svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
