// Every decision the demos make that is not animation lives here, with no React
// and no DOM, so it is tested directly (src/test/logic.test.ts).

/** Arrow-key movement across a tab list: wraps at both ends, Home/End jump. */
export function nextTabIndex(current: number, key: string, count: number): number {
  if (count <= 0) return 0;
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (current + 1) % count;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (current - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return current;
  }
}

/** The number ticker's display: whole numbers with thousands separators, never "-0". */
export function formatTicker(value: number, locale = 'en-US'): string {
  const rounded = Math.round(value);
  return new Intl.NumberFormat(locale).format(Object.is(rounded, -0) ? 0 : rounded);
}

export interface Item {
  id: number;
  label: string;
}

/** Adds an item at the top with the next unused id, so React keys never repeat. */
export function addItem(items: Item[], label: string): Item[] {
  const trimmed = label.trim();
  if (!trimmed) return items;
  const id = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  return [{ id, label: trimmed }, ...items];
}

export function removeItem(items: Item[], id: number): Item[] {
  return items.filter((item) => item.id !== id);
}

/**
 * How far a dragged card may travel before it springs back, as Motion's
 * dragConstraints: half the free space on each axis, and never negative.
 */
export function dragBounds(container: { width: number; height: number }, card: { width: number; height: number }) {
  const x = Math.max(0, (container.width - card.width) / 2);
  const y = Math.max(0, (container.height - card.height) / 2);
  return { left: -x, right: x, top: -y, bottom: y };
}
