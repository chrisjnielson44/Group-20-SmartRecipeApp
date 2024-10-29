import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteConversationDialogProps {
  onDelete: () => void;
}

export const DeleteConversationDialog: React.FC<
  DeleteConversationDialogProps
> = ({ onDelete }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 hover:bg-destructive transition-all duration-300 ease-in-out hover:text-white"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Conversation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this conversation? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              document.getElementById("close-delete-dialog")?.click()
            }
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete();
              document.getElementById("close-delete-dialog")?.click();
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
