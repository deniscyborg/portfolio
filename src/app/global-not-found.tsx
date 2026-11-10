import Link from "next/link";
import type { Metadata } from "next";
import { Photo } from "@/components/Photo";
import { en } from "@/i18n/en";
import { de } from "@/i18n/de";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false },
};

// Язык посетителя на этапе 404 неизвестен, поэтому показываем обе версии
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <main className="mx-auto grid min-h-screen max-w-5xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_340px]">
          <div>
            <p className="font-mono text-sm text-danger">
              <span className="text-mute">$</span> curl -I {"<this page>"}
              <br />
              HTTP/1.1 404 Not Found
            </p>
            <h1 className="mt-6 text-4xl font-semibold text-white">{en.notFound.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-dim">{en.notFound.text}</p>
            <p className="mt-8 text-dim" lang="de">
              {de.notFound.title}. {de.notFound.text}
            </p>
            <p className="mt-10 flex gap-6 font-mono text-sm">
              <Link href="/en/" className="text-phosphor hover:underline">
                ← {en.notFound.back}
              </Link>
              <Link href="/de/" className="text-phosphor hover:underline" lang="de">
                ← {de.notFound.back}
              </Link>
            </p>
          </div>
          <figure className="scanlines relative overflow-hidden rounded-md border border-line">
            <Photo
              name="not-found"
              widths={[480, 960]}
              sizes="340px"
              width={960}
              height={1200}
              alt="Two fire-water inlets on a Berlin wall"
              className="w-full opacity-85"
            />
          </figure>
        </main>
      </body>
    </html>
  );
}
