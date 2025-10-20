// @ts-check
import fs from "node:fs/promises";
import path from "node:path";
import { globby } from "globby";
import { mdToPdf } from "md-to-pdf";

const root = process.cwd();
const inDir = path.join(root, "content", "legal");
const outDir = path.join(root, "public", "legal");

// PDF 用スタイル
const css = `
@page { size: A4; margin: 20mm; }
body { font-family: -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", YuGothic, Meiryo, "Noto Sans CJK JP", sans-serif; line-height: 1.8; color: #111827; font-size: 12.5pt; }
h1 { font-size: 20pt; margin: 0 0 12px; }
h2 { font-size: 14pt; margin: 18px 0 8px; }
p, li { font-size: 12.5pt; }
hr { border: 0; border-top: 1px solid #e5e7eb; margin: 12px 0; }
`;

function outName(base) {
  return `${base}-ja.pdf`; // ja 固定
}

async function main() {
  const files = await globby(["**/*.md"], { cwd: inDir, absolute: true });
  for (const mdPath of files) {
    const rel = path.relative(inDir, mdPath);
    const { dir, name } = path.parse(rel);
    const outProjectDir = path.join(outDir, dir);
    await fs.mkdir(outProjectDir, { recursive: true });
    const outPath = path.join(outProjectDir, outName(name));

    const result = await mdToPdf(
      { path: mdPath },
      {
        dest: outPath,
        pdf_options: {
          format: "A4",
          printBackground: true,
          margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
        },
        css, // ← ここがポイント
      }
    );

    if (!result) throw new Error(`Failed to render PDF: ${mdPath}`);
    console.log("generated:", path.relative(root, outPath));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
