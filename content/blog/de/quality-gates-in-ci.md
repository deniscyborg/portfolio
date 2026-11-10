---
title: "Quality Gates in CI/CD: Die Pipeline darf Nein sagen"
description: "Tests schützen ein Produkt nur, wenn ein Fehler ein Release stoppen kann. Wie man Quality Gates gestaltet, die streng und schnell sind und denen das Team vertraut."
date: 2026-10-27
tags: [CI/CD, QAOps, Quality Gates]
---

An einem Berliner Kanal öffnet sich eine Schleuse erst, wenn der Wasserstand auf beiden Seiten stimmt. Niemand diskutiert mit ihr, niemand umgeht sie „nur dieses eine Mal“. Genau so sollte ein Quality Gate in einer CI/CD-Pipeline funktionieren.

## Was ein Quality Gate ist

Ein Quality Gate ist ein Punkt in der Pipeline, an dem ein Release entweder weiterläuft oder anhält — auf Grundlage objektiver Prüfungen: Tests, statische Analyse, Abdeckung kritischer Pfade, Sicherheitsscans. Das wichtige Wort ist **anhält**. Ein Gate, das nur eine Warnung ausgibt, ist ein Report, kein Gate.

## Der häufigste Fehler

Viele Pipelines führen Tests mit einer Option wie `continue-on-error: true` oder `allow_failure: true` aus. Die Absicht ist gut — „instabile Tests sollen keine Releases blockieren“ —, das Ergebnis ist aber eine Pipeline, die immer grün ist. Echte Regressionen werden zusammen mit dem Rauschen ausgeliefert, und den Testreport öffnet niemand mehr.

Die Lösung ist nicht, Fehler zu verstecken, sondern ihre Ursachen zu beseitigen: instabile Tests stabilisieren oder in Quarantäne nehmen — und das Gate streng machen.

## Ein Gate, dem das Team vertraut

**Schnelles Feedback zuerst.** Linter, Unit- und API-Tests früh ausführen. Sie sind in Minuten fertig und finden die meisten Probleme, bevor langsame UI-Tests überhaupt starten.

**Streng bei dem, was zählt.** Ein fehlgeschlagener Test blockiert das Deployment. Ohne Ausnahmen, ohne manuelle Umgehung, versteckt in den Einstellungen.

**Auch bei Fehlern berichten.** Den Testreport bei jedem Lauf veröffentlichen — gerade bei fehlgeschlagenen. Dann wird er am dringendsten gebraucht. Ein Report mit Verlauf macht Trends sichtbar: Wird die Suite stabiler oder nicht?

**Mit Kontext fehlschlagen.** Logs der getesteten Dienste, Screenshots und Traces sollten automatisch angehängt werden, damit niemand den Fehler reproduzieren muss, um ihn zu verstehen.

**Smoke-Test nach dem Deployment.** Auch nach einer grünen Pipeline bestätigt eine kurze Prüfung gegen die echte Umgebung, dass das Release läuft.

## Ein minimales Beispiel

```yaml
jobs:
  test:
    steps:
      - run: dotnet test   # jeder Fehler färbt den Job rot
  report:
    needs: test
    if: always()           # Report auch nach einem Fehler veröffentlichen
  deploy:
    needs: test            # läuft nur bei grünen Tests
```

Drei Jobs, eine Regel: Der Report wird immer veröffentlicht, das Deployment passiert nur bei Grün.

## Das Ergebnis

Wenn das Gate streng ist und die Tests zuverlässig sind, bedeutet eine grüne Pipeline endlich etwas. Teams liefern häufiger aus, nicht seltener — weil sie dem Signal vertrauen.
