const { chromium } = require('@playwright/test');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const directory = path.resolve('test-results/catalog-info');
  await fs.mkdir(directory, { recursive: true });
  try {
    const product = {
      id: '00000000-0000-0000-0000-000000000001', slug: 'producto-prueba',
      name: 'Serum Facial Claridad', description: '', short_description: '',
      info_frontal: 'Jojoba & Neroli - Piel con Manchas o Grasa',
      price: 13000, currency: 'ARS', inventory_quantity: 10,
      featured_image: '/images/placeholder-product.jpg', categories: { name: 'Prueba', slug: 'prueba' },
      installments_3_enabled: true, installments_6_enabled: false,
      discount_transfer_percent: 10, discount_cash_percent: null,
    };
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      await page.route('**/api/products?*', route => route.fulfill({ json: {
        products: [product], pagination: { page: 1, limit: 9, total: 1, totalPages: 1, hasMore: false },
      } }));
      await page.route('**/api/categories*', route => route.fulfill({ json: { categories: [] } }));
      // Browser-side verification never submits forms or writes to any API.
      await page.route('**/*', async route => {
        if (!['GET', 'HEAD'].includes(route.request().method())) return route.abort();
        return route.fallback();
      });
      await page.goto('http://localhost:3104/tienda', { waitUntil: 'networkidle' });
      await page.getByText(product.info_frontal, { exact: true }).locator('visible=true').waitFor();
      const text = page.getByText(product.info_frontal, { exact: true }).locator('visible=true');
      await text.scrollIntoViewIfNeeded();
      const box = await text.boundingBox();
      assert(box && box.x >= 0 && box.x + box.width <= viewport.width);
      assert.equal(await page.title(), 'Tienda Alkimya Da Luz | Da Luz Consciente');
      assert((await page.locator('meta[property="og:image"]').getAttribute('content')).endsWith('/og-image.jpg'));
      assert((await page.locator('link[rel="canonical"]').getAttribute('href')).endsWith('/tienda'));
      await page.screenshot({ path: path.join(directory, `${viewport.width}.png`) });
      console.log(`Catalog + SEO verified: ${viewport.width}px`);
      await page.close();
    }
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
