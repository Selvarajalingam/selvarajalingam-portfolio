import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { ImageResponse } from "next/og";
import { content } from "../src/lib/content";

const artwork = `data:image/svg+xml;base64,${readFileSync("public/assets/hero/fallback/sculpture.svg").toString("base64")}`;
const roles = content.profile.identity.split(" · ");
const response = new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", background: "#090909", color: "#f4f2ee", padding: "58px 64px", position: "relative", fontFamily: "sans-serif" }}>
  <div style={{ display: "flex", flexDirection: "column", width: "750px" }}>
    <div style={{ display: "flex", fontSize: 134, fontWeight: 700, letterSpacing: "-10px", lineHeight: 1, marginBottom: 32 }}>{content.profile.wordmark}</div>
    <div style={{ display: "flex", fontSize: 38, marginBottom: 18 }}>{content.profile.name}</div>
    <div style={{ display: "flex", flexDirection: "column", fontSize: 28, color: "#c0bdca", lineHeight: 1.5 }}><span>{roles[0]}</span><span>{roles.slice(1).join(" · ")}</span></div>
    <div style={{ display: "flex", fontSize: 25, color: "#a78bfa", marginTop: "auto" }}>{content.profile.tagline}</div>
  </div>
  {/* Original repository artwork is abstract decoration, not a product/portrait. */}
  {/* eslint-disable-next-line @next/next/no-img-element -- Static image-generation canvas, not a webpage. */}
  <img src={artwork} alt="" width={490} height={490} style={{ position: "absolute", right: 8, top: 70 }} />
</div>, { width: 1200, height: 630 });
mkdirSync("public/assets/brand/og", { recursive: true });
const png = Buffer.from(await response.arrayBuffer());
writeFileSync("public/assets/brand/og/portfolio.png", png);
console.log(`Original OG artwork written: 1200x630 PNG, ${png.byteLength} bytes`);
