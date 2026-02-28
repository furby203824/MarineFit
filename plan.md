# Implementation Plan: MARADMIN 066/26 & 073/26 Policy Updates

## Policy Summary (Key Changes)

MARADMIN 066/26 (Change 1) and 073/26 (Change 2) replace the old height/weight-based body composition evaluation with a **Waist-to-Height Ratio (WHtR)** methodology, effective 1 Jan 2026. Key changes:

1. **WHtR standard is ≤ 0.52** (regardless of sex) — Change 2 (073/26) corrected this from "< 0.52" to "≤ 0.52"
2. **Official Height/Max Waist lookup table** provided (53"–84")
3. **Body fat evaluation** required only for Marines exceeding WHtR; two authorized methods: multi-site tape test and BIA (Bioelectrical Impedance Analysis)
4. **Physical Performance Considerations** — Marines with high PFT/CFT scores get extended body fat allowances:
   - ≥285 PFT **and** CFT → up to 26% male / 36% female
   - ≥250 PFT **and** CFT → +1% above age-group max (capped at 26% male / 36% female)
5. Measurements round **down** to nearest ½ inch (already implemented in app)

---

## Current App vs. Policy — Gap Analysis

| Area                                | Current App                                                        | MARADMIN Requires                                                             |
| ----------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| WHtR standard                       | `< 0.55` (DoD 1308.03)                                             | `≤ 0.52` (USMC-specific)                                                      |
| Classification tiers                | 3 tiers: Optimal (<0.50), Compliant (0.50–0.54), High Risk (≥0.55) | Binary: Within Standards (≤0.52) or Exceeds (>0.52) — secondary eval required |
| Height/Max Waist table              | Not present                                                        | Full table from para. 6 (53"–84") needed                                      |
| Body fat eval flow                  | Just flags "secondary eval needed"                                 | Full flow: WHtR → body fat (tape or BIA) → performance considerations         |
| Physical performance considerations | Not present                                                        | PFT/CFT score-based body fat allowances                                       |
| BIA option                          | Not mentioned                                                      | Authorized method alongside tape test                                         |
| Policy reference                    | "DoD Instruction 1308.03"                                          | "MARADMIN 066/26" (as modified by 073/26)                                     |
| Standards modal                     | Old 3-tier WHtR table + old body fat table                         | Updated tables matching policy                                                |

---

## Implementation Steps

### Step 1: Add WHtR Height/Max Waist Lookup Table Data

**File:** `src/data/bodyCompData.js` (new)

- Create a data file with the official height-to-max-waist table from paragraph 6
- Export the lookup table as a structured array/object
- Include body fat standards by age group (unchanged from MCO 6110.3A)
- Include physical performance consideration thresholds (285/250 with body fat caps)

### Step 2: Add Body Composition Utility Functions

**File:** `src/utils/bodyCompScoring.js` (new)

- `calculateWHtR(height, waist)` — compute ratio with rounding rules
- `isWithinWHtR(height, waist)` — binary pass/fail at ≤0.52
- `getMaxWaist(height)` — lookup max waist from the official table
- `getBodyFatLimit(gender, ageGroup, pftScore, cftScore)` — return the applicable body fat max considering performance considerations
- `evaluateBodyComp(height, waist, gender, ageGroup, bodyFatPercent, pftScore, cftScore)` — full evaluation flow returning structured result

### Step 3: Update BodyComp Component — WHtR Calculator

**File:** `src/components/BodyComp.jsx`

- Update the info text from "DoD Instruction 1308.03 / WHtR < 0.55" to "MARADMIN 066/26 / WHtR ≤ 0.52"
- Update `calculateWhtr()` logic: replace 3-tier classification with binary pass/fail at ≤0.52
- Show max waist for the entered height (from the lookup table)
- When WHtR is exceeded, expand the form to collect additional inputs for body fat evaluation:
  - Body fat % (from tape test or BIA)
  - PFT score and CFT score (for performance considerations)
- Display the full evaluation result (within standards, needs body fat eval, BCP assignment, etc.)

### Step 4: Update the Standards Modal

**File:** `src/components/BodyComp.jsx` (BodyCompStandardsModal)

- Replace the 3-tier WHtR table with the official Height/Max Waist lookup table (scrollable)
- Update body fat standards table if needed
- Add a section explaining physical performance considerations
- Reference MARADMIN 066/26 (as modified by 073/26)

### Step 5: Update Tests

**File:** `src/__tests__/bodyCompScoring.test.js` (new)

- Test WHtR calculation with rounding
- Test pass/fail at the ≤0.52 boundary
- Test max waist lookup
- Test physical performance consideration thresholds
- Test full evaluation flow (pass WHtR, fail WHtR + pass body fat, fail both, etc.)

### Step 6: Update Dashboard Description

**File:** `src/components/Dashboard.jsx`

- Update the Body Composition card description to reference the new USMC WHtR standard
