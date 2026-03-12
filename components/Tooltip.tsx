import { Info } from 'lucide-react';
import { ReactNode } from 'react';

const Tooltip = ({ text }: { text: ReactNode }) => {
  return (
    <span className="group relative inline-flex items-center">
      <Info size={14} className="text-muted" />
      <span className="absolute left-1/2 top-full z-10 mt-2 w-52 -translate-x-1/2 rounded-lg bg-surface px-3 py-2 text-xs text-muted shadow-card opacity-0 transition group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
};

export default Tooltip;
