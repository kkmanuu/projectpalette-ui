// React hook for managing component state
import { useState } from 'react';

// Global state store (Zustand)
import { useStore } from '@/store/useStore';

// Dialog UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Select (dropdown) components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Toast notifications
import { useToast } from '@/hooks/use-toast';

// Props expected by the CreateCardDialog component
interface CreateCardDialogProps {
  listId: string;                     // ID of the list to add the card to
  open: boolean;                      // Controls dialog visibility
  onOpenChange: (open: boolean) => void; // Callback when dialog opens/closes
}

export const CreateCardDialog = ({
  listId,
  open,
  onOpenChange,
}: CreateCardDialogProps) => {
  // Local state for card form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dueDate, setDueDate] = useState('');

  // Add card action from global store
  const addCard = useStore((state) => state.addCard);

  // Toast handler
  const { toast } = useToast();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required title field
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a card title.',
        variant: 'destructive',
      });
      return;
    }

    // Create new card with form data
    addCard(listId, {
      title: title.trim(),
      description: description.trim(),
      labels: [],
      priority,
      dueDate: dueDate || undefined, // Avoid storing empty string
    });

    // Show success message
    toast({
      title: 'Card created!',
      description: 'Your new card has been added.',
    });

    // Reset form state and close dialog
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    onOpenChange(false);
  };

  return (
    // Dialog container
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Card</DialogTitle>
          <DialogDescription>
            Add a new task card to your list
          </DialogDescription>
        </DialogHeader>

        {/* Create card form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card title */}
          <div className="space-y-2">
            <Label htmlFor="cardTitle">Title</Label>
            <Input
              id="cardTitle"
              placeholder="e.g., Design landing page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Card description (optional) */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Priority and due date */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority select */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value)}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due date input */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Card</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
