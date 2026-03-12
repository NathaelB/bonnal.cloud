import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";
import { ogFonts } from "@lib/og-font";

type Node = Parameters<typeof satori>[0];

const flex = (style: Record<string, unknown>, children: Node | Node[]): Node => ({
  type: "div",
  props: {
    style: { display: "flex", ...style },
    children,
  },
});

const text = (content: string, style: Record<string, unknown>): Node => ({
  type: "div",
  props: {
    style: { display: "flex", fontFamily: "Inter", ...style },
    children: content,
  },
});

const blob = (size: number, top?: number, bottom?: number, left?: number, right?: number): Node => ({
  type: "div",
  props: {
    style: {
      display: "flex",
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: "#1a56db",
      opacity: 0.05,
      ...(top !== undefined && { top }),
      ...(bottom !== undefined && { bottom }),
      ...(left !== undefined && { left }),
      ...(right !== undefined && { right }),
    },
    children: [],
  },
});

const badge = (label: string): Node =>
  text(label, {
    padding: "8px 16px",
    backgroundColor: "#e8e7e1",
    border: "1px solid #d4d3cc",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 400,
    color: "#4a4a47",
  });

export const GET: APIRoute = async () => {
  const fonts = await ogFonts();

  const svg = await satori(
    flex(
      { flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#f7f6f3", position: "relative", overflow: "hidden" },
      [
        blob(440, -100, undefined, undefined, -60),
        blob(240, undefined, -60, undefined, -40),
        // Bottom accent line
        { type: "div", props: { style: { display: "flex", position: "absolute", bottom: 0, left: 0, right: 0, height: 4, backgroundColor: "#1a56db", opacity: 0.15 }, children: [] } },
        // Main content
        flex({ flexDirection: "row", flex: 1, padding: "80px 80px 60px" }, [
          // Accent bar
          { type: "div", props: { style: { display: "flex", width: 4, borderRadius: 2, backgroundColor: "#1a56db", marginRight: 24, marginTop: 6, flexShrink: 0 }, children: [] } },
          // Text column
          flex({ flexDirection: "column", flex: 1 }, [
            text("Nathael Bonnal", { fontSize: 72, fontWeight: 800, color: "#0f0f0e", marginBottom: 16, lineHeight: 1.1 }),
            text("Software Engineer · Distributed Systems", { fontSize: 28, fontWeight: 400, color: "#1a56db", marginBottom: 20 }),
            text("Cloud-native architectures, open-source, identity systems at scale.", { fontSize: 22, fontWeight: 400, color: "#4a4a47", flex: 1 }),
            flex({ flexDirection: "row", gap: 10, marginBottom: 32 }, [
              badge("Kubernetes"),
              badge("Rust"),
              badge("IAM"),
              badge("OIDC"),
            ]),
            text("bonnal.cloud", { fontSize: 17, fontWeight: 400, color: "#8a8a85" }),
          ]),
        ]),
      ]
    ),
    { width: 1200, height: 630, fonts }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
