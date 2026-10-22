import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const serverUrl = new URL("../dist/server/index.js", import.meta.url);
  serverUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: server } = await import(serverUrl.href);

  return server(new Request("http://localhost/"));
}

test("renders the public resume metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Python Developer/);
  assert.doesNotMatch(html, /Junior/i);
  assert.match(html, /egorfenin\.ru/);
  assert.doesNotMatch(html, /vinext-starter|Your site is taking shape/);
});

test("keeps the critical contacts and projects in the public page", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(page, /feninea@mail\.ru/);
  assert.match(page, /github\.com\/voityvaity/);
  assert.match(page, /kittygram_final/);
  assert.match(page, /voityvaity\/foodgram/);
  assert.match(page, /voityvaity\/taski-docker/);
  assert.match(page, /voityvaity\/tngimpact-final-defence-coach/);
  assert.match(page, /t\.me\/resgep/);
  assert.match(page, /TNGIMPACT AI Challenge 2026/);
  assert.match(page, /FastAPI/);
  assert.match(page, /egorfenin\.ru/);
  assert.doesNotMatch(page, /учиться на ошибках/);
});
