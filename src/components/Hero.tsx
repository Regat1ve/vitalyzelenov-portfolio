import Image from "next/image";
import Link from "next/link";
import { config } from "@/lib/config";

export function Hero() {
  return (
    <section id="top" className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="flex flex-col-reverse md:flex-row md:items-center md:gap-12">
        <div className="flex-1">
          <p className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-accent)] mb-4">
            {config.location}
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-6">
            Hi, I&apos;m Vitaly. <br />
            <span className="text-[color:var(--color-muted)]">
              I ship real products with Claude Code.
            </span>
          </h1>
          <p className="text-lg text-[color:var(--color-muted)] leading-relaxed mb-8 max-w-xl">
            Full-stack developer, four months in. I code with AI as a co-worker,
            not a novelty. Two products in production or pre-launch, one open
            tool in the wild, and a discipline for cutting what does not need
            to ship.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#projects"
              className="inline-flex items-center h-11 px-5 rounded-md bg-[color:var(--color-foreground)] text-[color:var(--color-background)] font-medium text-sm hover:opacity-90 transition-opacity"
            >
              See projects
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center h-11 px-5 rounded-md border border-[color:var(--color-border)] font-medium text-sm hover:bg-[color:var(--color-code)] transition-colors"
            >
              Hire me
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0 mb-8 md:mb-0">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-2 ring-[color:var(--color-border)]">
            <Image
              src="/avatar-placeholder.svg"
              alt={`${config.name} avatar`}
              fill
              sizes="160px"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
