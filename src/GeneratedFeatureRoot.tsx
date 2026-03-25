import React from "react";

type Column = {
  id: string;
  title: string;
};

type Card = {
  id: string;
  title: string;
  description?: string;
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

export default function GeneratedFeatureRoot(): JSX.Element {
  const [state, setState] = React.useState<PersistedState>(() => initialState());
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null);
  const [newDailyTaskTitle, setNewDailyTaskTitle] = React.useState("");
  const [newProjectTitle, setNewProjectTitle] = React.useState("");
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
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

  const addProject = (): void => {
    const title = newProjectTitle.trim();
    if (!title) {
      return;
    }

    const projectId = makeId("project");
    const newCard: Card = {
      id: projectId,
      title,
      description: "Click to enter this project's task board.",
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

    setNewProjectTitle("");
  };

  const addDailyTask = (): void => {
    const title = newDailyTaskTitle.trim();
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
                description: "",
              },
            ],
          },
        },
      };
    });

    setNewDailyTaskTitle("");
  };

  const addTask = (): void => {
    if (!activeProjectId) {
      return;
    }

    const title = newTaskTitle.trim();
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
                  description: "",
                },
              ],
            },
          },
        },
      };
    });

    setNewTaskTitle("");
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
                <label htmlFor="new-daily-task" style={{ fontWeight: 700 }}>
                  Add daily task
                </label>
                <input
                  id="new-daily-task"
                  value={newDailyTaskTitle}
                  onChange={(event) => setNewDailyTaskTitle(event.target.value)}
                  placeholder="General task title"
                  style={{
                    minHeight: 44,
                    borderRadius: 10,
                    border: "1px solid #b8c2c6",
                    padding: "0 12px",
                    minWidth: 240,
                    flex: "1 1 260px",
                    background: "#ffffff",
                  }}
                />
                <button
                  type="button"
                  onClick={addDailyTask}
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
                          {column.id === "done" ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: 10,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => deleteDailyDoneCard(card.id)}
                                style={{
                                  minHeight: 44,
                                  borderRadius: 8,
                                  border: "1px solid #a63a3a",
                                  background: "#fdecec",
                                  color: "#7a1f1f",
                                  padding: "0 12px",
                                  cursor: "pointer",
                                  fontWeight: 700,
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          ) : null}
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
              <label htmlFor="new-project" style={{ fontWeight: 700 }}>
                Add project
              </label>
              <input
                id="new-project"
                value={newProjectTitle}
                onChange={(event) => setNewProjectTitle(event.target.value)}
                placeholder="Project name"
                style={{
                  minHeight: 44,
                  borderRadius: 10,
                  border: "1px solid #b8c2c6",
                  padding: "0 12px",
                  minWidth: 240,
                  flex: "1 1 260px",
                  background: "#ffffff",
                }}
              />
              <button
                type="button"
                onClick={addProject}
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
                                  onClick={() => setActiveProjectId(card.id)}
                                  style={{
                                    minHeight: 44,
                                    borderRadius: 8,
                                    border: "1px solid #0f6f83",
                                    background: "#e7f6f9",
                                    color: "#0a4552",
                                    padding: "0 12px",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                  }}
                                >
                                  Enter Task Board
                                </button>
                              ) : null}
                              {column.id === "done" ? (
                                <button
                                  type="button"
                                  onClick={() => deleteCompletedProjectCard(card.id)}
                                  style={{
                                    minHeight: 44,
                                    borderRadius: 8,
                                    border: "1px solid #a63a3a",
                                    background: "#fdecec",
                                    color: "#7a1f1f",
                                    padding: "0 12px",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                  }}
                                >
                                  Delete
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
              <label htmlFor="new-task" style={{ fontWeight: 700 }}>
                Add task
              </label>
              <input
                id="new-task"
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder="Task title"
                style={{
                  minHeight: 44,
                  borderRadius: 10,
                  border: "1px solid #b8c2c6",
                  padding: "0 12px",
                  minWidth: 240,
                  flex: "1 1 260px",
                  background: "#ffffff",
                }}
              />
              <button
                type="button"
                onClick={addTask}
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
                            {column.id === "done" ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  marginTop: 10,
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => deleteDoneTaskCard(card.id)}
                                  style={{
                                    minHeight: 44,
                                    borderRadius: 8,
                                    border: "1px solid #a63a3a",
                                    background: "#fdecec",
                                    color: "#7a1f1f",
                                    padding: "0 12px",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            ) : null}
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
      </main>
    </div>
  );
}
