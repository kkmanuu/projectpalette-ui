import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { BoardList } from '@/components/BoardList';
import { CreateListDialog } from '@/components/CreateListDialog';

const BoardView = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const boards = useStore((state) => state.boards);
  const moveCard = useStore((state) => state.moveCard);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);

  const board = boards.find((b) => b.id === boardId);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (!board) {
      navigate('/dashboard');
    }
  }, [user, board, navigate]);

  if (!board) return null;

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveCard(draggableId, destination.droppableId, destination.index);
  };

  const sortedLists = [...board.lists].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{board.title}</h1>
                {board.description && (
                  <p className="text-sm text-muted-foreground">{board.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="container-fluid px-4 py-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {sortedLists.map((list, index) => (
              <motion.div
                key={list.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BoardList list={list} />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sortedLists.length * 0.1 }}
              className="flex-shrink-0"
            >
              <Button
                variant="outline"
                className="w-72 h-full min-h-[100px] border-dashed hover:bg-secondary/50"
                onClick={() => setIsCreateListOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add List
              </Button>
            </motion.div>
          </div>
        </DragDropContext>
      </main>

      <CreateListDialog
        boardId={boardId!}
        open={isCreateListOpen}
        onOpenChange={setIsCreateListOpen}
      />
    </div>
  );
};

export default BoardView;

