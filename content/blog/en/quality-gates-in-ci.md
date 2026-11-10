---
title: "Quality gates in CI/CD: let the pipeline say no"
description: "Tests only protect a product when a failure can stop a release. How to design quality gates that are strict, fast and trusted by the team."
date: 2026-10-27
tags: [ci/cd, qaops, quality gates]
---

On a Berlin canal, a lock does not open until the water level on both sides is right. Nobody argues with it, nobody bypasses it "just this once". That is exactly how a quality gate in a CI/CD pipeline should work.

## What a quality gate is

A quality gate is a point in the pipeline where a release either passes or stops, based on objective checks: tests, static analysis, coverage of critical paths, security scans. The important word is **stops**. A gate that only produces a warning is a report, not a gate.

## The most common mistake

Many pipelines run tests with a flag like `continue-on-error: true` or `allow_failure: true`. The intention is good — "we do not want flaky tests to block releases" — but the result is a pipeline that is always green. Real regressions get deployed together with the noise, and the test report becomes something nobody opens.

The fix is not to hide failures but to remove the reasons for them: stabilise or quarantine flaky tests, and make the gate strict.

## Designing a gate the team trusts

**Fast feedback first.** Run linters, unit tests and API tests early. They finish in minutes and catch most problems before slow UI tests even start.

**Strict on what matters.** A failing test blocks the deployment. No exceptions, no manual override buried in the settings.

**Report even when it fails.** Publish the test report on every run — especially failing ones. That is when people need it most. A report with history makes trends visible: is the suite getting more stable or less?

**Fail with context.** Logs of the services under test, screenshots and traces should be attached automatically, so nobody has to reproduce the failure to understand it.

**Smoke check after deploy.** Even after a green pipeline, a quick check against the real environment confirms the release is alive.

## A minimal example

```yaml
jobs:
  test:
    steps:
      - run: dotnet test   # any failure turns the job red
  report:
    needs: test
    if: always()           # publish the report even after a failure
  deploy:
    needs: test            # runs only when tests are green
```

Three jobs, one rule: the report is always published, the deployment happens only on green.

## The result

When the gate is strict and the tests are reliable, a green pipeline finally means something. Teams release more often, not less — because they trust the signal.
