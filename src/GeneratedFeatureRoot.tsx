import React from "react";

type Column = {
  id: string;
  title: string;
};

type Card = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  dueDate?: string;
};

type BoardState = {
  columns: Column[];
  cardsByColumn: Record<string, Card[]>;
};

type ProjectBoardMap = Record<string, BoardState>;

type PersistedState = {
  dailyBoard: BoardState;
  generalBoard: BoardState;
  projectBoards: ProjectBoardMap;
};

type DragState = {
  boardType: "daily" | "general" | "project";
  fromColumnId: string;
  cardId: string;
};

type CreateCardMode = "daily" | "project" | "task";

type NewCardForm = {
  title: string;
  description: string;
  category: string;
  dueDate: string;
};

type EditTarget = {
  boardType: "daily" | "general" | "project";
  columnId: string;
  cardId: string;
};

const STORAGE_KEY = "localtrello.v1";

const GENERAL_COLUMNS: Column[] = [
  { id: "idea", title: "Project Ideas" },
  { id: "active", title: "Active Projects" },
  { id: "done", title: "Completed" },
];

const DAILY_COLUMNS: Column[] = [
  { id: "todo", title: "Daily To Do" },
  { id: "doing", title: "In Progress" },
  { id: "done", title: "Done" },
];

const TASK_COLUMNS: Column[] = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function createProjectTaskBoard(projectName: string): BoardState {
  return {
    columns: TASK_COLUMNS,
    cardsByColumn: {
      todo: [
        {
          id: makeId("task"),
          title: `Define scope for ${projectName}`,
          description: "List MVP goals and delivery timeline.",
        },
        {
          id: makeId("task"),
          title: "Break down first sprint",
          description: "Create 2-5 minute implementation tasks.",
        },
      ],
      doing: [],
      review: [],
      done: [],
    },
  };
}

function initialState(): PersistedState {
  const websiteId = makeId("project");
  const appId = makeId("project");

  return {
    dailyBoard: {
      columns: DAILY_COLUMNS,
      cardsByColumn: {
        todo: [
          {
            id: makeId("daily"),
            title: "Daily standup notes",
            description: "Capture blockers and priorities for today.",
          },
          {
            id: makeId("daily"),
            title: "Inbox triage",
            description: "Clear urgent emails and quick admin tasks.",
          },
        ],
        doing: [],
        done: [],
      },
    },
    generalBoard: {
      columns: GENERAL_COLUMNS,
      cardsByColumn: {
        idea: [
          {
            id: websiteId,
            title: "Marketing Website Refresh",
            description: "Public website redesign for Q2 campaign.",
          },
        ],
        active: [
          {
            id: appId,
            title: "LocalTrello MVP",
            description: "Build a two-layer board workflow for project delivery.",
          },
        ],
        done: [],
      },
    },
    projectBoards: {
      [websiteId]: createProjectTaskBoard("Marketing Website Refresh"),
      [appId]: createProjectTaskBoard("LocalTrello MVP"),
    },
  };
}

function moveCard(
  board: BoardState,
  fromColumnId: string,
  toColumnId: string,
  cardId: string,
): BoardState {
  if (fromColumnId === toColumnId) {
    return board;
  }

  const fromCards = board.cardsByColumn[fromColumnId] ?? [];
  const toCards = board.cardsByColumn[toColumnId] ?? [];
  const target = fromCards.find((card) => card.id === cardId);

  if (!target) {
    return board;
  }

  return {
    ...board,
    cardsByColumn: {
      ...board.cardsByColumn,
      [fromColumnId]: fromCards.filter((card) => card.id !== cardId),
      [toColumnId]: [...toCards, target],
    },
  };
}

function columnIndex(columns: Column[], columnId: string): number {
  return columns.findIndex((column) => column.id === columnId);
}

function EditIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EnterIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M14 3h7v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14 21 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeleteIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M3 6h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GeneratedFeatureRoot(): JSX.Element {
  const [state, setState] = React.useState<PersistedState>(() => initialState());
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null);
  const [createCardMode, setCreateCardMode] = React.useState<CreateCardMode | null>(null);
  const [newCardForm, setNewCardForm] = React.useState<NewCardForm>({
    title: "",
    description: "",
    category: "",
    dueDate: "",
  });
  const [editTarget, setEditTarget] = React.useState<EditTarget | null>(null);
  const [dragState, setDragState] = React.useState<DragState | null>(null);
  const [dropColumnId, setDropColumnId] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        const seed = initialState();
        setState({
          dailyBoard: parsed.dailyBoard ?? seed.dailyBoard,
          generalBoard: parsed.generalBoard ?? seed.generalBoard,
          projectBoards: parsed.projectBoards ?? seed.projectBoards,
        });
      }
    } catch {
      setState(initialState());
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeProjectCard = React.useMemo(() => {
    if (!activeProjectId) {
      return null;
    }

    for (const column of state.generalBoard.columns) {
      const card = (state.generalBoard.cardsByColumn[column.id] ?? []).find(
        (item) => item.id === activeProjectId,
      );
      if (card) {
        return card;
      }
    }

    return null;
  }, [activeProjectId, state.generalBoard.cardsByColumn, state.generalBoard.columns]);

  const activeProjectBoard = activeProjectId
    ? state.projectBoards[activeProjectId] ?? createProjectTaskBoard("Project")
    : null;
  const activeProjectColumns = activeProjectBoard?.columns ?? [];

  const addProject = (form: NewCardForm): void => {
    const title = form.title.trim();
    if (!title) {
      return;
    }

    const projectId = makeId("project");
    const newCard: Card = {
      id: projectId,
      title,
      description:
        form.description.trim() || "Click to enter this project's task board.",
      category: form.category.trim(),
      dueDate: form.dueDate,
    };

    setState((prev) => ({
      ...prev,
      generalBoard: {
        ...prev.generalBoard,
        cardsByColumn: {
          ...prev.generalBoard.cardsByColumn,
          idea: [...(prev.generalBoard.cardsByColumn.idea ?? []), newCard],
        },
      },
      projectBoards: {
        ...prev.projectBoards,
        [projectId]: createProjectTaskBoard(title),
      },
    }));
  };

  const addDailyTask = (form: NewCardForm): void => {
    const title = form.title.trim();
    if (!title) {
      return;
    }

    setState((prev) => {
      const todoCards = prev.dailyBoard.cardsByColumn.todo ?? [];
      return {
        ...prev,
        dailyBoard: {
          ...prev.dailyBoard,
          cardsByColumn: {
            ...prev.dailyBoard.cardsByColumn,
            todo: [
              ...todoCards,
              {
                id: makeId("daily"),
                title,
                description: form.description.trim(),
                category: form.category.trim(),
                dueDate: form.dueDate,
              },
            ],
          },
        },
      };
    });
  };

  const addTask = (form: NewCardForm): void => {
    if (!activeProjectId) {
      return;
    }

    const title = form.title.trim();
    if (!title) {
      return;
    }

    setState((prev) => {
      const board =
        prev.projectBoards[activeProjectId] ?? createProjectTaskBoard("Project");
      const todoCards = board.cardsByColumn.todo ?? [];

      return {
        ...prev,
        projectBoards: {
          ...prev.projectBoards,
          [activeProjectId]: {
            ...board,
            cardsByColumn: {
              ...board.cardsByColumn,
              todo: [
                ...todoCards,
                {
                  id: makeId("task"),
                  title,
                  description: form.description.trim(),
                  category: form.category.trim(),
                  dueDate: form.dueDate,
                },
              ],
            },
          },
        },
      };
    });
  };

  const updateDailyCard = (columnId: string, cardId: string, form: NewCardForm): void => {
    setState((prev) => {
      const cards = prev.dailyBoard.cardsByColumn[columnId] ?? [];

      return {
        ...prev,
        dailyBoard: {
          ...prev.dailyBoard,
          cardsByColumn: {
            ...prev.dailyBoard.cardsByColumn,
            [columnId]: cards.map((card) =>
              card.id === cardId
                ? {
                    ...card,
                    title: form.title.trim(),
                    description: form.description.trim(),
                    category: form.category.trim(),
                    dueDate: form.dueDate,
                  }
                : card,
            ),
          },
        },
      };
    });
  };

  const updateProjectCard = (columnId: string, cardId: string, form: NewCardForm): void => {
    setState((prev) => {
      const cards = prev.generalBoard.cardsByColumn[columnId] ?? [];

      return {
        ...prev,
        generalBoard: {
          ...prev.generalBoard,
          cardsByColumn: {
            ...prev.generalBoard.cardsByColumn,
            [columnId]: cards.map((card) =>
              card.id === cardId
                ? {
                    ...card,
                    title: form.title.trim(),
                    description: form.description.trim(),
                    category: form.category.trim(),
                    dueDate: form.dueDate,
                  }
                : card,
            ),
          },
        },
      };
    });
  };

  const updateTaskCard = (columnId: string, cardId: string, form: NewCardForm): void => {
    if (!activeProjectId) {
      return;
    }

    setState((prev) => {
      const board =
        prev.projectBoards[activeProjectId] ?? createProjectTaskBoard("Project");
      const cards = board.cardsByColumn[columnId] ?? [];

      return {
        ...prev,
        projectBoards: {
          ...prev.projectBoards,
          [activeProjectId]: {
            ...board,
            cardsByColumn: {
              ...board.cardsByColumn,
              [columnId]: cards.map((card) =>
                card.id === cardId
                  ? {
                      ...card,
                      title: form.title.trim(),
                      description: form.description.trim(),
                      category: form.category.trim(),
                      dueDate: form.dueDate,
                    }
                  : card,
              ),
            },
          },
        },
      };
    });
  };

  const moveInGeneralBoard = (fromColumnId: string, toColumnId: string, cardId: string): void => {
    setState((prev) => ({
      ...prev,
      generalBoard: moveCard(prev.generalBoard, fromColumnId, toColumnId, cardId),
    }));
  };

  const moveInDailyBoard = (fromColumnId: string, toColumnId: string, cardId: string): void => {
    setState((prev) => ({
      ...prev,
      dailyBoard: moveCard(prev.dailyBoard, fromColumnId, toColumnId, cardId),
    }));
  };

  const moveInProjectBoard = (
    fromColumnId: string,
    toColumnId: string,
    cardId: string,
  ): void => {
    if (!activeProjectId) {
      return;
    }

    setState((prev) => {
      const board =
        prev.projectBoards[activeProjectId] ?? createProjectTaskBoard("Project");

      return {
        ...prev,
        projectBoards: {
          ...prev.projectBoards,
          [activeProjectId]: moveCard(board, fromColumnId, toColumnId, cardId),
        },
      };
    });
  };

  const deleteDailyDoneCard = (cardId: string): void => {
    setState((prev) => ({
      ...prev,
      dailyBoard: {
        ...prev.dailyBoard,
        cardsByColumn: {
          ...prev.dailyBoard.cardsByColumn,
          done: (prev.dailyBoard.cardsByColumn.done ?? []).filter(
            (card) => card.id !== cardId,
          ),
        },
      },
    }));
  };

  const deleteCompletedProjectCard = (cardId: string): void => {
    setState((prev) => {
      const nextProjectBoards = { ...prev.projectBoards };
      delete nextProjectBoards[cardId];

      return {
        ...prev,
        generalBoard: {
          ...prev.generalBoard,
          cardsByColumn: {
            ...prev.generalBoard.cardsByColumn,
            done: (prev.generalBoard.cardsByColumn.done ?? []).filter(
              (card) => card.id !== cardId,
            ),
          },
        },
        projectBoards: nextProjectBoards,
      };
    });
  };

  const deleteDoneTaskCard = (cardId: string): void => {
    if (!activeProjectId) {
      return;
    }

    setState((prev) => {
      const board =
        prev.projectBoards[activeProjectId] ?? createProjectTaskBoard("Project");

      return {
        ...prev,
        projectBoards: {
          ...prev.projectBoards,
          [activeProjectId]: {
            ...board,
            cardsByColumn: {
              ...board.cardsByColumn,
              done: (board.cardsByColumn.done ?? []).filter(
                (card) => card.id !== cardId,
              ),
            },
          },
        },
      };
    });
  };

  const onCardDragStart = (
    boardType: "daily" | "general" | "project",
    fromColumnId: string,
    cardId: string,
  ): void => {
    setDragState({ boardType, fromColumnId, cardId });
  };

  const onCardDragEnd = (): void => {
    setDragState(null);
    setDropColumnId(null);
  };

  const onColumnDragOver = (columnId: string, event: React.DragEvent): void => {
    event.preventDefault();
    setDropColumnId(columnId);
  };

  const onGeneralColumnDrop = (toColumnId: string): void => {
    if (!dragState || dragState.boardType !== "general") {
      return;
    }

    moveInGeneralBoard(dragState.fromColumnId, toColumnId, dragState.cardId);
    setDragState(null);
    setDropColumnId(null);
  };

  const onDailyColumnDrop = (toColumnId: string): void => {
    if (!dragState || dragState.boardType !== "daily") {
      return;
    }

    moveInDailyBoard(dragState.fromColumnId, toColumnId, dragState.cardId);
    setDragState(null);
    setDropColumnId(null);
  };

  const onProjectColumnDrop = (toColumnId: string): void => {
    if (!dragState || dragState.boardType !== "project") {
      return;
    }

    moveInProjectBoard(dragState.fromColumnId, toColumnId, dragState.cardId);
    setDragState(null);
    setDropColumnId(null);
  };

  const openCreateCardModal = (mode: CreateCardMode): void => {
    if (mode === "task" && !activeProjectId) {
      return;
    }

    setCreateCardMode(mode);
    setEditTarget(null);
    setNewCardForm({
      title: "",
      description: "",
      category: "",
      dueDate: "",
    });
  };

  const openEditCardModal = (
    target: EditTarget,
    mode: CreateCardMode,
    card: Card,
  ): void => {
    setCreateCardMode(mode);
    setEditTarget(target);
    setNewCardForm({
      title: card.title,
      description: card.description ?? "",
      category: card.category ?? "",
      dueDate: card.dueDate ?? "",
    });
  };

  const closeCreateCardModal = (): void => {
    setCreateCardMode(null);
    setEditTarget(null);
  };

  const onCreateCardSubmit = (event: React.FormEvent): void => {
    event.preventDefault();

    if (!createCardMode) {
      return;
    }

    if (!newCardForm.title.trim()) {
      return;
    }

    if (editTarget) {
      if (editTarget.boardType === "daily") {
        updateDailyCard(editTarget.columnId, editTarget.cardId, newCardForm);
      }

      if (editTarget.boardType === "general") {
        updateProjectCard(editTarget.columnId, editTarget.cardId, newCardForm);
      }

      if (editTarget.boardType === "project") {
        updateTaskCard(editTarget.columnId, editTarget.cardId, newCardForm);
      }

      closeCreateCardModal();
      return;
    }

    if (createCardMode === "daily") {
      addDailyTask(newCardForm);
    }

    if (createCardMode === "project") {
      addProject(newCardForm);
    }

    if (createCardMode === "task") {
      addTask(newCardForm);
    }

    closeCreateCardModal();
  };

  const modalTitle =
    editTarget && createCardMode === "daily"
      ? "Edit Daily Task"
      : editTarget && createCardMode === "project"
        ? "Edit Project Card"
        : editTarget && createCardMode === "task"
          ? "Edit Task"
          : createCardMode === "daily"
            ? "Create Daily Task"
            : createCardMode === "project"
              ? "Create Project Card"
              : "Create Task";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 10%, #fff8e8 0%, #f4efe5 35%, #e7ecee 100%)",
        color: "#1f2a33",
        fontFamily: "'Space Grotesk', 'Avenir Next', 'Segoe UI', sans-serif",
      }}
    >
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        {!activeProjectId ? (
          <section>
            <div
              style={{
                background: "#fcfffb",
                border: "1px solid #cad8cc",
                borderRadius: 14,
                padding: 14,
                marginBottom: 18,
              }}
            >
              <h2 style={{ margin: "0 0 10px" }}>General Board (Daily Tasks)</h2>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 14,
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 700 }}>Add daily task</span>
                <button
                  type="button"
                  onClick={() => openCreateCardModal("daily")}
                  style={{
                    minHeight: 44,
                    border: "none",
                    borderRadius: 10,
                    padding: "0 16px",
                    background: "#2f6e3f",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Create Daily Task
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 12,
                }}
              >
                {state.dailyBoard.columns.map((column) => (
                  <article
                    key={column.id}
                    onDragOver={(event) => onColumnDragOver(column.id, event)}
                    onDrop={() => onDailyColumnDrop(column.id)}
                    onDragLeave={() => setDropColumnId(null)}
                    style={{
                      background: "#ffffffea",
                      border:
                        dropColumnId === column.id
                          ? "2px solid #2f6e3f"
                          : "1px solid #c9d6cd",
                      borderRadius: 12,
                      padding: 12,
                      minHeight: 210,
                      transition: "border-color 160ms ease",
                    }}
                  >
                    <h3 style={{ marginTop: 0 }}>{column.title}</h3>
                    <div style={{ display: "grid", gap: 10 }}>
                      {(state.dailyBoard.cardsByColumn[column.id] ?? []).map((card) => (
                        <div
                          key={card.id}
                          draggable
                          onDragStart={() => onCardDragStart("daily", column.id, card.id)}
                          onDragEnd={onCardDragEnd}
                          style={{
                            border: "1px solid #d5dce0",
                            borderRadius: 10,
                            padding: 10,
                            background: "#f8fbfc",
                            cursor: "grab",
                          }}
                        >
                          <strong style={{ display: "block", marginBottom: 6 }}>
                            {card.title}
                          </strong>
                          {card.description ? (
                            <p
                              style={{
                                margin: "0",
                                color: "#5c6b74",
                                fontSize: 14,
                              }}
                            >
                              {card.description}
                            </p>
                          ) : null}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              marginTop: 10,
                              gap: 8,
                            }}
                          >
                            <button
                              type="button"
                              aria-label="Edit card"
                              title="Edit"
                              onClick={() =>
                                openEditCardModal(
                                  {
                                    boardType: "daily",
                                    columnId: column.id,
                                    cardId: card.id,
                                  },
                                  "daily",
                                  card,
                                )
                              }
                              style={{
                                minWidth: 44,
                                minHeight: 44,
                                borderRadius: 8,
                                border: "1px solid #3b6f7d",
                                background: "#edf8fb",
                                color: "#134452",
                                display: "grid",
                                placeItems: "center",
                                cursor: "pointer",
                              }}
                            >
                              <EditIcon />
                            </button>
                            {column.id === "done" ? (
                              <button
                                type="button"
                                aria-label="Delete card"
                                title="Delete"
                                onClick={() => deleteDailyDoneCard(card.id)}
                                style={{
                                  minWidth: 44,
                                  minHeight: 44,
                                  borderRadius: 8,
                                  border: "1px solid #a63a3a",
                                  background: "#fdecec",
                                  color: "#7a1f1f",
                                  display: "grid",
                                  placeItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <DeleteIcon />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#fffdf9",
                border: "1px solid #d9d2c6",
                borderRadius: 14,
                padding: 14,
              }}
            >
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 14,
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 700 }}>Add project</span>
              <button
                type="button"
                onClick={() => openCreateCardModal("project")}
                style={{
                  minHeight: 44,
                  border: "none",
                  borderRadius: 10,
                  padding: "0 16px",
                  background: "#0b5a6b",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Create Project Card
              </button>
            </div>

            <h2 style={{ margin: "0 0 10px" }}>Project Board</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 12,
              }}
            >
              {state.generalBoard.columns.map((column) => (
                <article
                  key={column.id}
                  onDragOver={(event) => onColumnDragOver(column.id, event)}
                  onDrop={() => onGeneralColumnDrop(column.id)}
                  onDragLeave={() => setDropColumnId(null)}
                  style={{
                    background: "#ffffffd9",
                    border:
                      dropColumnId === column.id
                        ? "2px solid #0b5a6b"
                        : "1px solid #c8d1d4",
                    borderRadius: 12,
                    padding: 12,
                    minHeight: 220,
                    transition: "border-color 160ms ease",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>{column.title}</h3>
                  <div style={{ display: "grid", gap: 10 }}>
                    {(state.generalBoard.cardsByColumn[column.id] ?? []).map(
                      (card) => {
                        const hasChildBoard = Boolean(state.projectBoards[card.id]);

                        return (
                          <div
                            key={card.id}
                            draggable
                            onDragStart={() =>
                              onCardDragStart("general", column.id, card.id)
                            }
                            onDragEnd={onCardDragEnd}
                            style={{
                              border: "1px solid #d5dce0",
                              borderRadius: 10,
                              padding: 10,
                              background: "#f8fbfc",
                              cursor: "grab",
                            }}
                          >
                            <strong
                              style={{
                                display: "block",
                                color: "#0d3b46",
                                fontWeight: 700,
                                minHeight: 28,
                              }}
                            >
                              {card.title}
                            </strong>
                            <p
                              style={{
                                margin: "6px 0 10px",
                                color: "#5c6b74",
                                fontSize: 14,
                              }}
                            >
                              {card.description}
                            </p>
                            {(card.category || card.dueDate) ? (
                              <p
                                style={{
                                  margin: "0 0 10px",
                                  color: "#45626d",
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                              >
                                {card.category ? `Category: ${card.category}` : ""}
                                {card.category && card.dueDate ? " | " : ""}
                                {card.dueDate ? `Due: ${card.dueDate}` : ""}
                              </p>
                            ) : null}
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                justifyContent: "flex-end",
                                marginTop: 10,
                                flexWrap: "wrap",
                              }}
                            >
                              {hasChildBoard ? (
                                <button
                                  type="button"
                                  aria-label="Enter task board"
                                  title="Enter task board"
                                  onClick={() => setActiveProjectId(card.id)}
                                  style={{
                                    minWidth: 44,
                                    minHeight: 44,
                                    borderRadius: 8,
                                    border: "1px solid #0f6f83",
                                    background: "#e7f6f9",
                                    color: "#0a4552",
                                    display: "grid",
                                    placeItems: "center",
                                    cursor: "pointer",
                                  }}
                                >
                                  <EnterIcon />
                                </button>
                              ) : null}
                              <button
                                type="button"
                                aria-label="Edit project card"
                                title="Edit"
                                onClick={() =>
                                  openEditCardModal(
                                    {
                                      boardType: "general",
                                      columnId: column.id,
                                      cardId: card.id,
                                    },
                                    "project",
                                    card,
                                  )
                                }
                                style={{
                                  minWidth: 44,
                                  minHeight: 44,
                                  borderRadius: 8,
                                  border: "1px solid #3b6f7d",
                                  background: "#edf8fb",
                                  color: "#134452",
                                  display: "grid",
                                  placeItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <EditIcon />
                              </button>
                              {column.id === "done" ? (
                                <button
                                  type="button"
                                  aria-label="Delete project card"
                                  title="Delete"
                                  onClick={() => deleteCompletedProjectCard(card.id)}
                                  style={{
                                    minWidth: 44,
                                    minHeight: 44,
                                    borderRadius: 8,
                                    border: "1px solid #a63a3a",
                                    background: "#fdecec",
                                    color: "#7a1f1f",
                                    display: "grid",
                                    placeItems: "center",
                                    cursor: "pointer",
                                  }}
                                >
                                  <DeleteIcon />
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </article>
              ))}
            </div>
            </div>
          </section>
        ) : (
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              <div>
                <h2 style={{ margin: 0 }}>
                  {activeProjectCard?.title ?? "Project"} - Task Board
                </h2>
                <p style={{ margin: "6px 0 0", color: "#5c6b74" }}>
                  This board contains tasks for one selected project.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveProjectId(null)}
                style={{
                  minHeight: 44,
                  border: "none",
                  borderRadius: 10,
                  padding: "0 14px",
                  background: "#2f4858",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Back to General Board
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 14,
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 700 }}>Add task</span>
              <button
                type="button"
                onClick={() => openCreateCardModal("task")}
                style={{
                  minHeight: 44,
                  border: "none",
                  borderRadius: 10,
                  padding: "0 16px",
                  background: "#0b5a6b",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Create Task
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 12,
              }}
            >
              {activeProjectColumns.map((column) => (
                <article
                  key={column.id}
                  onDragOver={(event) => onColumnDragOver(column.id, event)}
                  onDrop={() => onProjectColumnDrop(column.id)}
                  onDragLeave={() => setDropColumnId(null)}
                  style={{
                    background: "#ffffffde",
                    border:
                      dropColumnId === column.id
                        ? "2px solid #0b5a6b"
                        : "1px solid #c8d1d4",
                    borderRadius: 12,
                    padding: 12,
                    minHeight: 220,
                    transition: "border-color 160ms ease",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>{column.title}</h3>
                  <div style={{ display: "grid", gap: 10 }}>
                    {(activeProjectBoard?.cardsByColumn[column.id] ?? []).map(
                      (card) => {
                        return (
                          <div
                            key={card.id}
                            draggable
                            onDragStart={() =>
                              onCardDragStart("project", column.id, card.id)
                            }
                            onDragEnd={onCardDragEnd}
                            style={{
                              border: "1px solid #d5dce0",
                              borderRadius: 10,
                              padding: 10,
                              background: "#f8fbfc",
                              cursor: "grab",
                            }}
                          >
                            <strong style={{ display: "block", marginBottom: 6 }}>
                              {card.title}
                            </strong>
                            {card.description ? (
                              <p
                                style={{
                                  margin: "0 0 10px",
                                  color: "#5c6b74",
                                  fontSize: 14,
                                }}
                              >
                                {card.description}
                              </p>
                            ) : null}
                            {(card.category || card.dueDate) ? (
                              <p
                                style={{
                                  margin: "0 0 10px",
                                  color: "#45626d",
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                              >
                                {card.category ? `Category: ${card.category}` : ""}
                                {card.category && card.dueDate ? " | " : ""}
                                {card.dueDate ? `Due: ${card.dueDate}` : ""}
                              </p>
                            ) : null}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: 10,
                                gap: 8,
                              }}
                            >
                              <button
                                type="button"
                                aria-label="Edit task"
                                title="Edit"
                                onClick={() =>
                                  openEditCardModal(
                                    {
                                      boardType: "project",
                                      columnId: column.id,
                                      cardId: card.id,
                                    },
                                    "task",
                                    card,
                                  )
                                }
                                style={{
                                  minWidth: 44,
                                  minHeight: 44,
                                  borderRadius: 8,
                                  border: "1px solid #3b6f7d",
                                  background: "#edf8fb",
                                  color: "#134452",
                                  display: "grid",
                                  placeItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <EditIcon />
                              </button>
                              {column.id === "done" ? (
                                <button
                                  type="button"
                                  aria-label="Delete task"
                                  title="Delete"
                                  onClick={() => deleteDoneTaskCard(card.id)}
                                  style={{
                                    minWidth: 44,
                                    minHeight: 44,
                                    borderRadius: 8,
                                    border: "1px solid #a63a3a",
                                    background: "#fdecec",
                                    color: "#7a1f1f",
                                    display: "grid",
                                    placeItems: "center",
                                    cursor: "pointer",
                                  }}
                                >
                                  <DeleteIcon />
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {createCardMode ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-card-modal-title"
            onClick={closeCreateCardModal}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(18, 25, 29, 0.4)",
              display: "grid",
              placeItems: "center",
              padding: 16,
            }}
          >
            <form
              onSubmit={onCreateCardSubmit}
              onClick={(event) => event.stopPropagation()}
              style={{
                width: "min(560px, 100%)",
                background: "#fffdf9",
                border: "1px solid #d6d0c6",
                borderRadius: 14,
                padding: 16,
                display: "grid",
                gap: 12,
              }}
            >
              <h3 id="create-card-modal-title" style={{ margin: 0 }}>
                {modalTitle}
              </h3>

              <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
                Title
                <input
                  required
                  value={newCardForm.title}
                  onChange={(event) =>
                    setNewCardForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Card title"
                  style={{
                    minHeight: 44,
                    borderRadius: 10,
                    border: "1px solid #b8c2c6",
                    padding: "0 12px",
                    background: "#ffffff",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
                Description
                <textarea
                  value={newCardForm.description}
                  onChange={(event) =>
                    setNewCardForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="What should be done?"
                  rows={4}
                  style={{
                    borderRadius: 10,
                    border: "1px solid #b8c2c6",
                    padding: 12,
                    background: "#ffffff",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </label>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                }}
              >
                <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
                  Category
                  <input
                    value={newCardForm.category}
                    onChange={(event) =>
                      setNewCardForm((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                    placeholder="e.g. Feature, Bug, Ops"
                    style={{
                      minHeight: 44,
                      borderRadius: 10,
                      border: "1px solid #b8c2c6",
                      padding: "0 12px",
                      background: "#ffffff",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: 6, fontWeight: 700 }}>
                  Due date
                  <input
                    type="date"
                    value={newCardForm.dueDate}
                    onChange={(event) =>
                      setNewCardForm((prev) => ({
                        ...prev,
                        dueDate: event.target.value,
                      }))
                    }
                    style={{
                      minHeight: 44,
                      borderRadius: 10,
                      border: "1px solid #b8c2c6",
                      padding: "0 12px",
                      background: "#ffffff",
                    }}
                  />
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={closeCreateCardModal}
                  style={{
                    minHeight: 44,
                    border: "1px solid #909ea4",
                    borderRadius: 10,
                    padding: "0 16px",
                    background: "#ffffff",
                    color: "#22323b",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    minHeight: 44,
                    border: "none",
                    borderRadius: 10,
                    padding: "0 16px",
                    background: "#0b5a6b",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {editTarget ? "Update Card" : "Save Card"}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </main>
    </div>
  );
}
