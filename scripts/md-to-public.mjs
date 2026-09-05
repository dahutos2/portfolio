// @ts-check
import fs from "node:fs/promises";
import path from "node:path";
import { globby } from "globby";
import { marked } from "marked";
import puppeteer from "puppeteer";

const root = process.cwd();
const inDir = path.join(root, "content", "legal");
const outDir = path.join(root, "public", "legal");

// PDF/HTML 共通スタイル（HTML側でもそのまま適用されます）
const css = `
@page { size: A4; margin: 20mm; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic ProN", "Hiragino Sans",
    "Yu Gothic", YuGothic, Meiryo, "Noto Sans CJK JP", sans-serif;
  line-height: 1.8;
  color: #111827;
  font-size: 12.5pt;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}
h1 { font-size: 20pt; margin: 0 0 12px; break-after: avoid; }
h2 { font-size: 14pt; margin: 18px 0 8px; break-after: avoid; }
p, li { font-size: 12.5pt; }
hr { border: 0; border-top: 1px solid #e5e7eb; margin: 12px 0; }
`;

/**
 * @param {string} base
 */
function outPdfName(base) {
  return `${base}-ja.pdf`; // ja 固定
}

/**
 * @param {string} base
 */
function outHtmlName(base) {
  return `${base}-ja.html`; // ja 固定
}

/**
 * @param {string} markdown
 * @returns {string}
 */
function stripFrontMatter(markdown) {
  if (!markdown.startsWith("---\n")) return markdown;

  const end = markdown.indexOf("\n---\n", 4);
  if (end === -1) {
    throw new Error("Unclosed YAML front matter");
  }

  return markdown.slice(end + 5);
}

/**
 * @param {string} markdown
 */
async function renderHtml(markdown) {
  const content = await marked.parse(stripFrontMatter(markdown));
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${css}</style>
</head>
<body>
${content}
</body>
</html>
`;
}

async function main() {
  await fs.rm(outDir, { recursive: true, force: true });
  const files = await globby(["**/*.md"], { cwd: inDir, absolute: true });
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const mdPath of files) {
      const rel = path.relative(inDir, mdPath);
      const { dir, name } = path.parse(rel);
      const outProjectDir = path.join(outDir, dir);
      await fs.mkdir(outProjectDir, { recursive: true });

      const markdown = await fs.readFile(mdPath, "utf8");
      const html = await renderHtml(markdown);

      // ===== PDF 生成 =====
      const outPdfPath = path.join(outProjectDir, outPdfName(name));
      const page = await browser.newPage();
      try {
        await page.setContent(html, { waitUntil: "load" });
        await page.pdf({
          path: outPdfPath,
          format: "A4",
          printBackground: true,
          margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
        });
      } finally {
        await page.close();
      }

      console.log("generated PDF:", path.relative(root, outPdfPath));

      // ===== HTML 生成 =====
      const outHtmlPath = path.join(outProjectDir, outHtmlName(name));
      await fs.writeFile(outHtmlPath, html, "utf8");
      console.log("generated HTML:", path.relative(root, outHtmlPath));
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
