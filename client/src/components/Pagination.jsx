import Button from './Button.jsx';

export default function Pagination({ page, totalPages, onPage }) {
  return (
    <div className="flex items-center justify-between pt-4 text-sm text-slate-600">
      <span>Page {page} of {totalPages || 1}</span>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onPage(page - 1)}>Prev</Button>
        <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
