import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Label {
  id: string;
  text: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}


export interface Card {
  id: string;
  title: string;
  description?: string;
  labels: Label[];
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  listId: string;
  order: number;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  cards: Card[];
  order: number;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  color: string;
  lists: List[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

interface StoreState {
  user: User | null;
  boards: Board[];
  currentBoardId: string | null;
  
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Board actions
  addBoard: (board: Omit<Board, 'id' | 'lists'>) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  setCurrentBoard: (id: string | null) => void;
  
  // List actions
  addList: (boardId: string, title: string) => void;
  updateList: (listId: string, updates: Partial<List>) => void;
  deleteList: (listId: string) => void;
  moveList: (listId: string, newOrder: number) => void;
  
  // Card actions
  addCard: (listId: string, card: Omit<Card, 'id' | 'listId' | 'order'>) => void;
  updateCard: (cardId: string, updates: Partial<Card>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, targetListId: string, newOrder: number) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Sample data
const sampleBoards: Board[] = [
  {
    id: 'board-1',
    title: 'Product Roadmap',
    description: 'Q1 2025 Product Development',
    color: 'hsl(217 91% 60%)',
    lists: [
      {
        id: 'list-1',
        title: 'Backlog',
        boardId: 'board-1',
        order: 0,
        cards: [
          {
            id: 'card-1',
            title: 'User Authentication',
            description: 'Implement secure login and registration',
            labels: [{ id: 'l1', text: 'Feature', color: 'blue' }],
            priority: 'high',
            dueDate: '2025-01-15',
            listId: 'list-1',
            order: 0,
          },
          {
            id: 'card-2',
            title: 'Dashboard Analytics',
            description: 'Add charts and metrics',
            labels: [{ id: 'l2', text: 'Enhancement', color: 'green' }],
            priority: 'medium',
            listId: 'list-1',
            order: 1,
          },
        ],
      },
      {
        id: 'list-2',
        title: 'In Progress',
        boardId: 'board-1',
        order: 1,
        cards: [
          {
            id: 'card-3',
            title: 'API Integration',
            description: 'Connect to third-party services',
            labels: [{ id: 'l3', text: 'Backend', color: 'orange' }],
            priority: 'high',
            dueDate: '2025-01-10',
            listId: 'list-2',
            order: 0,
          },
        ],
      },
      {
        id: 'list-3',
        title: 'Done',
        boardId: 'board-1',
        order: 2,
        cards: [
          {
            id: 'card-4',
            title: 'Project Setup',
            description: 'Initialize repository and dependencies',
            labels: [{ id: 'l4', text: 'Setup', color: 'purple' }],
            priority: 'low',
            listId: 'list-3',
            order: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'board-2',
    title: 'Marketing Campaign',
    description: 'Launch strategy for new product',
    color: 'hsl(142 76% 36%)',
    lists: [],
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      boards: sampleBoards,
      currentBoardId: null,

      // Auth
      login: async (email: string, password: string) => {
        // Simple mock authentication
        if (email && password) {
          set({
            user: {
              id: 'user-1',
              name: email.split('@')[0],
              email,
            },
          });
          return true;
        }
        return false;
      },

      register: async (name: string, email: string, password: string) => {
        if (name && email && password) {
          set({
            user: {
              id: generateId(),
              name,
              email,
            },
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, currentBoardId: null });
      },

      // Boards
      addBoard: (board) => {
        const newBoard: Board = {
          ...board,
          id: generateId(),
          lists: [],
        };
        set((state) => ({
          boards: [...state.boards, newBoard],
        }));
      },

      updateBoard: (id, updates) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id ? { ...board, ...updates } : board
          ),
        }));
      },

      deleteBoard: (id) => {
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
          currentBoardId: state.currentBoardId === id ? null : state.currentBoardId,
        }));
      },

      setCurrentBoard: (id) => {
        set({ currentBoardId: id });
      },

      // Lists
      addList: (boardId, title) => {
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id === boardId) {
              const newList: List = {
                id: generateId(),
                title,
                boardId,
                cards: [],
                order: board.lists.length,
              };
              return { ...board, lists: [...board.lists, newList] };
            }
            return board;
          }),
        }));
      },

      updateList: (listId, updates) => {
        set((state) => ({
          boards: state.boards.map((board) => ({
            ...board,
            lists: board.lists.map((list) =>
              list.id === listId ? { ...list, ...updates } : list
            ),
          })),
        }));
      },

      deleteList: (listId) => {
        set((state) => ({
          boards: state.boards.map((board) => ({
            ...board,
            lists: board.lists.filter((list) => list.id !== listId),
          })),
        }));
      },

      moveList: (listId, newOrder) => {
        set((state) => ({
          boards: state.boards.map((board) => {
            const list = board.lists.find((l) => l.id === listId);
            if (!list) return board;

            const reorderedLists = [...board.lists]
              .filter((l) => l.id !== listId)
              .splice(newOrder, 0, { ...list, order: newOrder });

            return {
              ...board,
              lists: board.lists.map((l, idx) => ({ ...l, order: idx })),
            };
          }),
        }));
      },

      // Cards
      addCard: (listId, card) => {
        set((state) => ({
          boards: state.boards.map((board) => ({
            ...board,
            lists: board.lists.map((list) => {
              if (list.id === listId) {
                const newCard: Card = {
                  ...card,
                  id: generateId(),
                  listId,
                  order: list.cards.length,
                };
                return { ...list, cards: [...list.cards, newCard] };
              }
              return list;
            }),
          })),
        }));
      },

      updateCard: (cardId, updates) => {
        set((state) => ({
          boards: state.boards.map((board) => ({
            ...board,
            lists: board.lists.map((list) => ({
              ...list,
              cards: list.cards.map((card) =>
                card.id === cardId ? { ...card, ...updates } : card
              ),
            })),
          })),
        }));
      },

      deleteCard: (cardId) => {
        set((state) => ({
          boards: state.boards.map((board) => ({
            ...board,
            lists: board.lists.map((list) => ({
              ...list,
              cards: list.cards.filter((card) => card.id !== cardId),
            })),
          })),
        }));
      },

      moveCard: (cardId, targetListId, newOrder) => {
        set((state) => {
          const newBoards = state.boards.map((board) => {
            let movedCard: Card | undefined;

            // Remove card from its current list
            const listsWithoutCard = board.lists.map((list) => {
              const card = list.cards.find((c) => c.id === cardId);
              if (card) {
                movedCard = { ...card, listId: targetListId };
                return {
                  ...list,
                  cards: list.cards.filter((c) => c.id !== cardId),
                };
              }
              return list;
            });

            if (!movedCard) return board;

            // Add card to target list
            return {
              ...board,
              lists: listsWithoutCard.map((list) => {
                if (list.id === targetListId) {
                  const newCards = [...list.cards];
                  newCards.splice(newOrder, 0, movedCard!);
                  return {
                    ...list,
                    cards: newCards.map((c, idx) => ({ ...c, order: idx })),
                  };
                }
                return list;
              }),
            };
          });

          return { boards: newBoards };
        });
      },
    }),
    {
      name: 'project-management-storage',
    }
  )
);
