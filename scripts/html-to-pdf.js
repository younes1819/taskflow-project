/**
 * Generates PDF from docs/ai/integratronic-frontend-architecture.html
 * Run from repo root: node scripts/html-to-pdf.js
 */
const path = require("path");
const fs = require("fs");
const { pathToFileURL } = require("url");

async function main() {
  let puppeteer;
  try {
    puppeteer = require("puppeteer");
  } catch {
    console.error(
      "Install Puppeteer first: npm install puppeteer --save-dev"
    );
    process.exit(1);
  }

  const root = path.join(__dirname, "..");
  const htmlPath = path.join(
    root,
    "docs",
    "ai",
    "integratronic-frontend-architecture.html"
  );
  const pdfPath = path.join(
    root,
    "docs",
    "ai",
    "integratronic-frontend-architecture.pdf"
  );

  if (!fs.existsSync(htmlPath)) {
    console.error("Missing:", htmlPath);
    process.exit(1);
  }

  const fileUrl = pathToFileURL(htmlPath).href;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 120000 });

    await page
      .waitForFunction(
        () => document.querySelectorAll(".mermaid svg").length >= 2,
        { timeout: 60000 }
      )
      .catch(() =>
        console.warn("Mermaid diagrams may still be rendering; continuing.")
      );

    await new Promise((r) => setTimeout(r, 500));

    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "18mm", bottom: "18mm", left: "14mm", right: "14mm" },
    });

    console.log("Wrote:", pdfPath);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
