import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search' }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
      <input className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-11 pr-3 text-sm outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}
