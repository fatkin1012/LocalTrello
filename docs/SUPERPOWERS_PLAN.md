# LocalTrello Feature Plan (Superpowers Workflow)

## Goal

Build a Trello-like MVP that is import-safe for ProjectOrbit static preview and can run with local fallback behavior when backend services are not available.

## Product Scope (MVP)

- One board view with multiple lists.
- Cards with title, description, labels, due date, and checklist summary.
- Create, edit, delete, and move cards.
- Reorder cards in the same list and across lists.
- Search/filter cards by text and label.

## Non-Functional Requirements

- Responsive on mobile and desktop.
- Critical actions cannot depend on hover-only interactions.
- Touch targets should be at least 44x44.
- Graceful fallback UI on API/auth/config failure.
- Build must output static `dist/index.html` for import preview.

## Superpowers Workflow

### 1) Brainstorming

- Confirm MVP boundaries and explicitly list what is out of scope.
- Confirm domain model and user flows.
- Confirm fallback behavior when API is unavailable.

Out of scope for v1:

- Multi-board collaboration
- Real-time sync
- Complex permission model
- Activity timeline and automation rules

### 2) Writing Plans

Break implementation into small tasks (2-5 minutes each), each with:

- exact file paths
- expected result
- verification command

### 3) Test-Driven Development

Follow RED -> GREEN -> REFACTOR for domain logic and state reducers first.

Initial tests:

- Create/update/delete card
- Move card between lists
- Reorder card in same list
- Filter cards by text and label
- Fallback state rendering when data source fails

### 4) Executing Plans / Subagent-Driven Development

Execute tasks in batches:

- Batch A: Data model + state actions + tests
- Batch B: Core board/list/card UI + tests
- Batch C: Drag/drop interactions + tests
- Batch D: Fallback/error/empty states + responsive polish

Gate after each batch:

- tests pass
- no TypeScript errors
- feature behavior matches spec

### 5) Requesting Code Review

Review priorities:

- behavioral regressions
- drag/drop edge cases
- state consistency after move/reorder
- accessibility and touch usability
- fallback behavior in import preview mode

### 6) Finishing Development Branch

Done criteria:

- `npm run typecheck` passes
- `npm run build` passes
- `dist/index.html` exists and references built assets
- fallback UI appears when API/auth is unavailable
- no horizontal overflow at common breakpoints

## Technical Plan

## Data Shape (draft)

```ts
export type Board = {
  id: string;
  title: string;
  listOrder: string[];
};

export type List = {
  id: string;
  boardId: string;
  title: string;
  cardOrder: string[];
};

export type Card = {
  id: string;
  listId: string;
  title: string;
  description?: string;
  labels: string[];
  dueDate?: string;
  checklistDone: number;
  checklistTotal: number;
};
```

## Proposed Milestones

1. Milestone 1: Board skeleton + local seed data + render lists/cards
2. Milestone 2: Card CRUD and list operations
3. Milestone 3: Move/reorder cards and keyboard-accessible controls
4. Milestone 4: Filters, fallback/error states, responsive improvements
5. Milestone 5: Contract verification and release checklist

## Contract Verification Checklist

- [ ] `README.md` present with run/build commands
- [ ] `npm run build` works from clean install
- [ ] `dist/index.html` exists
- [ ] generated HTML does not use `/src/...` entry
- [ ] first screen renders useful content quickly
- [ ] API/auth failure shows actionable fallback
- [ ] layout works on mobile and desktop without horizontal scroll

## Immediate Next Tasks

1. Create minimal app structure (`src/main.tsx`, app shell, board page).
2. Add state module with pure actions and first unit tests.
3. Implement list/card rendering from seed data.
4. Add create/edit/delete card interactions.
5. Add move/reorder card interactions and tests.
6. Implement fallback and retry UI for missing API config.
