/**
 * Regenerate favicon + app icons from public/brand/cliniqflow-logo.png.
 * Run: node scripts/generate-brand-icons.mjs
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const logoPath = "public/brand/cliniqflow-logo.png";
const meta = await sharp(logoPath).metadata();
const { width = 1024, height = 512 } = meta;

const cropSize = Math.round(height * 0.88);
const left = Math.round(width * 0.02);

await sharp(logoPath)
  .extract({
    left,
    top: Math.round((height - cropSize) / 2),
    width: cropSize,
    height: cropSize,
  })
  .png()
  .toFile("public/brand/cliniqflow-mark.png");

const mark = "public/brand/cliniqflow-mark.png";
const bg = { r: 255, g: 255, b: 255, alpha: 1 };

await sharp(mark).resize(32, 32, { fit: "contain", background: bg }).png().toFile("src/app/icon.png");
await sharp(mark)
  .resize(180, 180, { fit: "contain", background: bg })
  .png()
  .toFile("src/app/apple-icon.png");

const png16 = await sharp(mark).resize(16, 16, { fit: "contain", background: bg }).png().toBuffer();
const png32 = await sharp(mark).resize(32, 32, { fit: "contain", background: bg }).png().toBuffer();
const png48 = await sharp(mark).resize(48, 48, { fit: "contain", background: bg }).png().toBuffer();
const ico = await pngToIco([png16, png32, png48]);

await writeFile("src/app/favicon.ico", ico);
await writeFile("public/favicon.ico", ico);

console.log("Generated cliniqflow-mark.png, favicon.ico, icon.png, apple-icon.png");
