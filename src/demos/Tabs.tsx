import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { nextTabIndex } from '../lib/logic';

const TABS = [
  { label: 'Layout', body: 'The highlight is one element with a layoutId. When it renders under a different tab, Motion measures both positions and springs between them.' },
  { label: 'Springs', body: 'Springs are described by stiffness and damping (or bounce and duration), so a movement that gets interrupted keeps its velocity instead of restarting.' },
  { label: 'Presence', body: 'AnimatePresence keeps a removed element mounted until its exit animation finishes. mode="wait" here lets the old text leave before the new text enters.' },
];

export function Tabs() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const select = (index: number) => {
    setActive(index);
    buttons.current[index]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Motion ideas" className="inline-flex gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
        {TABS.map((tab, index) => (
          <button
            key={tab.label}
            ref={(el) => { buttons.current[index] = el; }}
            id={`${id}-tab-${index}`}
            role="tab"
            type="button"
            aria-selected={active === index}
            aria-controls={`${id}-panel`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const next = nextTabIndex(index, event.key, TABS.length);
              if (next !== index) { event.preventDefault(); select(next); }
            }}
            className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === index ? 'text-white' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            {active === index && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-full bg-violet-600 shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} className="mt-4 min-h-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
          >
            {TABS[active].body}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
