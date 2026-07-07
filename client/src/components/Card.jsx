export default function Card({ title, value, children, tone = 'default' }) {
  const tones = {
    default: 'border-slate-200 bg-white',
    blue: 'border-blue-100 bg-blue-50/70',
    green: 'border-emerald-100 bg-emerald-50/70',
    rose: 'border-rose-100 bg-rose-50/70',
    amber: 'border-amber-100 bg-amber-50/70'
  };
  return (
    <section className={`rounded-2xl border p-5 shadow-sm ${tones[tone]}`}>
      {title && <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>}
      {value !== undefined && <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value}</p>}
      {children}
    </section>
  );
}
