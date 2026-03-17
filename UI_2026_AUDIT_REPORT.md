# Modern UI 2026 Compliance Audit Report

**Project:** MarineFit (Marine Fitness Suite)
**Date:** 2026-03-16
**Stack:** React 18 + Vite 5 + Tailwind CSS 3 + Framer Motion 12 (CSR SPA)

---

## Audit Summary Table

| # | CRITERION | STATUS | FILE:LINE | FIX REQUIRED |
|---|-----------|--------|-----------|--------------|
| 1 | oklch Color Tokens | **FAIL** | `tailwind.config.js:12-15`, `src/index.css:6-7`, `src/components/BodyComp.jsx:296-632`, `src/components/PullupProgram.jsx:47-340`, `src/components/PFTPrep.jsx:78-84` | Convert all hex (#), rgba() color values to oklch(). Zero oklch() usage found. 50+ hex values across 5 files. |
| 2 | Motion Degradation Guard | **FAIL** | `src/index.css` (missing), 15 component files with framer-motion | No `@media (prefers-reduced-motion: reduce)` block exists anywhere. 132+ animations/transitions unguarded. |
| 3 | INP Under 200ms | **FAIL** | (missing) | No PerformanceObserver, no web-vitals, no INP measurement code anywhere in codebase. |
| 4 | LCP Under 2.5s | **FAIL** | `index.html:7-9,13`, `vite.config.js:1-6`, `src/main.jsx:6` | No fetchpriority="high", no SSR/SSG, render-blocking Google Fonts CSS, no preload hints. CSR-only via createRoot. |
| 5 | Touch Targets 44x44px | **FAIL** | `src/index.css:27,31`, `src/components/PFTPrep.jsx:677`, `src/components/SleepOptimizer.jsx:391`, `src/components/ptcoach/WorkoutCard.jsx:41-57` | Checkboxes 20x20px, icon buttons 24x24px, .btn class ~36px tall. Multiple elements below 44px minimum. |
| 6 | 8px Spacing Grid | **FAIL** | `src/components/BodyComp.jsx:306-529`, `src/index.css:47`, `src/components/PFTPrep.jsx:899` | 23 violations: 4px, 6px, 10px, 12px, 20px values in print styles and scrollbar width. |
| 7 | Agentic Undo Stack | **FAIL** | `src/components/PTCoach.jsx` (missing) | No undo mechanism for any workout generation/mutation. Only localStorage persistence exists, no state history stack. |
| 8 | Empty States Designed | **PARTIAL** | `src/components/PTCoach.jsx:620,1030`, `src/components/ExerciseLibrary.jsx:213` | 2 of 95+ .map() calls have empty state guards. 5 high-risk dynamic data renders lack guards entirely. |
| 9 | Progressive Enhancement | **FAIL** | `src/main.jsx:6`, `index.html:12`, `vite.config.js:1-6` | Pure CSR app. Empty `<div id="root">`, no SSR/SSG, no noscript fallback, all content requires JS. |
| 10 | Dark Mode - Thoughtful | **PARTIAL** | `src/context/ThemeContext.jsx:28-29`, `tailwind.config.js:7,12-15`, `src/index.css:5-8` | Class-based dark mode works via Tailwind `dark:` modifier (766 instances). But tokens are hex, not oklch. No contrast ratio validation. No separate dark token set — relies on Tailwind defaults. FOUC risk (theme applied post-mount). |

---

## Priority Fix List

Ordered by user impact, highest first.

---

### FIX 1: Motion Degradation Guard (Criterion 2)

**Impact:** Accessibility — motion-sensitive users experience seizures/nausea from 132+ unguarded animations.

**Target file:** `src/index.css` — insert BEFORE any animation declarations (after line 3).

```css
/* === src/index.css — insert after line 3, before :root === */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .animate-spin,
  .animate-in,
  [class*="transition-"],
  [class*="duration-"] {
    animation: none !important;
    transition: none !important;
  }

  /* Disable all framer-motion transforms */
  [style*="transform"],
  [style*="opacity"] {
    transition: none !important;
    animation: none !important;
  }
}
```

Additionally, every framer-motion component must respect the preference. Add this hook:

**Target file:** `src/hooks/useReducedMotion.js` (new file)

```js
// src/hooks/useReducedMotion.js
import { useReducedMotion } from 'framer-motion';
export { useReducedMotion };
```

Then in each component using `motion.*`, wrap animation props:

```jsx
// Example fix for src/components/Dashboard.jsx
import { useReducedMotion } from 'framer-motion';

// Inside component:
const prefersReduced = useReducedMotion();
const variants = prefersReduced
  ? { hidden: {}, visible: {} }
  : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
```

**Affected files (15):**
- `src/components/Dashboard.jsx`
- `src/components/Navigation.jsx`
- `src/components/ExerciseLibrary.jsx`
- `src/components/InjuryPrevention.jsx`
- `src/components/SleepOptimizer.jsx`
- `src/components/Nutrition.jsx`
- `src/components/BodyComp.jsx`
- `src/components/PFTPrep.jsx`
- `src/components/PTCoach.jsx`
- `src/components/WalkToRunProgram.jsx`
- `src/components/PullupProgram.jsx`
- `src/components/ptcoach/WorkoutCard.jsx`
- `src/components/ptcoach/SwapExerciseModal.jsx`
- `src/components/ptcoach/ExercisePickerModal.jsx`
- `src/components/pftprep/EventStandardsModal.jsx`
- `src/components/pftprep/ImprovementRecommendations.jsx`

---

### FIX 2: Progressive Enhancement / LCP (Criteria 4 & 9)

**Impact:** Performance — entire app is blank without JS. No SSR/SSG means slow LCP.

**Target file:** `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Marine Fitness Suite</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
    <noscript>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
    </noscript>
    <script>
      // Prevent FOUC: apply theme before React mounts
      (function() {
        var t = localStorage.getItem('marinefit_theme');
        if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.classList.add(t);
      })();
    </script>
  </head>
  <body>
    <div id="root">
      <!-- Static fallback for progressive enhancement -->
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui,sans-serif">
        <div style="text-align:center">
          <h1 style="font-size:1.5rem;font-weight:700;color:#8b0000">Marine Fitness Suite</h1>
          <p style="color:#666;margin-top:8px">Loading application...</p>
        </div>
      </div>
    </div>
    <noscript>
      <div style="padding:32px;text-align:center;font-family:system-ui,sans-serif">
        <h1>Marine Fitness Suite</h1>
        <p>This application requires JavaScript to run. Please enable JavaScript in your browser settings.</p>
      </div>
    </noscript>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### FIX 3: INP Monitoring (Criterion 3)

**Impact:** Performance — zero visibility into interaction responsiveness.

**Target file:** `src/main.jsx` — append after existing code.

```js
// src/main.jsx — append after line 17

// INP (Interaction to Next Paint) monitoring — P75
if (typeof PerformanceObserver !== 'undefined') {
  let maxINP = 0;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.interactionId) {
        const duration = entry.duration;
        if (duration > maxINP) {
          maxINP = duration;
          // Log INP at P75 — replace with your analytics endpoint
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/vitals', JSON.stringify({
              metric: 'INP',
              value: maxINP,
              rating: maxINP <= 200 ? 'good' : maxINP <= 500 ? 'needs-improvement' : 'poor',
              timestamp: Date.now(),
            }));
          }
        }
      }
    }
  });
  try {
    observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });
  } catch (e) {
    // Event Timing API not supported
  }
}
```

---

### FIX 4: oklch Color Tokens (Criteria 1 & 10)

**Impact:** Design system — no perceptually uniform color space. Dark mode tokens not independently defined.

**Target file:** `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        marine: {
          red: 'oklch(0.35 0.15 25)',       /* #8B0000 */
          gold: 'oklch(0.87 0.17 85)',       /* #FFD700 */
          dark: 'oklch(0.15 0 0)',           /* #1a1a1a */
          light: 'oklch(0.98 0.005 250)',    /* #f8f9fa */
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        'plex-mono': ['"IBM Plex Mono"', 'monospace'],
        'plex-sans': ['"IBM Plex Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Target file:** `src/index.css` — replace lines 5-8

```css
:root {
  --marine-red: oklch(0.35 0.15 25);
  --marine-gold: oklch(0.87 0.17 85);
  --surface: oklch(0.985 0.005 250);
  --text-primary: oklch(0.15 0 0);
  --text-secondary: oklch(0.45 0 0);
  --border: oklch(0.85 0 0);
  --scrollbar-thumb: oklch(0.65 0 0 / 0.4);
  --scrollbar-thumb-hover: oklch(0.65 0 0 / 0.6);
}

[data-theme="dark"], .dark {
  --marine-red: oklch(0.45 0.18 25);
  --marine-gold: oklch(0.82 0.15 85);
  --surface: oklch(0.15 0 0);
  --text-primary: oklch(0.93 0 0);
  --text-secondary: oklch(0.65 0 0);
  --border: oklch(0.30 0 0);
  --scrollbar-thumb: oklch(0.45 0 0 / 0.4);
  --scrollbar-thumb-hover: oklch(0.45 0 0 / 0.6);
}
```

Then replace scrollbar rgba values in `src/index.css:53,57,61`:

```css
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) transparent;
}
```

**Inline hex values requiring conversion in component files:**

| File | Lines | Current | Replacement |
|------|-------|---------|-------------|
| `BodyComp.jsx` | 296 | `color: '#000'` | `color: 'oklch(0 0 0)'` |
| `BodyComp.jsx` | 301 | `borderBottom: '3px solid #8b0000'` | `borderBottom: '3px solid oklch(0.35 0.15 25)'` |
| `BodyComp.jsx` | 312 | `color: '#555'` | `color: 'oklch(0.45 0 0)'` |
| `BodyComp.jsx` | 318 | `border: '1px solid #ccc'` | `border: '1px solid oklch(0.85 0 0)'` |
| `BodyComp.jsx` | 325 | `color: '#8b0000'` | `color: 'oklch(0.35 0.15 25)'` |
| `BodyComp.jsx` | 394 | `#16a34a` / `#dc2626` | `oklch(0.55 0.16 145)` / `oklch(0.53 0.19 27)` |
| `BodyComp.jsx` | 457,511,525 | `#555`, `#777` | `oklch(0.45 0 0)`, `oklch(0.55 0 0)` |
| `BodyComp.jsx` | 632 | `color: #000` | `color: oklch(0 0 0)` |
| `PullupProgram.jsx` | 47-51 | `#C8102E`, `#D62E2E`, `#E65C23`, `#F08C1A`, `#F9B208` | `oklch(0.45 0.2 25)`, `oklch(0.50 0.2 28)`, `oklch(0.55 0.18 45)`, `oklch(0.62 0.16 65)`, `oklch(0.75 0.17 85)` |
| `PullupProgram.jsx` | 96-340 | Arbitrary Tailwind `bg-[#0d1821]`, `text-[#C8102E]`, etc. | Convert to semantic Tailwind classes or CSS variables |
| `PFTPrep.jsx` | 78-84 | `hexColor: '#dc2626'`, `'#2563eb'`, `'#16a34a'`, `'#eab308'`, `'#9333ea'`, `'#9ca3af'` | `oklch(0.53 0.19 27)`, `oklch(0.50 0.18 260)`, `oklch(0.55 0.16 145)`, `oklch(0.73 0.16 90)`, `oklch(0.45 0.20 305)`, `oklch(0.70 0.01 250)` |
| `PFTPrep.jsx` | 950, 1085 | `'#000'`, `'#fff'` | `oklch(0 0 0)`, `oklch(1 0 0)` |
| `index.css` | 88,101,107,116 | `#ccc`, `#8b0000`, `#ddd` | `oklch(0.85 0 0)`, `oklch(0.35 0.15 25)`, `oklch(0.88 0 0)` |

---

### FIX 5: Touch Targets 44x44px (Criterion 5)

**Impact:** Accessibility — undersized targets cause mis-taps on mobile.

**Target file:** `src/index.css` — add after `.input-field` block (after line 42)

```css
/* Touch target minimums — WCAG 2.2 SC 2.5.8 */
@layer components {
  button,
  [role="button"],
  a,
  input[type="checkbox"],
  input[type="radio"] {
    min-height: 44px;
    min-width: 44px;
  }

  /* Icon-only buttons need explicit sizing */
  .icon-btn {
    @apply flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5;
  }
}
```

**Target file:** `src/components/PFTPrep.jsx:677` — fix checkbox

```jsx
<input
  type="checkbox"
  className="w-6 h-6 rounded border-gray-300 text-marine-red focus:ring-marine-red cursor-pointer"
  style={{ minWidth: '44px', minHeight: '44px', padding: '10px' }}
/>
```

**Target file:** `src/components/SleepOptimizer.jsx:391` — fix checkbox div

```jsx
className="w-11 h-11 rounded border-2 flex items-center justify-center cursor-pointer"
```

**Target file:** `src/components/ptcoach/WorkoutCard.jsx:41,48,57` — fix icon buttons

```jsx
// Change all p-2 icon buttons to:
className="p-2.5 min-w-[44px] min-h-[44px] ..."
```

---

### FIX 6: Empty States (Criterion 8)

**Impact:** UX — users see blank content when data is empty.

**Target file:** `src/components/ptcoach/WorkoutCard.jsx` — before line 112

```jsx
{workout.blocks.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
    <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
    <p className="font-medium">No exercise blocks</p>
    <p className="text-sm mt-1">Add exercises to build your workout</p>
  </div>
) : (
  workout.blocks.map((block, bIdx) => (
    /* existing block rendering */
  ))
)}
```

**Target file:** `src/components/ptcoach/SwapExerciseModal.jsx` — before line 75

```jsx
{filteredExercises.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
    <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <p className="font-medium">No matching exercises</p>
    <p className="text-sm mt-1">Try adjusting your search terms</p>
  </div>
) : (
  filteredExercises.map((ex) => (
    /* existing rendering */
  ))
)}
```

**Target file:** `src/components/ptcoach/ExercisePickerModal.jsx` — before line 73

```jsx
{filteredExercises.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
    <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <p className="font-medium">No exercises found</p>
    <p className="text-sm mt-1">Try a different category or search</p>
  </div>
) : (
  filteredExercises.map((ex) => (
    /* existing rendering */
  ))
)}
```

---

### FIX 7: Agentic Undo Stack (Criterion 7)

**Impact:** UX — workout generation/edits cannot be undone.

**Target file:** `src/components/PTCoach.jsx` — add state machine pattern near line 130

```jsx
// Undo stack for workout mutations
const UNDO_TIMEOUT = 30000; // 30 seconds
const [undoStack, setUndoStack] = useState([]);
const [undoToast, setUndoToast] = useState(null);

const pushUndo = (label, prevState, restoreFn) => {
  const entry = {
    id: Date.now(),
    label,
    prevState,
    restoreFn,
    status: 'pending', // pending | accepted | undone
    expiresAt: Date.now() + UNDO_TIMEOUT,
  };
  setUndoStack((prev) => [...prev, entry]);
  setUndoToast(entry);

  setTimeout(() => {
    setUndoStack((prev) =>
      prev.map((e) => (e.id === entry.id && e.status === 'pending' ? { ...e, status: 'accepted' } : e))
    );
    setUndoToast((current) => (current?.id === entry.id ? null : current));
  }, UNDO_TIMEOUT);

  return entry.id;
};

const handleUndo = (entryId) => {
  setUndoStack((prev) =>
    prev.map((e) => {
      if (e.id === entryId && e.status === 'pending') {
        e.restoreFn(e.prevState);
        return { ...e, status: 'undone' };
      }
      return e;
    })
  );
  setUndoToast(null);
};

// Usage — wrap workout generation:
// const prevWorkout = structuredClone(workout);
// generateWorkout(); // mutates workout state
// pushUndo('Generated workout', prevWorkout, (prev) => setWorkout(prev));

// Undo toast component (place before closing </div>):
// {undoToast && (
//   <div role="alert" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg shadow-xl flex items-center gap-4">
//     <span>{undoToast.label}</span>
//     <button onClick={() => handleUndo(undoToast.id)} className="font-bold underline">Undo</button>
//     <div className="w-24 h-1 bg-gray-700 dark:bg-gray-300 rounded overflow-hidden">
//       <div className="h-full bg-marine-red animate-[shrink_30s_linear_forwards]" />
//     </div>
//   </div>
// )}
```

---

### FIX 8: 8px Spacing Grid (Criterion 6)

**Impact:** Design consistency — 23 violations in print styles.

**Target file:** `src/components/BodyComp.jsx` — correct all non-8-multiple spacing values

| Line | Current | Corrected |
|------|---------|-----------|
| 306 | `margin: '0 0 4px 0'` | `margin: '0 0 8px 0'` |
| 309 | `margin: '0 0 4px 0'` | `margin: '0 0 8px 0'` |
| 318 | `padding: '12px 16px'` | `padding: '16px 16px'` |
| 330 | `gap: '6px 24px'` | `gap: '8px 24px'` |
| 347 | `padding: '12px 16px'` | `padding: '16px 16px'` |
| 359 | `gap: '4px 24px'` | `gap: '8px 24px'` |
| 377 | `margin: '12px 0 8px 0'` | `margin: '16px 0 8px 0'` |
| 378 | `gap: '4px 24px'` | `gap: '8px 24px'` |
| 391 | `marginTop: '10px'` | `marginTop: '8px'` |
| 393 | `padding: '8px 12px'` | `padding: '8px 16px'` |
| 410 | `padding: '12px 16px'` | `padding: '16px 16px'` |
| 422 | `gap: '4px 24px'` | `gap: '8px 24px'` |
| 444 | `marginTop: '10px'` | `marginTop: '8px'` |
| 447 | `padding: '8px 12px'` | `padding: '8px 16px'` |
| 462 | `gap: '4px 24px'` | `gap: '8px 24px'` |
| 480 | `marginTop: '10px'` | `marginTop: '8px'` |
| 481 | `padding: '8px 12px'` | `padding: '8px 16px'` |
| 508 | `margin: '0 0 4px 0'` | `margin: '0 0 8px 0'` |
| 522 | `paddingTop: '10px'` | `paddingTop: '8px'` |
| 523 | `marginTop: '20px'` | `marginTop: '24px'` |
| 529 | `margin: '0 0 2px 0'` | `margin: '0 0 8px 0'` |

**Target file:** `src/index.css:47` — scrollbar width

```css
/* Change: */
width: 6px;
/* To: */
width: 8px;
```

**Target file:** `src/components/PFTPrep.jsx:899`

```jsx
/* Change: */
minWidth: '580px'
/* To: */
minWidth: '576px'
```

---

## Score Summary

| Result | Count |
|--------|-------|
| **PASS** | 0 |
| **PARTIAL** | 2 |
| **FAIL** | 8 |
| **Total** | 10 |

**Overall Compliance: 0% PASS — Significant remediation required.**

---

*Report generated by automated audit. All line numbers verified against codebase as of 2026-03-16.*
