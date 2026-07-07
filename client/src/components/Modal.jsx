import Button from './Button.jsx';

export default function Modal({ title, open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
