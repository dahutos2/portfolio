// @ts-check
import fs from "node:fs/promises";
import path from "node:path";
import { globby } from "globby";
import { mdToPdf } from "md-to-pdf";

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
h1 { font-size: 20pt; margin: 0 0 12px; }
h2 { font-size: 14pt; margin: 18px 0 8px; }
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

async function main() {
  const files = await globby(["**/*.md"], { cwd: inDir, absolute: true });

  for (const mdPath of files) {
    const rel = path.relative(inDir, mdPath);
    const { dir, name } = path.parse(rel);
    const outProjectDir = path.join(outDir, dir);
    await fs.mkdir(outProjectDir, { recursive: true });

    // ===== PDF 生成 =====
    const outPdfPath = path.join(outProjectDir, outPdfName(name));
    const pdfResult = await mdToPdf(
      { path: mdPath },
      {
        dest: outPdfPath,
        pdf_options: {
          format: "A4",
          printBackground: true,
          margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
        },
        css,
        launch_options: {
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      }
    );
    if (!pdfResult) throw new Error(`Failed to render PDF: ${mdPath}`);
    console.log("generated PDF:", path.relative(root, outPdfPath));

    // ===== HTML 生成 =====
    const outHtmlPath = path.join(outProjectDir, outHtmlName(name));
    const htmlResult = await mdToPdf(
      { path: mdPath },
      {
        as_html: true, // ← これで HTML を生成
        css,
        launch_options: {
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        },
      }
    );
    if (!htmlResult || typeof htmlResult.content !== "string") {
      throw new Error(`Failed to render HTML: ${mdPath}`);
    }

    // md-to-pdf の as_html は <html> を含むフルHTMLを返します。
    // 必要に応じてメタや言語属性を補強したい場合は下の置換で追記できます。
    let html = htmlResult.content;

    // 例：lang と簡易 meta を足す（既に入っていれば二重追加されないよう軽めの置換）
    if (!/<!DOCTYPE html>/i.test(html)) {
      html = `<!DOCTYPE html>\n${html}`;
    }
    if (!/<html[^>]*lang=/.test(html)) {
      html = html.replace(/<html(.*?)>/i, `<html$1 lang="ja">`);
    }
    if (!/<meta charset=/i.test(html)) {
      html = html.replace(/<head>/i, `<head><meta charset="utf-8">`);
    }
    if (!/<meta name="viewport"/i.test(html)) {
      html = html.replace(
        /<head>/i,
        `<head><meta name="viewport" content="width=device-width, initial-scale=1">`
      );
    }

    await fs.writeFile(outHtmlPath, html, "utf8");
    console.log("generated HTML:", path.relative(root, outHtmlPath));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
