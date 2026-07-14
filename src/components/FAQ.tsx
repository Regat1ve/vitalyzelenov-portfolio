const faqs = [
  {
    q: "Are you actually only 4 months in?",
    a: "Yes. First serious line of code was March 2026. What compresses the timeline is not talent — it is Claude Code + tight scope + reviewing every diff. I still miss things a five-year veteran wouldn't, and I say so up front.",
  },
  {
    q: "Do you just prompt-engineer while Claude does everything?",
    a: "No. Claude ships boilerplate, first-draft components, and glue code fast. I own schema decisions, auth boundaries, and every merge review. On MedKompas I deleted ~40% of what Claude wrote on the first pass. Discipline is the leverage.",
  },
  {
    q: "What's your rate?",
    a: "$30–50/hr depending on scope and length. Prefer 1-week paid trial → month-to-month contract. Fixed-price for well-scoped tickets. Currency: USDC via Bybit or wire transfer.",
  },
  {
    q: "You're in Russia. How do payments work?",
    a: "Bybit USDC works globally. Wise wire works for most EU/US clients. I do not touch Payoneer or PayPal. Invoices in USD, standard NET-30 or NET-7 for smaller engagements.",
  },
  {
    q: "Timezone overlap?",
    a: "UTC+3 (Nizhny Novgorod). Comfortable overlap window with EU business hours all day and US East Coast until 24:00 MSK. Not stretching to US Pacific — quality drops after midnight my time.",
  },
  {
    q: "What kind of work do you want?",
    a: "Founders who need a full flow shipped end-to-end — auth, data model, main feature, deploy. Or a founding engineer role at a pre-seed / seed startup. Not interested in agencies subcontracting to me at half rate.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-16 border-t border-[color:var(--color-border)]">
      <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-2">
        FAQ
      </h2>
      <p className="text-2xl md:text-3xl font-semibold tracking-tight mb-10 max-w-xl">
        Questions founders actually ask.
      </p>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <details
            key={i}
            className="group rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] open:border-[color:var(--color-accent)]/40"
          >
            <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 select-none">
              <span className="font-medium text-base md:text-lg">{f.q}</span>
              <span className="font-mono text-[color:var(--color-accent)] text-sm group-open:rotate-45 transition-transform flex-shrink-0">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 text-[color:var(--color-muted)] leading-relaxed">
              {f.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
