// React hook for local component state
import { useState } from 'react';

// Global store hook (Zustand)
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

// Toast notifications
import { useToast } from '@/hooks/use-toast';

// Props expected by the CreateListDialog component
interface CreateListDialogProps {
  boardId: string;                    // ID of the board to add the list to
  open: boolean;                      // Controls dialog visibility
  onOpenChange: (open: boolean) => void; // Callback when dialog opens/closes
}

export const CreateListDialog = ({
  boardId,
  open,
  onOpenChange,
}: CreateListDialogProps) => {
  // State for the list title input
  const [title, setTitle] = useState('');

  // Add list action from global store
  const addList = useStore((state) => state.addList);

  // Toast handler
  const { toast } = useToast();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that the title is not empty or whitespace
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a list title.',
        variant: 'destructive',
      });
      return;
    }

    // Create the new list
    addList(boardId, title.trim());

    // Show success message
    toast({
      title: 'List created!',
      description: 'Your new list is ready.',
    });

    // Reset form and close dialog
    setTitle('');
    onOpenChange(false);
  };

  return (
    // Dialog container
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
          <DialogDescription>
            Add a new list to organize your tasks
          </DialogDescription>
        </DialogHeader>

        {/* Create list form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* List title input */}
          <div className="space-y-2">
            <Label htmlFor="listTitle">List Title</Label>
            <Input
              id="listTitle"
              placeholder="e.g., To Do"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
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
            <Button type="submit">Create List</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
