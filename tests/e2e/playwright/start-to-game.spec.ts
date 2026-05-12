import { test, expect } from '@playwright/test';

test('start screen advances to game without black screen', async ({ page }) => {
  await page.goto('/');

  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  await page.waitForTimeout(500);
  await page.keyboard.press('Space');

  await page.waitForFunction(() => {
    const canvasEl = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvasEl || canvasEl.width === 0 || canvasEl.height === 0) {
      return false;
    }

    const x = Math.floor(canvasEl.width / 2);
    const y = Math.floor(canvasEl.height / 2);

    const gl = canvasEl.getContext('webgl');
    if (gl) {
      const pixel = new Uint8Array(4);
      gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      return !(pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0);
    }

    const ctx2d = canvasEl.getContext('2d');
    if (!ctx2d) {
      return false;
    }

    const data = ctx2d.getImageData(x, y, 1, 1).data;
    return !(data[0] === 0 && data[1] === 0 && data[2] === 0);
  });
});
