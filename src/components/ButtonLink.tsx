import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
};

const styles = {
  primary: "bg-phosphor text-bg hover:bg-white",
  ghost: "border border-line-strong text-ink hover:border-phosphor hover:text-phosphor",
};

export function ButtonLink({ href, children, variant = "primary", external }: Props) {
  const className = `inline-flex items-center gap-2 rounded px-5 py-3 font-mono text-sm font-medium transition-colors ${styles[variant]}`;
  const content = (
    <>
      <span aria-hidden="true">{variant === "primary" ? ">" : "$"}</span>
      {children}
    </>
  );

  return external ? (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
