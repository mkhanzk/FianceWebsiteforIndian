import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CalculatorConfig } from '../data/calculators';
import CalculatorCard from './CalculatorCard';

const CalculatorAccordion = ({
  calculator,
  defaultOpen = false
}: {
  calculator: CalculatorConfig;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <div className="rounded-2xl border border-white/10 bg-surface">
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <p className="text-sm font-semibold text-text">{calculator.title}</p>
          <p className="text-xs text-muted">{calculator.description}</p>
        </div>
        <ChevronDown size={18} className={`text-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-white/10 p-5">
          <CalculatorCard calculator={calculator} />
        </div>
      )}
    </div>
  );
};

export default CalculatorAccordion;