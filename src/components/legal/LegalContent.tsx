import type { ReactNode } from "react";
import { site, type Locale } from "@/config/site";

/**
 * Тексты Impressum и Datenschutzerklärung.
 * Немецкая версия — основная; английская — перевод для удобства.
 */

function H({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 text-xl font-semibold text-white">{children}</h2>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 leading-relaxed text-dim">{children}</p>;
}

function Address({ locale }: { locale: Locale }) {
  const a = site.address;
  return (
    <p className="mt-3 leading-relaxed text-dim">
      {site.name}
      <br />
      {a.street}
      <br />
      {a.zip} {a.city}
      <br />
      {a.country[locale]}
    </p>
  );
}

function Contact({ locale }: { locale: Locale }) {
  const phoneLabel = locale === "de" ? "Telefon" : "Phone";
  return (
    <p className="mt-3 leading-relaxed text-dim">
      {site.phone && (
        <>
          {phoneLabel}:{" "}
          <a href={`tel:${site.phone.tel}`} className="text-phosphor hover:underline">
            {site.phone.display}
          </a>
          <br />
        </>
      )}
      {site.email && (
        <>
          E-Mail:{" "}
          <a href={`mailto:${site.email}`} className="text-phosphor hover:underline">
            {site.email}
          </a>
        </>
      )}
    </p>
  );
}

export function ImprintContent({ locale }: { locale: Locale }) {
  if (locale === "de") {
    return (
      <>
        <H>Angaben gemäß § 5 DDG</H>
        <Address locale={locale} />
        <H>Kontakt</H>
        <Contact locale={locale} />
        <H>Umsatzsteuer</H>
        <P>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {site.vatId}</P>
        {site.smallBusiness && <P>Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).</P>}
        <H>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</H>
        <Address locale={locale} />
        <H>Verbraucherstreitbeilegung</H>
        <P>
          Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </P>
      </>
    );
  }
  return (
    <>
      <H>Information pursuant to § 5 DDG (German Digital Services Act)</H>
      <Address locale={locale} />
      <H>Contact</H>
      <Contact locale={locale} />
      <H>VAT</H>
      <P>VAT identification number pursuant to § 27a of the German VAT Act: {site.vatId}</P>
      {site.smallBusiness && <P>No VAT is charged under the small business scheme (§ 19 UStG).</P>}
      <H>Responsible for content pursuant to § 18 (2) MStV</H>
      <Address locale={locale} />
      <H>Consumer dispute resolution</H>
      <P>I am neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.</P>
      <P>The German version of this page is legally binding.</P>
    </>
  );
}

export function PrivacyContent({ locale }: { locale: Locale }) {
  if (locale === "de") {
    return (
      <>
        <H>1. Verantwortlicher</H>
        <Address locale={locale} />
        <Contact locale={locale} />

        <H>2. Überblick</H>
        <P>
          Diese Website ist eine statische Seite. Sie verwendet keine Cookies, kein Tracking, keine Analyse-Tools
          und keine eingebetteten Inhalte Dritter. Schriftarten werden vom eigenen Server ausgeliefert, nicht von
          Google. Es gibt keine Kontaktformulare.
        </P>

        <H>3. Server-Logfiles</H>
        <P>
          Beim Aufruf der Website verarbeitet der Webserver technisch notwendige Daten: IP-Adresse, Datum und
          Uhrzeit, aufgerufene Seite, Referrer-URL, Browser und Betriebssystem. Die Verarbeitung ist erforderlich,
          um die Website auszuliefern und ihre Sicherheit zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1
          lit. f DSGVO (berechtigtes Interesse am sicheren und stabilen Betrieb). Die Logfiles werden spätestens
          nach 14 Tagen gelöscht.
        </P>

        <H>4. Hosting</H>
        <P>
          Die Website wird auf einem virtuellen Server der JSC Timeweb, Sankt Petersburg, Russland, betrieben. Der
          Server steht in Russland. Für Russland liegt kein Angemessenheitsbeschluss der EU-Kommission vor; bei der
          Verarbeitung der unter Ziffer 3 genannten Daten kann daher ein geringeres Datenschutzniveau als in der EU
          bestehen.
        </P>

        <H>5. Kontakt per E-Mail, Telefon oder Telegram</H>
        <P>
          Wenn Sie mich kontaktieren, verarbeite ich Ihre Angaben, um Ihre Anfrage zu beantworten. Rechtsgrundlage
          ist Art. 6 Abs. 1 lit. b DSGVO (Anbahnung eines Vertrags) bzw. lit. f (berechtigtes Interesse an der
          Beantwortung). Die Daten werden gelöscht, sobald sie nicht mehr benötigt werden, sofern keine
          gesetzlichen Aufbewahrungspflichten bestehen.
        </P>

        <H>6. Links zu anderen Websites</H>
        <P>
          Diese Website enthält einfache Links, z. B. zu LinkedIn, GitHub und Telegram. Erst wenn Sie einen Link
          anklicken, werden Daten an den jeweiligen Anbieter übertragen; dafür gilt dessen Datenschutzerklärung.
        </P>

        <H>7. Ihre Rechte</H>
        <P>
          Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17),
          Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch gegen die
          Verarbeitung auf Grundlage berechtigter Interessen (Art. 21). Sie können sich außerdem bei einer
          Datenschutz-Aufsichtsbehörde beschweren, z. B. bei der Berliner Beauftragten für Datenschutz und
          Informationsfreiheit.
        </P>
      </>
    );
  }
  return (
    <>
      <H>1. Controller</H>
      <Address locale={locale} />
      <Contact locale={locale} />

      <H>2. Overview</H>
      <P>
        This is a static website. It uses no cookies, no tracking, no analytics and no embedded third-party
        content. Fonts are served from this server, not from Google. There are no contact forms.
      </P>

      <H>3. Server log files</H>
      <P>
        When you visit the site, the web server processes technically necessary data: IP address, date and time,
        requested page, referrer URL, browser and operating system. This is required to deliver the site and keep
        it secure. Legal basis: Art. 6(1)(f) GDPR (legitimate interest in secure and stable operation). Log files
        are deleted after 14 days at the latest.
      </P>

      <H>4. Hosting</H>
      <P>
        The site runs on a virtual server operated by JSC Timeweb, Saint Petersburg, Russia. The server is located
        in Russia. There is no EU adequacy decision for Russia, so the data listed in section 3 may be processed
        with a lower level of data protection than in the EU.
      </P>

      <H>5. Contact by email, phone or Telegram</H>
      <P>
        If you contact me, I process your details to answer your request. Legal basis: Art. 6(1)(b) GDPR
        (pre-contractual steps) or Art. 6(1)(f) (legitimate interest in replying). The data is deleted once it is no
        longer needed, unless statutory retention periods apply.
      </P>

      <H>6. Links to other websites</H>
      <P>
        This site contains plain links, for example to LinkedIn, GitHub and Telegram. Data is only sent to those
        providers when you click a link; their privacy policies apply.
      </P>

      <H>7. Your rights</H>
      <P>
        You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of
        processing (Art. 18), data portability (Art. 20) and to object to processing based on legitimate interests
        (Art. 21). You may also lodge a complaint with a supervisory authority, for example the Berlin
        Commissioner for Data Protection and Freedom of Information.
      </P>
      <P>The German version of this page is legally binding.</P>
    </>
  );
}
