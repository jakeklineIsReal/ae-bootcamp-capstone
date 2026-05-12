import { test, expect } from '@playwright/test';

test('start screen advances to game without black screen', async ({ page }) => {
  await page.goto('./');

  await page.setViewportSize({ width: 1440, height: 900 });

  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  await page.waitForTimeout(500);
  await page.keyboard.press('Space');

  await page.waitForFunction(() => {
    return document.documentElement.getAttribute('data-scene') === 'GameScene';
  });

  await page.waitForTimeout(2000);

  await page.waitForFunction(() => {
    const canvasEl = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvasEl || canvasEl.width === 0 || canvasEl.height === 0) {
      return false;
    }

    const isNonBlack = (pixel: Uint8Array | Uint8ClampedArray) => {
      return pixel[0] > 5 || pixel[1] > 5 || pixel[2] > 5;
    };

    const centerSamples: Array<[number, number]> = [
      [0.4, 0.4],
      [0.5, 0.4],
      [0.6, 0.4],
      [0.4, 0.5],
      [0.5, 0.5],
      [0.6, 0.5],
      [0.4, 0.6],
      [0.5, 0.6],
      [0.6, 0.6],
    ];

    const gridSamples: Array<[number, number]> = [];
    for (let i = 1; i <= 7; i += 1) {
      for (let j = 1; j <= 7; j += 1) {
        gridSamples.push([i / 8, j / 8]);
      }
    }

    const gl = canvasEl.getContext('webgl');
    if (gl) {
      let centerNonBlack = 0;
      let brightnessTotal = 0;
      const pixel = new Uint8Array(4);

      for (const [nx, ny] of centerSamples) {
        const x = Math.floor(canvasEl.width * nx);
        const y = Math.floor(canvasEl.height * ny);
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        if (isNonBlack(pixel)) {
          centerNonBlack += 1;
        }
      }

      for (const [nx, ny] of gridSamples) {
        const x = Math.floor(canvasEl.width * nx);
        const y = Math.floor(canvasEl.height * ny);
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        brightnessTotal += (pixel[0] + pixel[1] + pixel[2]) / 3;
      }

      const avgBrightness = brightnessTotal / gridSamples.length;
      return centerNonBlack >= 5 && avgBrightness > 15;
    }

    const ctx2d = canvasEl.getContext('2d');
    if (!ctx2d) {
      return false;
    }

    let centerNonBlack = 0;
    let brightnessTotal = 0;

    for (const [nx, ny] of centerSamples) {
      const x = Math.floor(canvasEl.width * nx);
      const y = Math.floor(canvasEl.height * ny);
      const data = ctx2d.getImageData(x, y, 1, 1).data;
      if (isNonBlack(data)) {
        centerNonBlack += 1;
      }
    }

    for (const [nx, ny] of gridSamples) {
      const x = Math.floor(canvasEl.width * nx);
      const y = Math.floor(canvasEl.height * ny);
      const data = ctx2d.getImageData(x, y, 1, 1).data;
      brightnessTotal += (data[0] + data[1] + data[2]) / 3;
    }

    const avgBrightness = brightnessTotal / gridSamples.length;
    return centerNonBlack >= 5 && avgBrightness > 15;
  });

  const screenshot = await page.screenshot({ fullPage: true });
  await test.info().attach('post-transition', {
    body: screenshot,
    contentType: 'image/png',
  });
});
