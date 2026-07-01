import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function loadPublicAssetDataUrl(publicPath: string, mime = "image/png") {
  const relative = publicPath.replace(/^\//, "");
  const data = await readFile(join(process.cwd(), "public", relative));
  return `data:${mime};base64,${data.toString("base64")}`;
}
