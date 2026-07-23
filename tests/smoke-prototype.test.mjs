import test from "node:test";
import assert from "node:assert/strict";
import { readText, withStaticServer } from "./helpers.mjs";

test("prototype JavaScript has valid syntax", async () => {
  const dataSource = await readText("prototype/app/data.js");
  const source = await readText("prototype/app/app.js");
  const landingSource = await readText("prototype/landing.js");
  const landingI18n = await readText("prototype/landing.i18n.js");
  assert.doesNotThrow(() => new Function(dataSource));
  assert.doesNotThrow(() => new Function(source));
  assert.doesNotThrow(() => new Function(landingI18n));
  assert.doesNotThrow(() => new Function(landingSource));
});

test("site serves the landing at root and the app under /app over HTTP", async () => {
  await withStaticServer(async (baseUrl) => {
    const landing = await fetch(`${baseUrl}/`);
    const landingCss = await fetch(`${baseUrl}/landing.css`);
    const app = await fetch(`${baseUrl}/app/index.html`);
    const css = await fetch(`${baseUrl}/app/styles.css`);
    const data = await fetch(`${baseUrl}/app/data.js`);
    const js = await fetch(`${baseUrl}/app/app.js`);

    assert.equal(landing.status, 200);
    assert.equal(landingCss.status, 200);
    assert.equal(app.status, 200);
    assert.equal(css.status, 200);
    assert.equal(data.status, 200);
    assert.equal(js.status, 200);

    const landingHtml = await landing.text();
    assert.match(landingHtml, /Foobow/);
    assert.match(landingHtml, /\/app\//);

    const html = await app.text();
    assert.match(html, /Foobow/);
    assert.match(html, /styles\.css/);
    assert.match(html, /data\.js/);
    assert.match(html, /app\.js/);
  });
});
