import type { APIRoute } from "astro";
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";

export const prerender = true;

const font = (p: string) =>
  fs.readFileSync(path.join(process.cwd(), "src/assets/fonts", p));

export const GET: APIRoute = async () => {
  const markup = html(`
    <div style="display:flex;width:1200px;height:630px;background:linear-gradient(135deg,#b96747 0%,#7d4038 35%,#17483d 72%,#082b27 100%);font-family:Inter;position:relative;overflow:hidden;">
      <div style="display:flex;position:absolute;width:330px;height:330px;border-radius:9999px;background:#f0d59d;right:128px;top:70px;opacity:.72;"></div>
      <div style="display:flex;position:absolute;width:850px;height:300px;background:#15483e;right:-120px;bottom:0;clip-path:polygon(0 100%,14% 47%,29% 65%,45% 27%,60% 59%,77% 37%,100% 18%,100% 100%);"></div>
      <div style="display:flex;position:absolute;left:52px;right:52px;top:45px;border-top:1px solid rgba(255,255,255,.45);"></div>
      <div style="display:flex;position:absolute;left:52px;right:52px;bottom:45px;border-top:1px solid rgba(255,255,255,.3);"></div>
      <div style="display:flex;flex-direction:column;justify-content:center;width:100%;height:100%;padding:70px 70px 80px;">
        <div style="display:flex;font-family:Inter;font-weight:700;font-size:18px;letter-spacing:7px;color:#f5e7c6;">SEVEN DAYS · JAMAICA 2027</div>
        <div style="display:flex;flex-direction:column;font-family:Playfair;font-weight:700;font-size:104px;line-height:.84;letter-spacing:-5px;color:#ffffff;margin-top:35px;">
          <span style="display:flex;">Janet's</span>
          <span style="display:flex;color:#f5e7c6;margin-left:90px;">island week.</span>
        </div>
        <div style="display:flex;font-family:Inter;font-weight:400;font-size:22px;color:rgba(255,255,255,.72);margin-top:38px;">MAY 24–30 · A SAMPLE CELEBRATION ON ISLAND TIME</div>
      </div>
    </div>
  `.trim());

  // satori-html's VNode is the runtime shape Satori accepts, but the packages
  // currently publish incompatible TypeScript declarations for that shape.
  // @ts-expect-error Runtime-compatible VNode from satori-html.
  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: font("Inter-Regular.ttf"), weight: 400, style: "normal" },
      { name: "Inter", data: font("Inter-Bold.ttf"), weight: 700, style: "normal" },
      { name: "Playfair", data: font("PlayfairDisplay-Bold.ttf"), weight: 700, style: "normal" },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } })
    .render()
    .asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
