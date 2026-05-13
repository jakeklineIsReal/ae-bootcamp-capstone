import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';

// Bug: #1 — Wyatt can't jump from the ground
// Steps to reproduce:
//   1. Open the game
//   2. Wait for Wyatt to start riding
//   3. Press spacebar / arrow up to jump
// Expected: Wyatt jumps off the ground with a sound effect
// Actual: Nothing happens — Wyatt doesn't jump at all

test.describe('Bug #1: Wyatt can\'t jump from the ground', () => {
  let consoleMessages: string[] = [];
  let pageErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleMessages = [];
    pageErrors = [];

    page.on('console', (msg) => {
      consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    await page.goto('./');
    await page.setViewportSize({ width: 1440, height: 900 });

    // Wait for canvas to appear
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Wait for StartScene
    await page.waitForFunction(() => {
      return document.documentElement.getAttribute('data-scene') === 'StartScene';
    });

    // Click to unlock AudioContext, then press Space to advance to GameScene
    await page.waitForTimeout(500);
    await canvas.click({ position: { x: 10, y: 10 } });
    await page.keyboard.press('Space');

    // Wait for GameScene to become active
    await page.waitForFunction(() => {
      return document.documentElement.getAttribute('data-scene') === 'GameScene';
    });

    // Wait for the game loop to confirm it is ticking
    await page.waitForFunction(() => {
      return document.documentElement.getAttribute('data-game-ready') === 'true';
    });

    const initialTick = await page.evaluate(() =>
      document.documentElement.getAttribute('data-game-tick')
    );
    await page.waitForFunction((previousTick) => {
      const currentTick = document.documentElement.getAttribute('data-game-tick');
      return currentTick !== null && currentTick !== previousTick;
    }, initialTick);
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

    try {
      const htmlPath = path.join(testInfo.outputDir, 'page.html');
      await fs.writeFile(htmlPath, await page.content(), 'utf8');
      await testInfo.attach('page-html', { path: htmlPath, contentType: 'text/html' });
    } catch {
      // Best-effort only; ignore if page is closed.
    }
  });

  test('should jump when spacebar is pressed while on the ground', async ({ page }) => {
    // Step 1: Wait for Wyatt to be standing on the ground
    await page.waitForFunction(() => {
      return document.documentElement.getAttribute('data-player-on-ground') === 'true';
    });

    // Step 2: Record the player's baseline Y position (larger Y = lower on screen)
    const groundY = await page.evaluate(() =>
      parseInt(document.documentElement.getAttribute('data-player-y') ?? '9999', 10)
    );

    // Step 3: Press spacebar to trigger the jump
    await page.keyboard.press('Space');

    // Step 4: Assert the player moves upward (Y decreases) within 1 second.
    // JUMP_VELOCITY is -400, so after even one frame the Y should drop noticeably.
    // This assertion SHOULD pass but WILL FAIL while Bug #1 exists because
    // Player.jump() has an inverted guard: `if (!this.onGround)` should be `if (this.onGround)`.
    await page.waitForFunction((baseline) => {
      const currentY = parseInt(
        document.documentElement.getAttribute('data-player-y') ?? '9999',
        10
      );
      return currentY < baseline - 5; // at least 5px upward movement
    }, groundY, { timeout: 1000 });
  });

  test('should jump when arrow-up is pressed while on the ground', async ({ page }) => {
    // Step 1: Wait for Wyatt to be standing on the ground
    await page.waitForFunction(() => {
      return document.documentElement.getAttribute('data-player-on-ground') === 'true';
    });

    // Step 2: Record the player's baseline Y position
    const groundY = await page.evaluate(() =>
      parseInt(document.documentElement.getAttribute('data-player-y') ?? '9999', 10)
    );

    // Step 3: Press arrow-up to trigger the jump
    await page.keyboard.press('ArrowUp');

    // Step 4: Assert the player moves upward.
    // Same root cause as the spacebar test — jump() guard condition is inverted.
    await page.waitForFunction((baseline) => {
      const currentY = parseInt(
        document.documentElement.getAttribute('data-player-y') ?? '9999',
        10
      );
      return currentY < baseline - 5;
    }, groundY, { timeout: 1000 });
  });
});
