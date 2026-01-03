import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDir = path.resolve(process.cwd(), "public");

function svgIcon({ size }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a855f7"/>
      <stop offset="1" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="url(#g)"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial, sans-serif" font-size="${Math.round(size * 0.55)}" font-weight="800" fill="#ffffff">Ξ</text>
</svg>`;
}

function svgSplash({ size }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1f2937"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a855f7"/>
      <stop offset="1" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${size}" height="${size}" fill="url(#bg)"/>
  <rect x="${Math.round(size * 0.25)}" y="${Math.round(size * 0.25)}" width="${Math.round(size * 0.5)}" height="${Math.round(size * 0.5)}" rx="${Math.round(size * 0.12)}" fill="url(#g)"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial, sans-serif" font-size="${Math.round(size * 0.3)}" font-weight="800" fill="#ffffff">Ξ</text>
</svg>`;
}

function svgHero({ width, height, title, subtitle }) {
  const logoSize = Math.round(Math.min(width, height) * 0.28);
  const logoX = Math.round((width - logoSize) / 2);
  const logoY = Math.round(height * 0.18);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1f2937"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a855f7"/>
      <stop offset="1" stop-color="#ec4899"/>
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#bg)"/>

  <rect x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" rx="${Math.round(logoSize * 0.2)}" fill="url(#g)"/>
  <text x="50%" y="${logoY + Math.round(logoSize * 0.57)}" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial, sans-serif" font-size="${Math.round(logoSize * 0.62)}" font-weight="800" fill="#ffffff">Ξ</text>

  <text x="50%" y="${Math.round(height * 0.62)}" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial, sans-serif" font-size="${Math.round(height * 0.09)}" font-weight="800" fill="#ffffff">${title}</text>

  <text x="50%" y="${Math.round(height * 0.72)}" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, Arial, sans-serif" font-size="${Math.round(height * 0.045)}" font-weight="500" fill="#a855f7">${subtitle}</text>
</svg>`;
}

async function writePng(filename, svg, width, height) {
  const outPath = path.join(publicDir, filename);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  const buffer = await sharp(Buffer.from(svg))
    .png({ quality: 90 })
    .resize(width, height)
    .toBuffer();
  await fs.writeFile(outPath, buffer);
  return outPath;
}

async function main() {
  const outputs = [];

  outputs.push(await writePng("icon.png", svgIcon({ size: 200 }), 200, 200));
  outputs.push(await writePng("splash.png", svgSplash({ size: 200 }), 200, 200));
  outputs.push(
    await writePng(
      "miniapp-image.png",
      svgHero({ width: 1200, height: 800, title: "TipStream Pro", subtitle: "Tip creators on Base" }),
      1200,
      800
    )
  );
  outputs.push(
    await writePng(
      "og-image.png",
      svgHero({ width: 1200, height: 630, title: "TipStream Pro", subtitle: "Micro-tipping for Farcaster creators" }),
      1200,
      630
    )
  );

  // Also write a 3:2 cover if you want to reference it elsewhere
  outputs.push(
    await writePng(
      "cover.png",
      svgHero({ width: 900, height: 600, title: "TipStream Pro", subtitle: "Tip creators on Base" }),
      900,
      600
    )
  );

  console.log("Generated:");
  for (const file of outputs) console.log("-", file);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
