# MarineFit

A fitness application built for USMC personnel to prepare for PFT/CFT, generate HITT-based workouts, and optimize recovery.

## Features

- **PT Coach** - Generate workouts based on USMC HITT program with 161 exercises and official DVIDSHUB video links
- **PFT/CFT Calculator** - Score calculator with age-group-specific tables and "solve for X" goal planner
- **Body Composition** - Calculate body fat percentage using USMC tape test standards
- **Nutrition Guide** - Marine Corps nutrition principles and meal timing guidance
- **Injury Prevention** - Pre-habilitation exercises, mobility library, and recovery protocols
- **Sleep Optimizer** - Sleep hygiene, circadian rhythm guidance, tactical napping protocols

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router (HashRouter for GitHub Pages)
- Local Storage (no backend required)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Help Wanted

We're looking for contributors to help improve MarineFit. Below are features and improvements we'd love help implementing:

### High Priority

| Feature | Description | Difficulty |
|---------|-------------|------------|
| **Workout Timer** | Built-in interval timer that follows the generated workout (rest periods, exercise duration) | Medium |
| **Workout Logging** | Allow users to log completed workouts with actual reps/weights performed | Medium |
| **Progress Charts** | Visualize PFT/CFT scores and body composition over time using localStorage history | Medium |
| **PWA Support** | Add service worker and manifest for offline use and "Add to Home Screen" | Easy-Medium |

### Medium Priority

| Feature | Description | Difficulty |
|---------|-------------|------------|
| **PFT/CFT Training Plans** | Multi-week periodized programs targeting specific score goals | Medium |
| **Exercise Search/Filter** | Search the 161-exercise database by name, muscle group, or equipment | Easy |
| **Workout Calendar** | Weekly/monthly view to schedule and track workouts | Medium |
| **Dark Mode** | System-preference-aware dark theme | Easy |
| **Print Workout** | Generate printable PDF of current workout | Easy |

### Lower Priority / Nice to Have

| Feature | Description | Difficulty |
|---------|-------------|------------|
| **Workout Sharing** | Export/import workouts via shareable links or QR codes | Medium |
| **Voice Cues** | Audio announcements during timed workouts | Medium |
| **Stretch/Cooldown Generator** | Auto-generate cooldown based on muscles worked | Easy |
| **Unit Converter** | Toggle between metric/imperial for all measurements | Easy |
| **Accessibility Audit** | WCAG compliance review and fixes | Medium |

### Bug Fixes & Improvements

- [ ] Add loading states for workout generation
- [ ] Improve mobile responsiveness on smaller screens
- [ ] Add form validation with helpful error messages
- [ ] Write unit tests for scoring functions (`pftScoring.js`, `cftScoring.js`)
- [ ] Add E2E tests with Playwright or Cypress

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/workout-timer`)
3. Make your changes
4. Ensure the build passes (`npm run build`)
5. Submit a Pull Request with a clear description

### Code Style

- Use functional components with hooks
- Follow existing Tailwind CSS patterns
- Use Framer Motion for animations
- Keep components focused and reasonably sized

### Project Structure

```
src/
├── components/     # React components (one per page/feature)
├── data/           # Static data (hittData.js exercises)
├── utils/          # Scoring functions, workout generator
└── App.jsx         # Router and layout
```

---

## License

MIT

## Acknowledgments

- Exercise videos from [DVIDSHUB](https://www.dvidshub.net/) (Official DoD visual information)
- USMC PFT/CFT scoring tables from official Marine Corps Order
