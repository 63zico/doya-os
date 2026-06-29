import type { ReactNode } from "react";

type AiClosingPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function AiClosingPageHeader({
  eyebrow,
  title,
  description,
  action,
}: AiClosingPageHeaderProps) {
  return (
    <section
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      aria-labelledby="ai-closing-title"
    >
      <div>
        <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
        <h1
          id="ai-closing-title"
          className="mt-1 text-2xl font-semibold tracking-normal text-foreground"
        >
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {action ? <div className="flex shrink-0 gap-2">{action}</div> : null}
    </section>
  );
}
