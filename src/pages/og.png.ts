import type { APIRoute } from "astro";
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";

export const prerender = true;

const font = (p: string) =>
  fs.readFileSync(path.join(process.cwd(), "src/assets/fonts", p));

// A gold, lucide-style plane emblem embedded as a data URI.
const planeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#f5d78a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" transform="rotate(-30 12 12)"/></svg>`;
const plane = `data:image/svg+xml;base64,${Buffer.from(planeSvg).toString("base64")}`;

export const GET: APIRoute = async () => {
  const markup = html(`
    <div style="display:flex;width:1200px;height:630px;background:linear-gradient(135deg,#14275a 0%,#0e1c44 55%,#0a1531 100%);font-family:Inter;position:relative;">
      <div style="display:flex;position:absolute;top:28px;left:28px;right:28px;bottom:28px;border:2px solid rgba(245,215,138,0.45);border-radius:28px;"></div>
      <div style="display:flex;position:absolute;top:44px;left:44px;right:44px;bottom:44px;border:1px solid rgba(245,215,138,0.22);border-radius:22px;"></div>
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;padding:64px;">
        <div style="display:flex;font-family:Playfair;font-weight:700;font-size:70px;letter-spacing:14px;color:#f5d78a;">PASSPORT</div>
        <div style="display:flex;align-items:center;justify-content:center;width:158px;height:158px;border-radius:9999px;border:3px solid rgba(245,215,138,0.5);margin:30px 0;background:rgba(245,215,138,0.04);">
          <img style="width:96px;height:96px;" src="${plane}" />
        </div>
        <div style="display:flex;font-family:Playfair;font-weight:700;font-size:34px;color:rgba(245,230,192,0.92);">United States of America</div>
        <div style="display:flex;width:140px;height:2px;background:rgba(245,215,138,0.4);margin:36px 0;"></div>
        <div style="display:flex;font-family:Playfair;font-weight:700;font-size:54px;color:#ffffff;">Janet's Journey</div>
        <div style="display:flex;font-family:Inter;font-weight:700;font-size:26px;letter-spacing:6px;color:#9fb4e0;margin-top:16px;">FIRST CLASS TO JAMAICA</div>
        <div style="display:flex;font-family:Inter;font-weight:400;font-size:22px;color:rgba(245,230,192,0.7);margin-top:12px;">ATL — MBJ · Montego Bay</div>
      </div>
    </div>
  `.trim());

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
