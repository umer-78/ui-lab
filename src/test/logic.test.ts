import { describe, expect, it } from 'vitest';
import { addItem, dragBounds, formatTicker, nextTabIndex, removeItem } from '../lib/logic';

describe('nextTabIndex', () => {
  it('moves right and left and wraps at both ends', () => {
    expect(nextTabIndex(0, 'ArrowRight', 3)).toBe(1);
    expect(nextTabIndex(2, 'ArrowRight', 3)).toBe(0);
    expect(nextTabIndex(0, 'ArrowLeft', 3)).toBe(2);
  });

  it('jumps with Home and End and ignores other keys', () => {
    expect(nextTabIndex(1, 'Home', 4)).toBe(0);
    expect(nextTabIndex(1, 'End', 4)).toBe(3);
    expect(nextTabIndex(1, 'a', 4)).toBe(1);
  });

  it('survives an empty list', () => {
    expect(nextTabIndex(0, 'ArrowRight', 0)).toBe(0);
  });
});

describe('formatTicker', () => {
  it('rounds and adds separators', () => {
    expect(formatTicker(1234567.6)).toBe('1,234,568');
  });

  it('never shows negative zero mid-animation', () => {
    expect(formatTicker(-0.3)).toBe('0');
  });
});

describe('the list', () => {
  it('adds at the top with a fresh id and ignores blank input', () => {
    const one = addItem([], '  first  ');
    const two = addItem(one, 'second');
    expect(two.map((i) => i.label)).toEqual(['second', 'first']);
    expect(new Set(two.map((i) => i.id)).size).toBe(2);
    expect(addItem(two, '   ')).toBe(two);
  });

  it('never reuses an id after a removal', () => {
    const list = addItem(addItem([], 'a'), 'b'); // ids 1, 2
    const afterRemove = removeItem(list, 1);
    expect(addItem(afterRemove, 'c')[0].id).toBe(3);
  });
});

describe('dragBounds', () => {
  it('allows half the free space each way', () => {
    expect(dragBounds({ width: 400, height: 300 }, { width: 200, height: 100 }))
      .toEqual({ left: -100, right: 100, top: -100, bottom: 100 });
  });

  it('never goes negative when the card is bigger than its box', () => {
    const b = dragBounds({ width: 100, height: 100 }, { width: 200, height: 200 });
    expect([b.left, b.right, b.top, b.bottom].map(Math.abs)).toEqual([0, 0, 0, 0]);
  });
});
