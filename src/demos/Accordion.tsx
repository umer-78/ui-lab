import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const ITEMS = [
  { q: 'Why animate height: "auto"?', a: 'CSS cannot transition to auto. Motion measures the content, animates to that height in pixels, then hands back auto so text can still reflow.' },
  { q: 'Why does the list below shift smoothly?', a: 'Each item has the layout prop, so when one grows the others animate to their new positions instead of jumping.' },
  { q: 'What happens with reduced motion on?', a: 'MotionConfig reducedMotion="user" skips transform and layout animation. Opacity still fades, so nothing appears to teleport.' },
];

export function Accordion() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <ul className="space-y-2">
      {ITEMS.map((item, index) => {
        const isOpen = open === index;
        return (
          <motion.li layout key={item.q} className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <motion.button
              layout="position"
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${id}-${index}`}
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold"
            >
              {item.q}
              <motion.span aria-hidden="true" animate={{ rotate: isOpen ? 45 : 0 }} className="text-lg leading-none text-violet-600 dark:text-violet-400">+</motion.span>
            </motion.button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-${index}`}
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                >
                  <p className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}
