import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import "./prepare-assets.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const children = [];
let stopping = false;
const stop = (code = 0) => {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  process.exitCode = code;
};
for (const args of [["server.cjs"], ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1"]]) {
  const child = spawn(process.execPath, args, { cwd: root, stdio: "inherit" });
  children.push(child);
  child.on("error", (error) => { console.error(error.message); stop(1); });
  child.on("exit", (code) => { if (!stopping) stop(code || 0); });
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
