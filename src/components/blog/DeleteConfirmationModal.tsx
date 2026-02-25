import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  blogTitle?: string;
  category?: string;
}
export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  blogTitle,
  category,
}: DeleteConfirmationModalProps) {
  const resolvedTitle = title ?? blogTitle ?? "this item";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete ${category === "news" ? "News" : "Blog"}`}
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete "{resolvedTitle}"? This action cannot
          be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
