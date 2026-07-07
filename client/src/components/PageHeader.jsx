export default function PageHeader({ title, subtitle, actions }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-sm">
      <div className="flex flex-col justify-between gap-4 bg-[radial-gradient(circle_at_top_right,#1d4ed8,transparent_35%),linear-gradient(135deg,#020617,#0f172a)] p-6 text-white sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-300">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </section>
  );
}
