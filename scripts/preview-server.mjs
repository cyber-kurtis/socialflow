import { createServer } from "node:http";
import { appendFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const port = Number(process.env.PORT || 3000);
const root = join(process.cwd(), "preview");
const logPath = join(process.cwd(), "preview-server.log");

function log(message) {
  appendFileSync(logPath, `[${new Date().toISOString()}] ${message}\n`);
}

log(`starting pid=${process.pid} cwd=${process.cwd()}`);

const server = createServer(async (request, response) => {
  const path = request.url === "/" ? "/index.html" : request.url || "/index.html";

  try {
    const file = await readFile(join(root, path.replace(/^\/+/, "")));
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end(file);
  } catch {
    const file = await readFile(join(root, "index.html"));
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    response.end(file);
  }
});

server.listen(port, "127.0.0.1", () => {
  log(`listening http://localhost:${port}`);
  console.log(`SocialFlow preview: http://localhost:${port}`);
});

server.on("error", (error) => {
  log(`server error: ${error instanceof Error ? error.stack : String(error)}`);
});

process.on("uncaughtException", (error) => {
  log(`uncaughtException: ${error instanceof Error ? error.stack : String(error)}`);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  log(`unhandledRejection: ${error instanceof Error ? error.stack : String(error)}`);
  process.exit(1);
});

process.on("beforeExit", (code) => {
  log(`beforeExit code=${code}`);
});
