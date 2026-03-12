import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import { ogFonts } from "@lib/og-font";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

type Props = { post: CollectionEntry<"blog"> };
type Node = Parameters<typeof satori>[0];

const flex = (style: Record<string, unknown>, children: Node | Node[]): Node => ({
  type: "div",
  props: { style: { display: "flex", ...style }, children },
});

const text = (content: string, style: Record<string, unknown>): Node => ({
  type: "div",
  props: { style: { display: "flex", fontFamily: "Inter", ...style }, children: content },
});

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as Props;
  const { title, description } = post.data;

  const fonts = await ogFonts();

  const svg = await satori(
    flex(
      { flexDirection: "column", width: "100%", height: "100%", backgroundColor: "#f7f6f3", position: "relative", overflow: "hidden" },
      [
        // Blobs
        { type: "div", props: { style: { display: "flex", position: "absolute", top: -100, right: -60, width: 440, height: 440, borderRadius: "50%", backgroundColor: "#1a56db", opacity: 0.05 }, children: [] } },
        { type: "div", props: { style: { display: "flex", position: "absolute", bottom: -60, right: -40, width: 240, height: 240, borderRadius: "50%", backgroundColor: "#1a56db", opacity: 0.04 }, children: [] } },
        // Bottom accent line
        { type: "div", props: { style: { display: "flex", position: "absolute", bottom: 0, left: 0, right: 0, height: 4, backgroundColor: "#1a56db", opacity: 0.15 }, children: [] } },
        // Main content
        flex({ flexDirection: "row", flex: 1, padding: "80px 80px 60px" }, [
          // Accent bar
          { type: "div", props: { style: { display: "flex", width: 4, borderRadius: 2, backgroundColor: "#1a56db", marginRight: 24, marginTop: 6, flexShrink: 0 }, children: [] } },
          // Text column
          flex({ flexDirection: "column", flex: 1 }, [
            text(title, { fontSize: 56, fontWeight: 800, color: "#0f0f0e", lineHeight: 1.15, marginBottom: 24 }),
            text(description, { fontSize: 24, fontWeight: 400, color: "#4a4a47", lineHeight: 1.5, flex: 1 }),
            text("bonnal.cloud — Nathael Bonnal", { fontSize: 17, fontWeight: 400, color: "#8a8a85" }),
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
