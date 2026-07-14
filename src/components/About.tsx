export function About() {
  return (
    <section id="about" className="py-16 border-t border-[color:var(--color-border)]">
      <h2 className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-6">
        About
      </h2>
      <div className="space-y-6 text-lg leading-relaxed max-w-2xl">
        <p>
          I started coding seriously in March 2026. Instead of grinding tutorials
          for a year, I picked a real problem — my mom&apos;s medical clinic
          needed a marketplace — and shipped it with Claude Code alongside me.
          Four months later MedKompas is onboarding partner clinics.
        </p>
        <p>
          The uncomfortable truth is that AI writes a lot of good code and even
          more code you should never merge. My advantage is not typing speed.
          It is knowing what to keep, what to cut, and what Claude cannot
          decide for you: schema shape, auth boundaries, the trade-offs a
          co-founder actually cares about.
        </p>
        <p>
          I am opening my calendar for contract and freelance work with founders
          who want someone to <em>ship</em>, not to babysit tooling.
        </p>
      </div>
    </section>
  );
}
