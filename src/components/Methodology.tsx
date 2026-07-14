const rules = [
  {
    title: "Tell Claude your stage before you tell it your task.",
    body: "Pre-launch, single-region, <100 users/day is a different problem than a Series-B codebase. Claude defaults to the bigger one every time. One paragraph in CLAUDE.md kills 40% of over-engineering.",
  },
  {
    title: "Own schema, auth, and the trade-offs.",
    body: "Every schema decision on MedKompas was mine. Auth flow was written by hand and reviewed line by line. Claude is a fast typist, not a co-founder.",
  },
  {
    title: "Ship the version you kept after cutting.",
    body: "I delete ~40% of what Claude writes on the first pass. Retry queues, 12-field validators, three layers of abstraction on top of Prisma — none of that lives past review.",
  },
  {
    title: "Real code beats promised code.",
    body: "OSM ingestion pipeline in Python, JWT stack from scratch, memory-leak trace in a cron job. Claude helped. I own the read-through.",
  },
  {
    title: "Use AI to compress the boring 80%. Sit in the important 20%.",
    body: "Boilerplate, glue code, first-draft components — Claude ships. Model design, auth boundaries, taste-checks on every merge — I ship.",
  },
];

export function Methodology() {
  return (
    <section id="methodology" className="py-16 border-t border-[color:var(--color-border)]">
      <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-2">
        Methodology
      </h2>
      <p className="text-2xl md:text-3xl font-semibold tracking-tight mb-10 max-w-xl">
        Five rules I ship by.
      </p>
      <div className="space-y-6">
        {rules.map((r, i) => (
          <div
            key={r.title}
            className="flex gap-5 pt-6 border-t border-[color:var(--color-border)] first:border-t-0 first:pt-0"
          >
            <div className="font-mono text-sm text-[color:var(--color-accent)] flex-shrink-0 pt-1">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{r.title}</h3>
              <p className="text-[color:var(--color-muted)] leading-relaxed">
                {r.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
