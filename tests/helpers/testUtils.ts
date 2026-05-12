/**
 * Test Utilities
 * Common test helpers and utilities
 */

import { vi } from 'vitest';

/**
 * Advance time for tween/animation testing
 */
export function advanceTime(ms: number): void {
  vi.advanceTimersByTime(ms);
}

/**
 * Wait for next tick (for async operations)
 */
export async function waitForNextTick(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Assert that a value is within a range
 */
export function assertInRange(value: number, min: number, max: number, message?: string): void {
  if (value < min || value > max) {
    throw new Error(message || `Expected ${value} to be between ${min} and ${max}`);
  }
}

/**
 * Create a spy on console methods
 */
export function spyOnConsole(method: 'log' | 'warn' | 'error'): any {
  return vi.spyOn(console, method).mockImplementation(() => {});
}

/**
 * Restore console spies
 */
export function restoreConsoleSpy(spy: any): void {
  spy.mockRestore();
}
