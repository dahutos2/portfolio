import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
const address = server.httpServer.address();
const base = `http://127.0.0.1:${address.port}/portfolio/`;
let browser;
const screenshotDir = process.env.SITE_SCREENSHOT_DIR;
async function clickVisible(button) {
  // Settle test setup before clicking; the page enables smooth scrolling.
  await button.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'center' }));
  await button.click();
}
try {
  if (screenshotDir) await fs.mkdir(screenshotDir, { recursive: true });
  browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  const dataRequests = [];
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.href.startsWith(base) && url.pathname.includes('/data/')) dataRequests.push(url);
  });
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  for (const width of [1280, 390]) {
    for (const colorScheme of ['light', 'dark']) {
      await page.setViewport({ width, height: 900 });
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: colorScheme }]);
      await page.goto(base, { waitUntil: 'networkidle0' });
      const user = JSON.parse(await fs.readFile('dist/data/user.json', 'utf8'));
      assert.ok((await page.$eval('h1', element => element.textContent)).includes(user.name));
      assert.ok(await page.$('a[href^="https://github.com/"]'));
      const layout = await page.evaluate(() => ({
        width: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflowing: [...document.querySelectorAll('body *')]
          .filter(element => element.getBoundingClientRect().right > window.innerWidth + 1)
          .slice(0, 8).map(element => ({ tag: element.tagName, text: element.textContent?.trim().slice(0, 80) })),
      }));
      assert.ok(layout.scrollWidth <= layout.width, `horizontal overflow: ${JSON.stringify(layout)}`);
      if (screenshotDir) {
        await page.screenshot({ path: path.join(screenshotDir, `site-${width}-${colorScheme}.png`), fullPage: true });
      }
      if (width === 390) {
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Toggle main menu');
        await page.keyboard.press('Enter');
        await page.waitForSelector('#mobile-nav', { visible: true });
        await page.waitForFunction(() => getComputedStyle(document.querySelector('#mobile-nav')).opacity === '1');
        assert.equal(await page.$eval('button[aria-controls="mobile-nav"]', element => element.getAttribute('aria-expanded')), 'true');
        if (screenshotDir) {
          await page.screenshot({ path: path.join(screenshotDir, `menu-${colorScheme}.png`) });
        }
        await page.click('#mobile-nav a[href="#services"]');
        await page.waitForSelector('#mobile-nav', { hidden: true });
        assert.equal(new URL(page.url()).hash, '#services');
      }
      for (const [section, items, file] of [
        ['services', 'article', 'services'], ['projects', 'article', 'repos'],
        ['skills', '.mb-4', 'coding'], ['career', 'ol > li', 'career'],
      ]) {
        const selector = `#${section} button.btn-outline`;
        const button = await page.$(selector);
        const data = JSON.parse(await fs.readFile(`dist/data/${file}.json`, 'utf8'));
        const total = Array.isArray(data) ? data.length : data.languages.length;
        const before = await page.$$eval(`#${section} ${items}`, elements => elements.length);
        assert.equal(Boolean(button), total > before, `${section} must offer expansion when items are hidden`);
        if (!button) continue;
        console.log(`Expand ${section}: ${width}px/${colorScheme}, ${before} items`);
        await clickVisible(button);
        await page.waitForFunction((section, items, total) =>
          document.querySelectorAll(`#${section} ${items}`).length === total, {}, section, items, total);
        assert.equal(await button.evaluate(element => element.textContent.trim()), '閉じる');
        await clickVisible(button);
        await page.waitForFunction((section, items, before) =>
          document.querySelectorAll(`#${section} ${items}`).length === before, {}, section, items, before);
      }
    }
  }
  if (process.env.GITHUB_RUN_ID) {
    assert.ok(dataRequests.length > 0, 'the page must load its data');
    for (const url of dataRequests) {
      assert.equal(url.searchParams.get('v'), `${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT ?? '1'}`,
        'each deployment must use its run ID to invalidate JSON caches, even at the same commit');
    }
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
  const emptyPage = await browser.newPage();
  emptyPage.on('pageerror', error => errors.push(error.message));
  await emptyPage.setRequestInterception(true);
  emptyPage.on('request', request => {
    const url = new URL(request.url());
    if (url.href.startsWith(base) && /\/data\/(services|repos|career)\.json$/.test(url.pathname)) {
      void request.respond({ status: 200, contentType: 'application/json', body: '[]' });
    } else {
      void request.continue();
    }
  });
  await emptyPage.goto(base, { waitUntil: 'networkidle0' });
  for (const [section, text] of [
    ['services', '登録されたサービスはありません'],
    ['projects', 'プロジェクトがありません'],
    ['career', 'タイムラインがありません'],
  ]) {
    assert.ok((await emptyPage.$eval(`#${section}`, element => element.textContent)).includes(text));
  }
  await emptyPage.close();
  assert.deepEqual(errors, []);
  console.log('Site checks passed: desktop/mobile, light/dark, keyboard/mobile navigation, expansion/collapse, empty data, 7 JSON resources, legal HTML/PDF.');
} finally {
  await browser?.close();
  await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
}
