# Crestwod Manager

Personal Business & Net Worth Dashboard for a founder. iOS-first prototype.

## Stack

- Expo SDK 55, React Native 0.81, React 19
- TypeScript with `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- expo-router (file-based) for navigation
- Reanimated 4 + react-native-worklets for animations
- @gorhom/bottom-sheet for modal sheets
- expo-blur + expo-linear-gradient for glassmorphism
- react-native-svg for charts (single trend line — keep it lightweight)
- react-native-pdf for PDF rendering (requires `expo prebuild` + dev client; will not run in Expo Go)

## Hard rules

1. **No `any`.** TS strict; if you reach for `any` you've taken a wrong turn.
2. **Colors come from `theme/theme.ts`.** `grep -RE "#[0-9a-fA-F]{3,8}"` should match nothing outside `theme/`. No raw hex literals in components.
3. **Every card uses `components/glass/GlassCard.tsx`.** Never style a `View` to look glassy ad-hoc.
4. **Numbers are the visual hero** — large, bold, clear. Labels are minimal.
5. **Data flows through `lib/data/*`.** UI never imports from `lib/mock/*` directly. Replacing the mock with Supabase happens at this seam — no UI changes.
6. **iPhone 15 Pro is the target frame.** Hero/businesses/assets-liabilities/chart/profile must fit above the fold (393×852pt safe-area).

## Layout

```
app/                  expo-router root (index = NetWorthDashboard, /documents = list, /documents/[id] = detail)
components/glass/     GlassCard, GlassPill — glass primitives
components/dashboard/ Dashboard sections (Hero, BusinessRail, AssetsLiabilities, NetWorthChart, ProfileBlock, DocumentsRail)
components/documents/ Filter tabs, rows, upload sheet, viewers, investor mode
theme/                Tokens + ThemeProvider
types/                netWorth.ts (Business/Asset/Liability/Snapshot/Profile), business.ts (Document)
lib/format.ts         Currency, percent, date, bytes, initials formatters
lib/data/             Async accessors — Supabase swap seam
lib/mock/             Seed data only; never imported by UI
providers/            NetWorthProvider, DocumentsProvider (context + useReducer)
```

## Animation

GSAP doesn't run natively in React Native. Use **Reanimated 4** (worklets-based) for all motion: hero number count-up, chart line draw-in, card entrance fades, press-scale on glass cards. Same feel, native perf.

## Document type vs category

`Document.type: 'pdf' | 'image' | 'note' | 'link'` drives the *viewer* (which component renders it).
`Document.category: 'pitch' | 'financial' | 'legal' | 'screenshot' | 'note' | 'other'` drives the *taxonomy* (filter tabs, upload selector). The original spec collapsed these into one enum; they're orthogonal in the UI, so we split them. Future Supabase schema should mirror this split.

## Investor View

Toggle in `DocumentsScreen` header. When on:
- List filters to `isInvestorReady === true`.
- All edit affordances hide (no `+`, no row swipe-edit, no "Edit" buttons inside detail screens).
- Header swaps to `InvestorHeader` showing the active business name only.

## Verification

```
npm run typecheck            # tsc strict, must pass with 0 errors
npx expo start --ios         # boot in Expo Go (PDF will show fallback)
npx expo prebuild --platform ios && npx expo run:ios   # full native PDF
```
