import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

test.describe('Start to Game', () => {
  let consoleMessages: string[] = [];
  let pageErrors: string[] = [];
  let requestFailures: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleMessages = [];
    pageErrors = [];
    requestFailures = [];

    page.on('console', (msg) => {
      const location = msg.location();
      const locationText = location.url ? ` (${location.url}:${location.lineNumber})` : '';
      consoleMessages.push(`[${msg.type()}] ${msg.text()}${locationText}`);
    });

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    page.on('requestfailed', (request) => {
      requestFailures.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText ?? 'unknown'}`);
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    await fs.mkdir(testInfo.outputDir, { recursive: true });

    if (consoleMessages.length > 0) {
      const outputPath = path.join(testInfo.outputDir, 'console-messages.txt');
      await fs.writeFile(outputPath, consoleMessages.join('\n'), 'utf8');
      await testInfo.attach('console-messages', { path: outputPath, contentType: 'text/plain' });
    }

    if (pageErrors.length > 0) {
      const outputPath = path.join(testInfo.outputDir, 'page-errors.txt');
      await fs.writeFile(outputPath, pageErrors.join('\n'), 'utf8');
      await testInfo.attach('page-errors', { path: outputPath, contentType: 'text/plain' });
    }

    if (requestFailures.length > 0) {
      const outputPath = path.join(testInfo.outputDir, 'request-failures.txt');
      await fs.writeFile(outputPath, requestFailures.join('\n'), 'utf8');
      await testInfo.attach('request-failures', { path: outputPath, contentType: 'text/plain' });
    }

    try {
      const htmlPath = path.join(testInfo.outputDir, 'page.html');
      await fs.writeFile(htmlPath, await page.content(), 'utf8');
      await testInfo.attach('page-html', { path: htmlPath, contentType: 'text/html' });
    } catch {
      // Best-effort only; ignore if page is closed.
    }
  });

  test('start screen advances to game without black screen', async ({ page }) => {
  await page.goto('./');

  await page.setViewportSize({ width: 1440, height: 900 });

  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  await page.waitForFunction(() => {
    return document.documentElement.getAttribute('data-scene') === 'StartScene';
  });

  await page.waitForTimeout(500);
  await canvas.click({ position: { x: 10, y: 10 } });
  await page.keyboard.press('Space');

  await page.waitForFunction(() => {
    return document.documentElement.getAttribute('data-scene') === 'GameScene';
  });

  await page.waitForFunction(() => {
    return document.documentElement.getAttribute('data-game-ready') === 'true';
  });

  const initialTick = await page.evaluate(() => document.documentElement.getAttribute('data-game-tick'));
  await page.waitForFunction((previousTick) => {
    const currentTick = document.documentElement.getAttribute('data-game-tick');
    return currentTick !== null && currentTick !== previousTick;
  }, initialTick);

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

  test('arrow up jump returns to ground', async ({ page }) => {
    await page.goto('./');
    await page.setViewportSize({ width: 1440, height: 900 });

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    await page.waitForFunction(() => {
      return document.documentElement.getAttribute('data-scene') === 'StartScene';
    });

    await canvas.click({ position: { x: 10, y: 10 } });
    await page.keyboard.press('Space');

    await page.waitForFunction(() => {
      return document.documentElement.getAttribute('data-game-ready') === 'true';
    });

    await page.waitForFunction(() => {
      return document.documentElement.getAttribute('data-player-on-ground') === 'true';
    });

    const startY = await page.evaluate(() => Number(document.documentElement.getAttribute('data-player-y')));

    await page.keyboard.press('ArrowUp');

    await page.waitForFunction(() => {
      return document.documentElement.getAttribute('data-player-on-ground') === 'false';
    });

    await page.waitForFunction(() => {
      return document.documentElement.getAttribute('data-player-on-ground') === 'true';
    });

    const endY = await page.evaluate(() => Number(document.documentElement.getAttribute('data-player-y')));
    expect(Math.abs(endY - startY)).toBeLessThan(10);
  });
});
