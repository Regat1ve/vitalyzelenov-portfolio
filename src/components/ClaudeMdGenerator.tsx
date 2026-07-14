"use client";

import { useMemo, useState } from "react";
import {
  STACKS,
  STAGES,
  generateClaudeMd,
  type StackKey,
  type Stage,
} from "@/lib/claude-md-templates";

export function ClaudeMdGenerator() {
  const [projectName, setProjectName] = useState("");
  const [stage, setStage] = useState<Stage>("pre-launch");
  const [selected, setSelected] = useState<Set<StackKey>>(
    new Set(["nextjs", "prisma"])
  );
  const [copied, setCopied] = useState(false);

  const stacks = useMemo(() => Array.from(selected), [selected]);
  const output = useMemo(
    () => generateClaudeMd(projectName, stage, stacks),
    [projectName, stage, stacks]
  );

  function toggle(k: StackKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    const blob = new Blob([output], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CLAUDE.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="space-y-6">
        <div>
          <label htmlFor="project-name" className="block text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-2">
            Project name
          </label>
          <input
            id="project-name"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. medkompas"
            className="w-full h-11 px-3 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-card)] focus:outline-none focus:border-[color:var(--color-accent)] transition-colors"
          />
        </div>

        <fieldset>
          <legend className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-3">
            Stage
          </legend>
          <div className="space-y-2">
            {STAGES.map((s) => (
              <label
                key={s.key}
                className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                  stage === s.key
                    ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/5"
                    : "border-[color:var(--color-border)] hover:border-[color:var(--color-muted)]"
                }`}
              >
                <input
                  type="radio"
                  name="stage"
                  value={s.key}
                  checked={stage === s.key}
                  onChange={() => setStage(s.key)}
                  className="mt-1 accent-[color:var(--color-accent)]"
                />
                <div>
                  <div className="font-medium">{s.label}</div>
                  <div className="text-sm text-[color:var(--color-muted)]">{s.blurb}</div>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)] mb-3">
            Stack ({selected.size} selected)
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STACKS.map((s) => {
              const on = selected.has(s.key);
              return (
                <label
                  key={s.key}
                  className={`flex items-start gap-2 p-2.5 rounded-md border cursor-pointer transition-colors text-sm ${
                    on
                      ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/5"
                      : "border-[color:var(--color-border)] hover:border-[color:var(--color-muted)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(s.key)}
                    className="mt-0.5 accent-[color:var(--color-accent)]"
                  />
                  <div>
                    <div className="font-medium">{s.label}</div>
                    <div className="text-xs text-[color:var(--color-muted)]">{s.blurb}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="space-y-3 lg:sticky lg:top-24">
        <div className="flex items-center justify-between">
          <div className="text-sm font-mono uppercase tracking-widest text-[color:var(--color-muted)]">
            Preview
          </div>
          <div className="flex gap-2">
            <button
              onClick={copy}
              className="h-9 px-3 rounded-md border border-[color:var(--color-border)] text-sm hover:bg-[color:var(--color-code)] transition-colors"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
            <button
              onClick={download}
              className="h-9 px-3 rounded-md bg-[color:var(--color-foreground)] text-[color:var(--color-background)] text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Download CLAUDE.md
            </button>
          </div>
        </div>
        <pre className="p-4 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-code)] text-xs leading-relaxed overflow-auto max-h-[70vh] font-mono whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
}
