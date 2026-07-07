import { BadgeCheck } from 'lucide-react';

export default function VerifiedBadge({ size = 'md' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  return (
    <span className="group relative inline-flex align-middle">
      <BadgeCheck className={`${sizes[size]} fill-blue-600 text-white drop-shadow-sm`} />
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 scale-95 rounded-2xl border border-slate-200 bg-white p-3 text-left opacity-0 shadow-xl shadow-slate-950/15 transition duration-150 group-hover:scale-100 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900">
        <span className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600">
            <BadgeCheck className="h-5 w-5 fill-blue-600 text-white" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-950 dark:text-white">Verified account</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">This user has been verified</span>
          </span>
        </span>
        <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
      </span>
    </span>
  );
}
