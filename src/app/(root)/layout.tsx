import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  robots: { index: false },
};

/** Separate root layout used only by the "/" redirect page */
export default function RootRedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
