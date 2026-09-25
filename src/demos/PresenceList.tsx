import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { addItem, removeItem, type Item } from '../lib/logic';

const START = ['Tag v1.0', 'Record the demo GIF', 'Write the README'].reduce<Item[]>((list, label) => addItem(list, label), []);

export function PresenceList() {
  const [items, setItems] = useState(START);
  const [draft, setDraft] = useState('');

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(event) => { event.preventDefault(); setItems((list) => addItem(list, draft)); setDraft(''); }}
      >
        <label htmlFor="new-item" className="sr-only">New item</label>
        <input
          id="new-item"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add an item"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button type="submit" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 active:scale-[0.98]">Add</button>
      </form>
      <ul className="mt-3 space-y-2" aria-label="Items">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 32, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 520, damping: 34 }}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span>{item.label}</span>
              <button
                type="button"
                aria-label={`Remove ${item.label}`}
                onClick={() => setItems((list) => removeItem(list, item.id))}
                className="rounded-md px-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {items.length === 0 && <p className="mt-3 text-sm text-zinc-500">Empty. Add something.</p>}
    </div>
  );
}
