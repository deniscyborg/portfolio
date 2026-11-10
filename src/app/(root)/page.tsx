import Link from "next/link";
// "/" при статическом экспорте не может сделать серверный редирект:
// выбираем язык по настройкам браузера, без JS срабатывает meta refresh на английскую версию.
const detectLanguage = `
  var lang = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
  location.replace(lang.toLowerCase().indexOf("de") === 0 ? "/de/" : "/en/");
`;

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="1; url=/en/" />
      <script dangerouslySetInnerHTML={{ __html: detectLanguage }} />
      <main className="grid min-h-screen place-items-center font-mono text-sm text-dim">
        <p>
          <Link className="text-phosphor underline" href="/en/">English</Link>
          <span className="text-mute"> · </span>
          <Link className="text-phosphor underline" href="/de/">Deutsch</Link>
        </p>
      </main>
    </>
  );
}
