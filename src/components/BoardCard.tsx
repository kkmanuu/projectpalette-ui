import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Board } from '@/store/useStore';
import { MoreVertical, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BoardCardProps {
  board: Board;
  onClick: () => void;
}

export const BoardCard = ({ board, onClick }: BoardCardProps) => {
  const listsCount = board.lists.length;
  const cardsCount = board.lists.reduce((acc, list) => acc + list.cards.length, 0);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="cursor-pointer overflow-hidden group transition-all duration-300 hover:shadow-lg"
        onClick={onClick}
      >
        <div
          className="h-32 p-6 flex flex-col justify-between"
          style={{ background: `linear-gradient(135deg, ${board.color} 0%, ${board.color}dd 100%)` }}
        >
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-white">{board.title}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                // Handle menu
              }}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
          {board.description && (
            <p className="text-white/90 text-sm line-clamp-2">{board.description}</p>
          )}
        </div>

        <div className="p-4 bg-card">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <List className="w-4 h-4" />
              <span>{listsCount} {listsCount === 1 ? 'list' : 'lists'}</span>
            </div>
            <span>{cardsCount} {cardsCount === 1 ? 'card' : 'cards'}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
