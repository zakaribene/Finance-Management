import Button from './Button.jsx';
import Modal from './Modal.jsx';

export default function ConfirmationDialog({ open, title = 'Confirm action', message, onCancel, onConfirm }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </div>
    </Modal>
  );
}
