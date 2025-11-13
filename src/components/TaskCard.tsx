import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Card as TaskCardType } from '@/store/useStore';
import { Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  card: TaskCardType;
  isDragging: boolean;
}

const priorityConfig = {
  high: { color: 'hsl(var(--priority-high))', label: 'High' },
  medium: { color: 'hsl(var(--priority-medium))', label: 'Medium' },
  low: { color: 'hsl(var(--priority-low))', label: 'Low' },
};

export const TaskCard = ({ card, isDragging }: TaskCardProps) => {
  const priorityStyle = priorityConfig[card.priority];

  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`p-3 cursor-pointer transition-all ${
          isDragging
            ? 'shadow-lg rotate-2 opacity-80'
            : 'shadow-sm hover:shadow-md'
        }`}
      >
        <h4 className="font-medium text-sm text-foreground mb-2">{card.title}</h4>
        
        {card.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {card.description}
          </p>
        )}

        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {card.labels.map((label) => (
              <Badge
                key={label.id}
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: `hsl(var(--label-${label.color}))`,
                  color: 'white',
                }}
              >
                {label.text}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded"
              style={{ backgroundColor: `${priorityStyle.color}20` }}
            >
              <AlertCircle className="w-3 h-3" style={{ color: priorityStyle.color }} />
              <span style={{ color: priorityStyle.color }}>{priorityStyle.label}</span>
            </div>
          </div>

          {card.dueDate && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(card.dueDate), 'MMM d')}</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
