const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const out = path.resolve('test-results/tirada-1');
  await fs.mkdir(out, { recursive: true });
  const category = { id: '2196c12a-3e6a-42b1-b137-770837530f46', name: 'Kits y Ceremonias', slug: 'kits-y-ceremonias', is_active: true };
  const extraCategory = { id: 'new-category', name: 'Categoría nueva', slug: 'categoria-nueva', is_active: true };
  const product = {
    id: '00000000-0000-0000-0000-000000000001', slug: 'producto-prueba', name: 'Alkimya de prueba',
    description: 'Descripción de prueba', short_description: 'Cuidado botánico', info_frontal: 'Jojoba & Neroli • Piel con Manchas o Grasa',
    price: 13000, compare_at_price: 0, currency: 'ARS', inventory_quantity: 10,
    featured_image: '/images/placeholder-product.jpg', categories: category, category_id: category.id,
    product_variants: [], certifications: [], skin_type: [], benefits: [], ingredients: [],
    averageRating: 4, reviewCount: 2, installments_3_enabled: true, installments_6_enabled: false,
    discount_transfer_percent: 0, discount_cash_percent: 0,
  };
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      let enabled = true;
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', async route => {
        const req = route.request();
        if (!['GET', 'HEAD'].includes(req.method())) return route.abort();
        const url = new URL(req.url());
        if (url.pathname === '/api/public/config') return route.fulfill({ json: { configs: { reviews_enabled: enabled } } });
        if (url.pathname === '/api/categories') return route.fulfill({ json: { categories: [category, extraCategory] } });
        if (url.pathname.startsWith('/api/categories/by-slug/')) return route.fulfill({ json: { category } });
        if (url.pathname === '/api/products/by-slug/producto-prueba') return route.fulfill({ json: { product } });
        if (url.pathname === '/api/products') return route.fulfill({ json: { products: [product], pagination: { page: 1, limit: 9, total: 1, totalPages: 1, hasMore: false } } });
        if (url.pathname.includes('/reviews')) return route.fulfill({ json: { reviews: [], pagination: { page: 1, totalPages: 1 }, summary: { averageRating: 4, totalReviews: 2, ratingDistribution: {} } } });
        return route.continue();
      });
      await page.goto('http://127.0.0.1:3110/tienda', { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(out, `initial-${width}.png`), fullPage: true });
      await expect(page.locator('html')).toHaveAttribute('lang', 'es-AR');
      await expect(page.locator('footer').getByRole('link', { name: extraCategory.name, exact: true })).toHaveAttribute('href', '/categorias/categoria-nueva');
      if (width > 600) {
        const filterRequest = page.waitForRequest(request => new URL(request.url()).searchParams.get('category') === extraCategory.id);
        await page.getByRole('button', { name: extraCategory.name, exact: true }).click();
        await filterRequest;
      }
      const view = page.getByRole('link', { name: width > 600 ? 'VER ALKIMYA' : 'VER', exact: true }).locator('visible=true').first();
      const add = page.getByRole('button', { name: 'AÑADIR', exact: true }).locator('visible=true').first();
      await expect(view).toHaveAttribute('href', '/productos/producto-prueba');
      await expect(page.getByText(product.info_frontal, { exact: true }).locator('visible=true').first()).toBeVisible();
      await view.scrollIntoViewIfNeeded();
      for (const button of [view, add]) {
        const box = await button.boundingBox();
        assert(box && box.x >= 0 && box.x + box.width <= width, 'Card buttons must fit viewport');
      }
      assert.equal(await add.evaluate(el => getComputedStyle(el).backgroundImage), 'none');
      assert.equal(await view.evaluate(el => getComputedStyle(el).borderTopWidth), '1px');
      assert.equal(await view.evaluate(el => getComputedStyle(el).borderTopColor), 'rgb(125, 29, 43)');
      assert.equal(await view.evaluate(el => getComputedStyle(el).height), '44px');
      assert.equal(await add.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(125, 29, 43)');
      await page.screenshot({ path: path.join(out, `catalog-${width}.png`) });
      await add.click();
      await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('daluz-cart') || '[]')[0]?.quantity)).toBe(1);
      await page.goto('http://127.0.0.1:3110/categorias/linea-kits-y-experiencia', { waitUntil: 'networkidle' });
      await expect(page).toHaveURL(/\/categorias\/kits-y-ceremonias$/);
      await expect(page.getByRole('heading', { name: category.name, exact: true })).toBeVisible();
      await page.goto('http://127.0.0.1:3110/productos/producto-prueba', { waitUntil: 'networkidle' });
      const reviewTab = page.getByRole('tab', { name: 'Reseñas', exact: true }).locator('visible=true');
      await expect(reviewTab).toBeVisible();
      await expect(page.getByText(/Hasta 12 cuotas/)).toHaveCount(0);
      await expect(page.getByText(/3 cuotas sin interés de/).first()).toBeVisible();
      const orphanZeros = await page.locator('main').evaluate(main => {
        const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
        const found = [];
        while (walker.nextNode()) if (walker.currentNode.textContent.trim() === '0' && walker.currentNode.parentElement.getClientRects().length) found.push(walker.currentNode.parentElement.outerHTML);
        return found;
      });
      assert.deepEqual(orphanZeros, []);
      await page.screenshot({ path: path.join(out, `detail-on-${width}.png`) });
      await reviewTab.click();
      enabled = false;
      await page.evaluate(() => window.dispatchEvent(new Event('focus')));
      await expect(page.getByRole('tab', { name: 'Reseñas', exact: true })).toHaveCount(0);
      await expect(page.getByText('(2 reseñas)')).toHaveCount(0);
      await expect(page.getByRole('tabpanel').locator('visible=true')).toContainText(product.description);
      await page.screenshot({ path: path.join(out, `detail-off-${width}.png`) });
      assert.deepEqual(errors, []);
      console.log(`Tirada 1 verified at ${width}px: cart +1, buttons, info frontal, legacy category, reviews ON/OFF, no orphan zero, 3 installments.`);
      await page.close();
    }
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
