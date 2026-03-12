import type { APIRoute } from "astro";
import sharp from "sharp";
import { ogFontStyle } from "@lib/og-font";

const W = 1200;
const H = 630;
const PAD_X = 80;

export const GET: APIRoute = async () => {
  const fontStyle = await ogFontStyle();

  const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><style>${fontStyle}</style></defs>

  <rect width="${W}" height="${H}" fill="#f7f6f3"/>
  <circle cx="1100" cy="80" r="220" fill="#1a56db" opacity="0.05"/>
  <circle cx="1180" cy="${H - 60}" r="120" fill="#1a56db" opacity="0.04"/>
  <circle cx="60" cy="${H - 40}" r="80" fill="#1a56db" opacity="0.03"/>
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="#1a56db" opacity="0.15"/>
  <rect x="${PAD_X}" y="160" width="4" height="130" rx="2" fill="#1a56db"/>

  <text x="${PAD_X + 20}" y="225" font-family="Inter, sans-serif" font-size="72" font-weight="800" fill="#0f0f0e">Nathael Bonnal</text>
  <text x="${PAD_X + 20}" y="277" font-family="Inter, sans-serif" font-size="28" font-weight="400" fill="#1a56db">Software Engineer · Distributed Systems</text>
  <text x="${PAD_X + 20}" y="345" font-family="Inter, sans-serif" font-size="22" font-weight="400" fill="#4a4a47">Cloud-native architectures, open-source, identity systems at scale.</text>

  <rect x="${PAD_X + 20}" y="400" width="130" height="36" rx="6" fill="#e8e7e1" stroke="#d4d3cc" stroke-width="1"/>
  <text x="${PAD_X + 85}" y="423" font-family="Inter, sans-serif" font-size="14" font-weight="400" fill="#4a4a47" text-anchor="middle">Kubernetes</text>

  <rect x="${PAD_X + 168}" y="400" width="80" height="36" rx="6" fill="#e8e7e1" stroke="#d4d3cc" stroke-width="1"/>
  <text x="${PAD_X + 208}" y="423" font-family="Inter, sans-serif" font-size="14" font-weight="400" fill="#4a4a47" text-anchor="middle">Rust</text>

  <rect x="${PAD_X + 266}" y="400" width="62" height="36" rx="6" fill="#e8e7e1" stroke="#d4d3cc" stroke-width="1"/>
  <text x="${PAD_X + 297}" y="423" font-family="Inter, sans-serif" font-size="14" font-weight="400" fill="#4a4a47" text-anchor="middle">IAM</text>

  <rect x="${PAD_X + 346}" y="400" width="80" height="36" rx="6" fill="#e8e7e1" stroke="#d4d3cc" stroke-width="1"/>
  <text x="${PAD_X + 386}" y="423" font-family="Inter, sans-serif" font-size="14" font-weight="400" fill="#4a4a47" text-anchor="middle">OIDC</text>

  <text x="${PAD_X + 20}" y="${H - 36}" font-family="Inter, sans-serif" font-size="17" font-weight="400" fill="#8a8a85">bonnal.cloud</text>
</svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
