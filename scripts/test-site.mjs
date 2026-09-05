import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
const address = server.httpServer.address();
const base = `http://127.0.0.1:${address.port}/portfolio/`;
let browser;
try {
  browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  for (const width of [1280, 390]) {
    await page.setViewport({ width, height: 900 });
    await page.goto(base, { waitUntil: 'networkidle0' });
    const user = JSON.parse(await fs.readFile('dist/data/user.json', 'utf8'));
    assert.ok((await page.$eval('h1', element => element.textContent)).includes(user.name));
    assert.ok(await page.$('a[href^="https://github.com/"]'));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'horizontal overflow');
  }
  for (const file of ['user', 'repos', 'metrics', 'coding', 'career', 'services', 'testimonials']) {
    const response = await page.goto(`${base}data/${file}.json`);
    assert.equal(response.status(), 200);
    assert.deepEqual(await response.json(), JSON.parse(await fs.readFile(`dist/data/${file}.json`, 'utf8')));
  }
  for (const file of ['privacy', 'terms']) {
    await page.goto(`${base}legal/iishift/${file}-ja.html`);
    assert.ok((await page.$eval('h1', element => element.textContent)).trim());
    const response = await fetch(`${base}legal/iishift/${file}-ja.pdf`);
    assert.equal(response.status, 200);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
  }
  assert.deepEqual(errors, []);
  console.log('Site checks passed: desktop/mobile, 7 JSON resources, legal HTML/PDF.');
} finally {
  await browser?.close();
  await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
}
