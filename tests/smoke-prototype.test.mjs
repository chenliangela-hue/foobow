import test from "node:test";
import assert from "node:assert/strict";
import { readText, withStaticServer } from "./helpers.mjs";

test("prototype JavaScript has valid syntax", async () => {
  const source = await readText("prototype/app.js");
  assert.doesNotThrow(() => new Function(source));
});

test("prototype serves index, css, and js over HTTP", async () => {
  await withStaticServer(async (baseUrl) => {
    const index = await fetch(`${baseUrl}/`);
    const css = await fetch(`${baseUrl}/styles.css`);
    const js = await fetch(`${baseUrl}/app.js`);

    assert.equal(index.status, 200);
    assert.equal(css.status, 200);
    assert.equal(js.status, 200);

    const html = await index.text();
    assert.match(html, /Foobow/);
    assert.match(html, /styles\.css/);
    assert.match(html, /app\.js/);
  });
});

