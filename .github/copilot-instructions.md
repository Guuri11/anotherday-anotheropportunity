# Copilot Instructions for Another Day, Another Opportunity

## Language and Style

- **All code, comments, and documentation must be written in English**, regardless of the language used in the prompt or communication.

## Project Vision

Another Day, Another Opportunity is a mobile app designed to inspire users with motivational quotes and features that encourage daily positivity. The goal is to deliver a simple, beautiful, and customizable experience using modern React Native tooling and best practices.

---

## Architecture Principles

- **Client-only:** No backend code; all logic is client-side/mobile.
- **Component-driven:** UI is built from reusable, composable components.
- **Separation of concerns:** Keep UI, logic, and utilities modular and organized.
- **TypeScript-first:** Use strict typing and modern TypeScript features throughout.
- **Styling:** Use NativeWind v4 (Tailwind CSS for React Native) for all styles.

---

## Directory Structure

- `app/`: App entry, navigation, and screens (e.g., `_layout.tsx`, `index.tsx`).
- `components/ui/`: Reusable UI primitives (e.g., `button.tsx`, `card.tsx`).
- `components/`: Project-specific components (e.g., `ThemeToggle.tsx`).
- `lib/icons/`: Centralized icon components.
- `lib/`: Utilities and hooks (e.g., `useColorScheme.tsx`).
- `assets/`: Images and static assets.
- `global.css`, `tailwind.config.js`: Styling configuration.
- `brainstorming.md`: User stories and MVP feature ideas.

---

## Best Practices

- **Functional components only.**
- **Use `className` for styling** (never inline styles).
- **Lowercase for files, PascalCase for components.**
- **No business logic in UI components**—extract to hooks/utilities in `lib/` if needed.
- **Icons:** Add new icons to `lib/icons/` and import as components.
- **Theme:** Support light/dark mode using `ThemeToggle.tsx` and `useColorScheme.tsx`.
- **No hardcoded strings for user-facing text**—centralize in a constants file if needed.

---

## Internationalization (i18n)

- All user-facing text (UI, errors, notifications) must use i18n keys defined in `lib/locales/` (e.g., `en.json`, `es.json`).
- Never use hardcoded human-readable strings in UI or logic. Always use i18n keys and translation functions.
- Add new keys to both `en.json` and `es.json` and ensure all flows are covered in both languages.
- Use a translation library (e.g., `i18next`, `react-i18next`, or similar) for all translations and message formatting.
- When adding or updating features, update the i18n files and use the translation function in all components and logic.

---

## Developer Workflows

- **Start app:** `npx expo start`
- **Add UI component:** Copy from `components/ui/` and adapt as needed.
- **Add icon:** Place new icon in `lib/icons/`.
- **Add screen:** Create new file in `app/` and update `_layout.tsx` if needed.
- **Styling:** Edit `tailwind.config.js` and `global.css` for theme/colors.
- **Reference:** See `README.md` for overview and `brainstorming.md` for user stories.

---

## How to Work with User Stories

All features are defined and prioritized as user stories in `brainstorming.md`. Each story follows this format:

**Como** [tipo de usuario]
**Cuando** [situación]
**Quiero** [acción o funcionalidad]
**Para** [objetivo o beneficio]

Criterios de aceptación:

- (bulleted list)

### Step-by-step process for implementing a user story:

1. **Read and analyze the user story and acceptance criteria.**
2. **Identify required UI, logic, and data flows.**
3. **Locate or create relevant files:**

- UI: `components/ui/`, `components/`, `app/`
- Logic/hooks: `lib/`
- Icons: `lib/icons/`

4. **Contract first:** If new data structures/constants are needed, define them before UI/logic.
5. **Implement UI and logic:**

- Use functional components and NativeWind for styling.
- Extract logic to hooks/utilities if reusable.

6. **Check acceptance criteria:** Ensure all are met before considering the story done.
7. **Manual test:** Run the app and verify the new/changed flow.
8. **Document:** Update `brainstorming.md` if the story is complete or needs notes.

**Example user story:**

Como usuario que busca inspiración
Cuando abro la app cada día
Quiero recibir una frase motivacional nueva
Para empezar el día con energía positiva

Criterios de aceptación:

- Al abrir la app, se muestra una frase motivacional diferente cada día.
- La frase es clara y legible.

---

## Tooling & Quality

- Use scripts in `package.json` for build, dev, lint, and format.
- Use ESLint and Prettier as configured.
- All code, comments, and docs can be in Spanish or English (según contexto del repo).
- If unsure about a requirement, prefer to ask for clarification before making assumptions.

---

## For AI agents

- Always follow the above conventions and directory structure.
- Reference and implement user stories from `brainstorming.md`.
- When in doubt, look for similar patterns in `components/ui/` and `lib/icons/`.
- Keep code modular and consistent with existing examples.
