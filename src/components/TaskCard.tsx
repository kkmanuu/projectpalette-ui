// Animation library for smooth UI transitions
import { motion } from 'framer-motion';

// UI components
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Task card type from global store
import { Card as TaskCardType } from '@/store/useStore';

// Icons
import { Calendar, AlertCircle } from 'lucide-react';

// Date formatting utility
import { format } from 'date-fns';

// Props expected by the TaskCard component
interface TaskCardProps {
  card: TaskCardType;     // Task data
  isDragging: boolean;   // Whether the card is currently being dragged
}

// Priority configuration for styling and labels
const priorityConfig = {
  high: { color: 'hsl(var(--priority-high))', label: 'High' },
  medium: { color: 'hsl(var(--priority-medium))', label: 'Medium' },
  low: { color: 'hsl(var(--priority-low))', label: 'Low' },
};

export const TaskCard = ({ card, isDragging }: TaskCardProps) => {
  // Get priority style based on card priority
  const priorityStyle = priorityConfig[card.priority];

  return (
    // Animated wrapper for card enter/exit and hover effects
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Task card container */}
      <Card
        className={`p-3 cursor-pointer transition-all ${
          isDragging
            ? 'shadow-lg rotate-2 opacity-80' // Style when dragging
            : 'shadow-sm hover:shadow-md'     // Default hover style
        }`}
      >
        {/* Task title */}
        <h4 className="font-medium text-sm text-foreground mb-2">
          {card.title}
        </h4>

        {/* Task description (optional) */}
        {card.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {card.description}
          </p>
        )}

        {/* Task labels (optional) */}
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

        {/* Priority and due date */}
        <div className="flex items-center justify-between text-xs">
          {/* Priority indicator */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1 px-2 py-1 rounded"
              style={{ backgroundColor: `${priorityStyle.color}20` }}
            >
              <AlertCircle
                className="w-3 h-3"
                style={{ color: priorityStyle.color }}
              />
              <span style={{ color: priorityStyle.color }}>
                {priorityStyle.label}
              </span>
            </div>
          </div>

          {/* Due date (optional) */}
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
