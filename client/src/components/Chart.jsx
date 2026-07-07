export default function Chart({ items = [] }) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-xs text-slate-500"><span>{item.label}</span><span>{item.value}</span></div>
          <div className="h-2 rounded bg-slate-100"><div className="h-2 rounded bg-blue-600" style={{ width: `${Math.min(100, (item.value / max) * 100)}%` }} /></div>
        </div>
      ))}
    </div>
  );
}
