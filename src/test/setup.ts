import '@testing-library/jest-dom/vitest';
import { MotionGlobalConfig } from 'motion/react';

// Tests check behaviour, not animation: make every animation finish instantly.
MotionGlobalConfig.skipAnimations = true;

// jsdom has no IntersectionObserver (whileInView) or matchMedia (reduced motion).
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
globalThis.IntersectionObserver ??= NoopObserver as unknown as typeof IntersectionObserver;
globalThis.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver;
window.matchMedia ??= ((query: string) => ({
  matches: false, media: query, onchange: null,
  addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia;
