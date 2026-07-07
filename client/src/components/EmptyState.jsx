export default function EmptyState({ message = 'No records found' }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <p className="text-sm font-semibold text-slate-700">{message}</p>
      <p className="mt-1 text-xs text-slate-400">Records will appear here after you create or receive data.</p>
    </div>
  );
}
