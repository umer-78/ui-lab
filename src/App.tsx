import type { ReactNode } from 'react';
import { motion, type Variants } from 'motion/react';
import { Accordion } from './demos/Accordion';
import { NumberTicker } from './demos/NumberTicker';
import { PresenceList } from './demos/PresenceList';
import { ScrollProgress } from './demos/ScrollProgress';
import { SpringCard } from './demos/SpringCard';
import { Tabs } from './demos/Tabs';

// Hero entrance: the parent staggers its children, so adding a line needs no new delays.
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 26 } },
};

interface DemoProps {
  n: number;
  title: string;
  trick: ReactNode;
  children: ReactNode;
}

function Demo({ n, title, trick, children }: DemoProps) {
  return (
    <motion.section
      aria-labelledby={`demo-${n}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 200, damping: 26 }}
      className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60"
    >
      <p className="font-mono text-xs text-zinc-500">0{n}</p>
      <h2 id={`demo-${n}`} className="mt-1 text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 mb-5 text-sm text-zinc-600 dark:text-zinc-400">{trick}</p>
      <div>{children}</div>
    </motion.section>
  );
}

export default function App() {
  return (
    <>
      <ScrollProgress />
      <header className="mx-auto max-w-5xl px-4 pt-20 pb-12 sm:px-6">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.p variants={rise} className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold tracking-wide text-violet-700 uppercase dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300">
            React · Motion · Tailwind
          </motion.p>
          <motion.h1 variants={rise} className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            UI Lab
          </motion.h1>
          <motion.p variants={rise} className="mt-4 max-w-2xl text-lg text-pretty text-zinc-600 dark:text-zinc-400">
            Six animation patterns, each small enough to copy into a project. Every one works with a
            keyboard, and all of them calm down when your system asks for reduced motion.
          </motion.p>
          <motion.nav variants={rise} aria-label="Links" className="mt-6 flex flex-wrap gap-3">
            <a href="https://github.com/umer-78/ui-lab" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
              Source on GitHub
            </a>
            <a href="https://umer-78.github.io/" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
              All projects
            </a>
          </motion.nav>
        </motion.div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-5 px-4 pb-16 sm:px-6 md:grid-cols-2">
        <Demo n={1} title="Shared layout tabs" trick={<>One highlight with a <code>layoutId</code> springs between tabs.</>}>
          <Tabs />
        </Demo>
        <Demo n={2} title="Enter and exit" trick={<><code>AnimatePresence</code> lets removed items leave instead of vanishing.</>}>
          <PresenceList />
        </Demo>
        <Demo n={3} title="Drag with a spring" trick={<><code>drag</code> inside <code>dragConstraints</code>, snapping home on release.</>}>
          <SpringCard />
        </Demo>
        <Demo n={4} title="Number ticker" trick={<>A <code>useSpring</code> value, formatted through <code>useTransform</code>.</>}>
          <NumberTicker />
        </Demo>
        <Demo n={5} title="Expanding rows" trick={<><code>height: "auto"</code> plus <code>layout</code>, so the rows below move smoothly.</>}>
          <Accordion />
        </Demo>
        <Demo n={6} title="Scroll progress" trick={<>The bar at the top: <code>useScroll</code> into a spring-smoothed <code>scaleX</code>.</>}>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Scroll the page and watch the top edge. The spring lets the bar trail the scroll slightly,
            so a flick of the wheel reads as a movement instead of a jump. The cards on this page use{' '}
            <code>whileInView</code> to rise in once as they enter.
          </p>
        </Demo>
      </main>

      <footer className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="border-t border-zinc-200 py-8 text-sm text-zinc-500 dark:border-zinc-800">
        Built by <a className="font-medium text-violet-700 hover:underline dark:text-violet-300" href="https://github.com/umer-78">Umer Hashmi</a> with
        React, <a className="font-medium text-violet-700 hover:underline dark:text-violet-300" href="https://motion.dev">Motion</a> and Tailwind CSS. MIT licensed.
        </p>
      </footer>
    </>
  );
}
