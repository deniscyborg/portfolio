---
title: "Die Testpyramide in der Praxis: wohin welcher Test gehört"
description: "Unit, API, UI — ein praktischer Leitfaden, wie man Tests auf die Ebenen verteilt, damit die Suite schnell, stabil und günstig in der Pflege bleibt."
date: 2026-11-03
tags: [Teststrategie, API-Tests, UI-Tests]
---

Die Testpyramide ist eine der ältesten Ideen im Softwaretest: viele schnelle, kleine Tests unten, wenige langsame End-to-End-Tests oben. Jeder kennt das Diagramm. Weit weniger Teams halten sich daran — die meisten Suiten sehen eher aus wie eine Eistüte: Hunderte UI-Tests und darunter fast nichts.

Dieser Artikel ist ein praktischer Leitfaden für die Entscheidung, wohin ein Test gehört.

## Die drei Ebenen

| Ebene | Was geprüft wird | Geschwindigkeit | Typische Werkzeuge |
|---|---|---|---|
| Unit | Eine Funktion oder Klasse isoliert | Millisekunden | NUnit, pytest |
| API / Integration | Ein Dienst über seine öffentliche Schnittstelle | einige zehn Millisekunden | HttpClient, requests, Playwright API |
| UI / End-to-End | Ein echter Nutzerablauf in Browser oder App | Sekunden | Playwright, Appium |

## Eine einfache Regel: dort testen, wo die Logik steckt

Stellen Sie für jede Prüfung eine Frage: **Wo ist dieses Verhalten implementiert?**

- Eine Berechnung oder ein Parser steckt im Code — testen Sie ihn mit **Unit-Tests**.
- Eine Geschäftsregel wie „E-Mail muss eindeutig sein“ oder „ein fehlender Benutzer liefert 404“ steckt im Dienst — testen Sie sie über die **API**. So lassen sich alle Randfälle in Sekundenbruchteilen abdecken.
- „Ein Nutzer kann eine Kollegin hinzufügen und sieht sie in der Liste“ ist ein **Ablauf** — genau dafür sind UI-Tests da.

Wenn dieselbe Regel auf mehreren Ebenen getestet wird, behalten Sie den günstigsten Test und löschen den Rest.

## Ein Beispiel

In meinem Open-Source-[Demoprojekt](https://report.usermanagementapp.com) sieht die Aufteilung so aus:

- **19 API-Tests** decken Anlegen, Lesen, Ändern und Löschen ab, jeden Validierungsfehler (`400`), doppelte E-Mail-Adressen (`409`) und fehlende Ressourcen (`404`).
- **12 UI-Tests** decken ab, was nur ein Browser zeigen kann: das Formular, Validierungsmeldungen, einen Serverfehler in der Oberfläche, Suche und Tastaturbedienung.

Die UI-Tests prüfen nicht jede Validierungsregel erneut — das tun bereits die API-Tests. Stattdessen bereiten die UI-Tests ihre Daten über die API vor und nutzen den Browser nur für das zu prüfende Verhalten. Die gesamte Suite läuft in etwa fünf Sekunden.

## Anzeichen für eine umgedrehte Pyramide

- Ein vollständiger Lauf dauert länger als eine Kaffeepause.
- Eine geänderte Button-Beschriftung bricht Tests, die mit Buttons nichts zu tun haben.
- Entwickler führen Tests nicht lokal aus, weil „es zu lange dauert“.
- Die meisten Fehler werden von den langsamsten Tests gefunden.

## Wie man das behebt

Listen Sie zuerst auf, was Ihre UI-Tests tatsächlich prüfen. Jede Prüfung, die eigentlich eine Geschäftsregel ist, kann auf die API-Ebene wandern. Jeder Test, der nur Daten vorbereitet, kann dafür die API statt Klicks nutzen. Innerhalb weniger Wochen wird die Suite kleiner, schneller und deutlich vertrauenswürdiger.
