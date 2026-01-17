import { useCallback, useState } from 'react';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  color?: string;
}

export function PersonaSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  color = '#38BDF8',
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const percent = ((value - min) / (max - min)) * 100;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange],
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 tracking-widest font-mono uppercase">{label}</span>
        <span
          className="rounded-lg px-2 py-0.5 text-xs font-mono transition-all duration-300"
          style={{
            color,
            backgroundColor: `${color}20`,
            boxShadow: isDragging ? `0 0 12px ${color}40` : 'none',
          }}
        >
          {value}%
        </span>
      </div>

      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-px bg-white/10" />
        <div
          className="absolute left-0 h-px transition-all duration-150"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        />

        <div
          className="pointer-events-none absolute h-3 w-3 rotate-45 transition-all duration-150"
          style={{
            left: `calc(${percent}% - 6px)`,
            backgroundColor: color,
            boxShadow: isDragging ? `0 0 20px ${color}` : `0 0 10px ${color}`,
          }}
        />

        <div
          className="pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 border-l border-t opacity-20"
          style={{ borderColor: color }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r opacity-20"
          style={{ borderColor: color }}
        />
      </div>
    </div>
  );
}
