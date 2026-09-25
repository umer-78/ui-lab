import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { formatTicker } from '../lib/logic';

export function NumberTicker() {
  const [target, setTarget] = useState(12480);
  const value = useMotionValue(0);
  const spring = useSpring(value, { stiffness: 90, damping: 22 });
  const text = useTransform(spring, (v) => formatTicker(v));

  useEffect(() => { value.set(target); }, [target, value]);

  return (
    <div>
      {/* The animated number is hidden from screen readers; they hear only the settled value. */}
      <motion.p aria-hidden="true" className="text-5xl font-bold tracking-tight tabular-nums">{text}</motion.p>
      <p className="sr-only" aria-live="polite">{formatTicker(target)}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setTarget((t) => t + 1000)} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">+1,000</button>
        <button type="button" onClick={() => setTarget(Math.round(Math.random() * 1_000_000))} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">Random</button>
        <button type="button" onClick={() => setTarget(0)} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">Reset</button>
      </div>
    </div>
  );
}
