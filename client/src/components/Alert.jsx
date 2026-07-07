import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function Alert({ type = 'info', title, message }) {
  const config = {
    info: { icon: Info, className: 'border-blue-200 bg-blue-50 text-blue-800' },
    warning: { icon: AlertTriangle, className: 'border-amber-200 bg-amber-50 text-amber-900' },
    success: { icon: CheckCircle2, className: 'border-emerald-200 bg-emerald-50 text-emerald-800' }
  }[type];
  const Icon = config.icon;
  return (
    <div className={`flex gap-3 rounded-2xl border p-4 shadow-sm ${config.className}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold">{title}</p>
        {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
      </div>
    </div>
  );
}
