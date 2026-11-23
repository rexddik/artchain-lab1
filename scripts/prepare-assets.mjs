import { cp, mkdir, access } from "node:fs/promises";

try {
  await access(new URL("../images", import.meta.url));
  await mkdir(new URL("../public", import.meta.url), { recursive: true });
  await cp(new URL("../images", import.meta.url), new URL("../public/images", import.meta.url), { recursive: true });
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  console.warn("Папка images не найдена. Скопируйте её из своего проекта ArtChain: она нужна для изображений NFT.");
}
