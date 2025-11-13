import { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { List } from '@/store/useStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical } from 'lucide-react';
import { TaskCard } from '@/components/TaskCard';
import { CreateCardDialog } from '@/components/CreateCardDialog';

interface BoardListProps {
  list: List;
}


export const BoardList = ({ list }: BoardListProps) => {
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const sortedCards = [...list.cards].sort((a, b) => a.order - b.order);

  return (
    <>
      <Card className="w-72 flex-shrink-0 bg-secondary/30 border-secondary">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">{list.title}</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          <Droppable droppableId={list.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-2 min-h-[100px] transition-colors ${
                  snapshot.isDraggingOver ? 'bg-primary/5 rounded-lg' : ''
                }`}
              >
                {sortedCards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskCard card={card} isDragging={snapshot.isDragging} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Button
            variant="ghost"
            className="w-full mt-2 justify-start text-muted-foreground hover:text-foreground"
            onClick={() => setIsCreateCardOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
        </div>
      </Card>

      <CreateCardDialog
        listId={list.id}
        open={isCreateCardOpen}
        onOpenChange={setIsCreateCardOpen}
      />
    </>
  );
};
