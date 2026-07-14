const stats = [
  { value: "4", label: "months shipping with Claude Code" },
  { value: "3", label: "products live, pre-launch, or open source" },
  { value: "~800", label: "LOC of Python ETL owned end-to-end" },
  { value: "40%", label: "of Claude's first-pass output cut on review" },
];

export function Metrics() {
  return (
    <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[color:var(--color-border)] pt-8 mt-10">
      {stats.map((s) => (
        <div key={s.label} className="space-y-1">
          <dt className="font-mono text-3xl font-semibold tracking-tight text-[color:var(--color-foreground)]">
            {s.value}
          </dt>
          <dd className="text-xs text-[color:var(--color-muted)] leading-snug">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}
