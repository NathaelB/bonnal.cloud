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

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as Props;
  const tags = post.data.tags.slice(0, 5);

  const W = 1200;
  const H = 280;
  const PAD_X = 80;

  // Build tag badges
  let tagX = PAD_X;
  const tagY = H / 2 - 18;
  const tagHeight = 36;
  const tagPadX = 20;
  const tagFontSize = 14;
  const tagGap = 10;

  const tagsSvg = tags
    .map((tag) => {
      const width = tag.length * tagFontSize * 0.58 + tagPadX * 2;
      const cx = tagX + width / 2;
      const svg = `
    <rect x="${tagX}" y="${tagY}" width="${width}" height="${tagHeight}" rx="6" fill="#e8e7e1" stroke="#d4d3cc" stroke-width="1"/>
    <text x="${cx}" y="${tagY + 23}" font-family="ui-monospace, monospace" font-size="${tagFontSize}" font-weight="500" fill="#4a4a47" text-anchor="middle">${escapeXml(tag)}</text>`;
      tagX += width + tagGap;
      return svg;
    })
    .join("\n");

  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#f7f6f3"/>

  <!-- Decorative blobs -->
  <circle cx="1100" cy="-60" r="220" fill="#1a56db" opacity="0.05"/>
  <circle cx="1180" cy="${H + 40}" r="120" fill="#1a56db" opacity="0.04"/>
  <circle cx="40" cy="${H + 20}" r="80" fill="#1a56db" opacity="0.03"/>

  <!-- Bottom border line -->
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="#1a56db" opacity="0.15"/>

  <!-- Tags -->
  ${tagsSvg}
</svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
