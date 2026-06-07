import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join } from "node:path";

export const root = new URL("../", import.meta.url);

export async function readText(path) {
  return readFile(new URL(path, root), "utf8");
}

export function hasAll(text, values) {
  return values.filter((value) => !text.includes(value));
}

export async function withStaticServer(callback) {
  const prototypeRoot = new URL("../prototype/", import.meta.url);
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://127.0.0.1");
      const relativePath = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
      const fileUrl = new URL(relativePath, prototypeRoot);
      const body = await readFile(fileUrl);
      const extension = extname(fileUrl.pathname);
      const contentType = extension === ".html"
        ? "text/html"
        : extension === ".css"
          ? "text/css"
          : extension === ".js"
            ? "text/javascript"
            : "application/octet-stream";

      response.writeHead(200, { "content-type": contentType });
      response.end(body);
    } catch {
      response.writeHead(404, { "content-type": "text/plain" });
      response.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  try {
    return await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

