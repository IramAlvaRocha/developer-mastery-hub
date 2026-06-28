interface Props {
  theory: string;
}

export default function TheoryTab({ theory }: Props) {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="ui-card p-5">
        <h4 className="mb-3 flex items-center gap-2 text-[13px] font-bold text-ink">
          📚 Fundamentos Teóricos
        </h4>
        <div className="max-h-[440px] overflow-y-auto whitespace-pre-line rounded-[10px] border border-line bg-surface-2 p-4 font-mono text-[11px] leading-relaxed text-muted md:text-xs">
          {theory}
        </div>
      </div>
    </div>
  );
}
