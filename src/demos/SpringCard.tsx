import { useRef } from 'react';
import { animate, motion, useMotionValue } from 'motion/react';
import { dragBounds } from '../lib/logic';

const STEP = 28;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const home = { type: 'spring', stiffness: 380, damping: 22 } as const;

export function SpringCard() {
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Keyboard equivalent of dragging: arrows move within the same bounds, Escape goes home.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') { animate(x, 0, home); animate(y, 0, home); return; }
    const moves: Record<string, [number, number]> = { ArrowLeft: [-STEP, 0], ArrowRight: [STEP, 0], ArrowUp: [0, -STEP], ArrowDown: [0, STEP] };
    const move = moves[event.key];
    if (!move || !box.current || !card.current) return;
    event.preventDefault();
    const b = dragBounds(box.current.getBoundingClientRect(), card.current.getBoundingClientRect());
    animate(x, clamp(x.get() + move[0], b.left, b.right), home);
    animate(y, clamp(y.get() + move[1], b.top, b.bottom), home);
  };

  return (
    <div
      ref={box}
      className="relative grid h-56 place-items-center overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-[radial-gradient(circle,var(--color-zinc-300)_1px,transparent_1px)] bg-size-[16px_16px] dark:border-zinc-700 dark:bg-[radial-gradient(circle,var(--color-zinc-800)_1px,transparent_1px)]"
    >
      <motion.div
        ref={card}
        drag
        dragConstraints={box}
        dragElastic={0.18}
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 380, bounceDamping: 22 }}
        style={{ x, y }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        whileDrag={{ scale: 1.06, rotate: -3 }}
        tabIndex={0}
        role="button"
        aria-label="Spring card. Drag it, or use the arrow keys; Escape sends it home."
        onKeyDown={onKeyDown}
        className="grid h-24 w-40 cursor-grab touch-none place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 select-none active:cursor-grabbing"
      >
        Drag me
      </motion.div>
    </div>
  );
}
