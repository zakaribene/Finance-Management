import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, icon: Icon, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />}
        <input
          ref={ref}
          className={`w-full rounded-xl border border-slate-300 bg-white py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 ${Icon ? 'pl-10 pr-3' : 'px-3'}`}
          {...props}
        />
      </div>
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
});

export default Input;
