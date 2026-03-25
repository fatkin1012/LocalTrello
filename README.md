# LocalTrello

A lightweight, three-tier Trello-like task management app built with React + TypeScript + Vite. Organize your work into daily general tasks, project boards, and nested project-specific tasks—all with drag-and-drop reordering and local storage persistence.

## Features

- **Three-tier board hierarchy**: Daily general tasks → Projects → Per-project nested tasks
- **Drag-and-drop reordering**: Move cards between columns on any board
- **Conditional navigation**: Click "Enter Task Board" on project cards to view nested tasks
- **Delete functionality**: Remove cards from Done/Completed columns across all board levels
- **Local persistence**: All data automatically saved to browser localStorage
- **Responsive design**: Works on desktop with clean, minimal UI

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev      # Start dev server on http://localhost:5173
npm run build    # Build for production
npm run start    # Preview production build
npm run typecheck # Run TypeScript type checking
```

## How to Use

1. **Start**: Launch the app and you'll see the daily general tasks board (top) and projects board (below it)
2. **Add tasks**: Click "Add" in any column to create new cards
3. **Move cards**: Drag cards between columns to change their status
4. **View project tasks**: Click "Enter Task Board" on any project card with nested tasks
5. **Delete tasks**: Cards in Done/Completed columns show a Delete button
6. **Data persists**: Everything is saved automatically to localStorage

## Project Structure

```
src/
  GeneratedFeatureRoot.tsx  # Main app component with all state, UI, and drag logic
  main.tsx                  # React entry point
index.html                  # Vite HTML template
package.json              # Dependencies and scripts
tsconfig.json             # TypeScript configuration
```

## Technical Stack

- **React** + **TypeScript**: Type-safe UI components
- **Vite**: Fast build and dev server
- **localStorage**: Client-side persistence (key: `localtrello.v1`)
- **HTML5 Drag API**: Native drag-and-drop without external libraries
- **CSS-in-JS**: Inline styles for minimal bundle size

## Data Storage

Task data is stored in browser localStorage under the key `localtrello.v1`. This data is **not** included in version control (see `.gitignore`).

### Backup Your Data

To export your tasks:
1. Open browser DevTools (F12)
2. Run: `copy(localStorage.getItem('localtrello.v1'))`
3. Save to a `.json` file

To restore:
1. Open browser DevTools
2. Run: `localStorage.setItem('localtrello.v1', '<paste-your-json-here>')`

## Import Contract (ProjectOrbit)

This project follows the import contract in `CONTRIBUTING.md`:

- `package.json` includes required `dev` and `build` scripts
- Production build generates static output at `dist/index.html`
- Build artifacts reference bundled assets, not runtime source entries
- UI renders meaningful content without external dependencies
- Design is responsive on desktop and mobile

Detailed execution plan is in `docs/SUPERPOWERS_PLAN.md`.
