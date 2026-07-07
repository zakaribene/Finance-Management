import { forwardRef } from 'react';

const Select = forwardRef(function Select({ label, children, ...props }, ref) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>}
      <select ref={ref} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" {...props}>
        {children}
      </select>
    </label>
  );
});

export default Select;
