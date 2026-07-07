export default function Loader() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-r-transparent" />
        Loading workspace...
      </div>
    </div>
  );
}
