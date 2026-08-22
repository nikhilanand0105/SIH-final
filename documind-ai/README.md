# DocuMind AI

Unified mobile frontend merging four Replit-generated UI implementations into one Expo application.

**DocuMind AI** — AI-Powered Document Intelligence Platform

## Stack

- Expo 54 + React Native 0.81
- Expo Router (file-based navigation)
- TypeScript (strict)
- Mock services (no backend)

## Run

```bash
cd documind-ai
npm install
npm start
```

## Structure

- `app/` — screens and navigation (Expo Router)
- `components/` — UI, scanner, intelligence widgets
- `mockData/` — sample documents, comparison, graph, reports, chat
- `services/` — mock service layer for future API integration
- `types/` — shared TypeScript types
- `theme/` — colors via `constants/colors.ts` + `hooks/useColors.ts`

## Merged from

| Source | Contributions |
|--------|----------------|
| DocuMind-Polish | Base shell, navigation, dashboard, auth, processing |
| Entity-Explorer | Knowledge graph, reports, settings, notifications, profile edit |
| DocuMind-Workflow | Evidence cards, 8-stage processing, comparison UX, upload states, AI scope |
| Attached-Assets | Shared mock data patterns (same family as Polish) |

## Scanner

`components/scanner/DocumentScanner.tsx` is a replaceable UI surface for the future Prince camera integration.
