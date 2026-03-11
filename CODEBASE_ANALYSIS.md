# MarineFit Codebase Analysis Report

**Date:** 2026-03-11
**Analyzed by:** ESLint (with React plugins), Vite Build, Vitest, Prettier

---

## 1. ESLint Analysis (eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh)

### Summary

- **Total issues: 300 warnings, 0 errors**
- **Files affected: 24 files**
- **No blocking errors** - the codebase passes lint without errors

### Issue Breakdown by Rule

| Rule                                   | Count | Severity |
| -------------------------------------- | ----- | -------- |
| `no-unused-vars`                       | ~285  | Warning  |
| `no-console`                           | 8     | Warning  |
| `react-refresh/only-export-components` | 1     | Warning  |

### Issue Breakdown by Category

#### A. Unused Imports (Dominant Issue - ~250+ warnings)

The vast majority of warnings are **unused icon imports** from `lucide-react`. Nearly every component imports far more icons than it uses.

**Worst offenders:**
| File | Unused Imports |
|------|---------------|
| `PTCoach.jsx` | 22 unused imports (Activity, Dumbbell, RefreshCw, Filter, PlayCircle, Clock, Target, Save, History, Trash2, Search, BookOpen, X, Plus, ChevronDown, ChevronUp, PlusCircle, FileText, FileSpreadsheet, File, Download, Upload) |
| `PFTPrep.jsx` | 26+ unused imports/vars |
| `BodyComp.jsx` | 18 unused imports |
| `NutritionSectionContent.jsx` | 18 unused imports |
| `Nutrition.jsx` | 10 unused imports |
| `WorkoutCard.jsx` | 12 unused imports |
| `Navigation.jsx` | 10 unused imports |
| `WalkToRunProgram.jsx` | 10 unused imports |
| `SleepOptimizer.jsx` | 9 unused imports |
| `InjuryPrevention.jsx` | 7 unused imports |

#### B. Unused Variables & Functions (~30 warnings)

Several components define variables, functions, or lazy-loaded components that are never used:

- `App.jsx`: All lazy imports unused (PTCoach, ExerciseLibrary, PFTPrep, Nutrition, etc.) and PageLoader - 8 warnings
- `PFTPrep.jsx`: `crunches/setCrunches`, `rowTime/setRowTime`, `cardioType/setCardioType`, `imageError`, `handleJumpToPage`, `formatTime`, `TimeInput`, `NumberInput` - dead state and functions
- `BodyComp.jsx`: `BodyCompStandardsModal`, `ImprovementRecommendations`, `NumberInput`, `inchesToFeetAndInches` - unused components/functions
- `PullupProgram.jsx`: `WeekSlider`, `WeekDetail`, `maxSetReps` - unused components/vars
- `WalkToRunProgram.jsx`: `PhaseCard` - unused component
- `ExerciseLibrary.jsx`: `ExerciseCard`, multiple `Icon` destructures unused
- `Dashboard.jsx`: `DashboardCard` component, `Icon` parameter unused
- `ImprovementRecommendations.jsx`: `CollapsibleSection` unused
- `Navigation.jsx`: `NavItem` component unused
- `main.jsx`: `StrictMode`, `App` both unused
- `pftScoring.js`: `isBelowMinimum` function unused
- `workoutGenerator.js`: `prescriptionTemplates` import unused

#### C. Unused Function Parameters (~5 warnings)

- `BodyComp.jsx:279` - `height` parameter unused
- `PTCoach.jsx:790` - `blockIndex` parameter unused
- `PFTPrep.jsx:419` - `max` parameter unused
- `Dashboard.jsx:21` - `Icon` parameter unused
- `Navigation.jsx:12` - `Icon` parameter unused

#### D. React-Specific Plugin Findings

**react-hooks/rules-of-hooks:** PASS - No violations
**react-hooks/exhaustive-deps:** PASS - No violations
**react/jsx-no-target-blank:** PASS - No violations
**react/jsx-key:** PASS - No violations
**react-refresh/only-export-components:** 1 warning

- `ThemeContext.jsx:5` - exports both components and non-component values from the same file, which breaks Fast Refresh

#### E. Code Quality Rules

- `no-console`: 8 warnings in `test_scoring.js` (test file using console.log)
- `no-unused-vars` with caught errors: `PFTPrep.jsx:284` and `PlankProgram.jsx:36` - empty catch blocks with unused `err`
- `eqeqeq`: PASS - No violations (strict equality used throughout)
- `no-var`: PASS - No violations
- `no-debugger`: PASS - No violations
- `no-duplicate-imports`: PASS - No violations

---

## 2. Vite Build Analysis (@vitejs/plugin-react)

### Summary

- **Build status: SUCCESS**
- **Build time: 10.13 seconds**
- **2,392 modules transformed**
- **38 output chunks** (good code splitting via lazy loading)

### Bundle Size Analysis

| Category            | File                        | Raw Size | Gzip Size |
| ------------------- | --------------------------- | -------- | --------- |
| **Vendor (Large)**  | xlsx.js                     | 429 KB   | 143 KB    |
| **Vendor (Large)**  | jspdf.es.min.js             | 390 KB   | 128 KB    |
| **Vendor (Large)**  | index (React core)          | 348 KB   | 102 KB    |
| **Vendor (Large)**  | index (React DOM)           | 341 KB   | 110 KB    |
| **Vendor (Medium)** | html2canvas.esm.js          | 201 KB   | 48 KB     |
| **Vendor (Medium)** | jspdf.plugin.autotable.js   | 31 KB    | 10 KB     |
| **Vendor (Small)**  | purify.es.js (DOMPurify)    | 23 KB    | 9 KB      |
| **Vendor (Small)**  | index.es.js (framer-motion) | 151 KB   | 51 KB     |
| **App**             | PFTPrep.js                  | 67 KB    | 17 KB     |
| **App**             | Nutrition.js                | 64 KB    | 15 KB     |
| **App**             | PTCoach.js                  | 56 KB    | 13 KB     |
| **App**             | ExerciseLibrary.js          | 53 KB    | 9 KB      |
| **App**             | BodyComp.js                 | 36 KB    | 8 KB      |
| **App**             | hittData.js                 | 30 KB    | 5 KB      |
| **App**             | SleepOptimizer.js           | 24 KB    | 7 KB      |
| **App**             | InjuryPrevention.js         | 15 KB    | 4 KB      |
| **CSS**             | index.css                   | 60 KB    | 10 KB     |

### Key Observations

**Total bundle (all chunks): ~2.3 MB raw / ~700 KB gzipped**

#### Heavy Dependencies

1. **xlsx (429 KB / 143 KB gzip)** - Largest dependency. Only used for workout export. Consider lazy-loading on demand only.
2. **jspdf (390 KB / 128 KB gzip)** - Second largest. Also only for export.
3. **html2canvas (201 KB / 48 KB gzip)** - Used for PDF rendering. Only needed for export.
4. **framer-motion (151 KB / 51 KB gzip)** - Animation library. Many components import it but the ESLint analysis shows `motion` and `AnimatePresence` are unused in multiple files.

#### Positive Findings

- Good code splitting with React.lazy() - each page loads independently
- Icon tree-shaking appears to work (individual icon chunks are tiny: 0.3-1 KB each)
- CSS is well-bundled (60 KB raw, 10 KB gzip)
- No build warnings or errors

---

## 3. Vitest Test Analysis

### Summary

- **Status: ALL PASSING**
- **4 test files, 78 tests, 0 failures**
- **Total duration: 569ms**

### Test Breakdown

| Test File                  | Tests | Duration | Status |
| -------------------------- | ----- | -------- | ------ |
| `pftScoring.test.js`       | 42    | 12ms     | PASS   |
| `bodyCompScoring.test.js`  | 21    | 9ms      | PASS   |
| `workoutGenerator.test.js` | 9     | 10ms     | PASS   |
| `workoutExport.test.js`    | 6     | 5ms      | PASS   |

### Key Observations

- **Only utility/business-logic files are tested** - no component tests exist
- **No tests for:** Dashboard, PTCoach, PFTPrep, BodyComp, ExerciseLibrary, Nutrition, InjuryPrevention, SleepOptimizer, Navigation, or any sub-components
- **Test coverage is focused on data correctness** (scoring algorithms, workout generation, export formatting)
- Tests run fast (36ms total test execution) indicating good test isolation

---

## 4. Prettier Formatting Analysis

### Summary

- **Status: 24 files have formatting issues**
- **No files are correctly formatted** among those checked

### Files with Formatting Issues

| Category           | Files                                                                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tests**          | `pftScoring.test.js`, `workoutGenerator.test.js`                                                                                                                                       |
| **Core**           | `App.jsx`                                                                                                                                                                              |
| **Components**     | `ErrorBoundary.jsx`, `Footer.jsx`, `InjuryPrevention.jsx`, `Navigation.jsx`, `PullupProgram.jsx`, `SleepOptimizer.jsx`, `WalkToRunProgram.jsx`                                         |
| **Sub-Components** | `EventStandardsModal.jsx`, `ImprovementRecommendations.jsx`, `PerformanceStandardsModal.jsx`, `ExercisePickerModal.jsx`, `HITTSidebar.jsx`, `SwapExerciseModal.jsx`, `WorkoutCard.jsx` |
| **Context/Hooks**  | `ThemeContext.jsx`                                                                                                                                                                     |
| **Data**           | `exercises.json`, `hittData.js`, `nutritionData.js`, `rehabData.js`                                                                                                                    |
| **Utils**          | `workoutExport.js`, `workoutGenerator.js`                                                                                                                                              |

---

## 5. Overall Health Summary

| Metric            | Status          | Details                                                 |
| ----------------- | --------------- | ------------------------------------------------------- |
| **Build**         | PASS            | Clean build, no errors, good code splitting             |
| **Tests**         | PASS            | 78/78 passing                                           |
| **Lint Errors**   | PASS            | 0 errors                                                |
| **Lint Warnings** | NEEDS ATTENTION | 300 warnings (mostly unused imports)                    |
| **Formatting**    | NEEDS ATTENTION | 24 files need Prettier formatting                       |
| **Security**      | PASS            | No XSS risks (DOMPurify present), no external API calls |
| **Accessibility** | PARTIAL         | `useFocusTrap` hook exists for modals                   |
| **Bundle Size**   | NEEDS ATTENTION | ~700 KB gzipped, heavy export dependencies              |

### Top Recommendations (Read-Only - No Changes Made)

1. **Remove ~250+ unused icon imports** across all components - reduces cognitive load and marginally improves tree-shaking
2. **Remove dead code** - unused state variables, components, and functions (especially in PFTPrep.jsx and BodyComp.jsx)
3. **Run `npx prettier --write`** to fix all 24 files with formatting issues
4. **Consider lazy-loading export libraries** (xlsx, jspdf, html2canvas) only when user clicks "Export" - would save ~1 MB from initial bundle
5. **Add component-level tests** - current tests only cover utilities, not UI components
6. **Split `ThemeContext.jsx`** to separate the context provider from exported utilities for better React Fast Refresh support
