import EmptyState from './EmptyState.jsx';

export default function Table({ columns, rows, empty = 'No records found' }) {
  if (!rows?.length) return <EmptyState message={empty} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50/80">
          <tr>{columns.map((column) => <th key={column.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{column.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row._id} className="hover:bg-slate-50/70">
              {columns.map((column) => <td key={column.key} className="px-4 py-3 text-slate-700">{column.render ? column.render(row) : row[column.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
