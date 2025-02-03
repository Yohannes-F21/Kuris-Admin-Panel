import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  blogTitle: string;
}
export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  blogTitle,
}: DeleteConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Blog">
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete "{blogTitle}"? This action cannot be
          undone.
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
