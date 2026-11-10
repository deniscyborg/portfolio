---
title: "The test pyramid in practice: where each test belongs"
description: "Unit, API, UI — a practical guide to splitting tests between layers so the suite stays fast, stable and cheap to maintain."
date: 2026-11-03
tags: [test strategy, api testing, ui testing]
---

The test pyramid is one of the oldest ideas in software testing: many fast, small tests at the bottom, fewer slow end-to-end tests at the top. Everyone has seen the diagram. Far fewer teams actually follow it — most suites look more like an ice-cream cone, with hundreds of UI tests and almost nothing below.

This article is a practical guide to deciding where a test belongs.

## The three layers

| Layer | What it checks | Speed | Typical tools |
|---|---|---|---|
| Unit | A function or class in isolation | milliseconds | NUnit, pytest |
| API / integration | A service through its public interface | tens of milliseconds | HttpClient, requests, Playwright API |
| UI / end-to-end | A real user journey in a browser or app | seconds | Playwright, Appium |

## A simple rule: test a rule where it lives

Ask one question for every check: **where is this behaviour implemented?**

- A calculation or a parser lives in code — test it with **unit tests**.
- A business rule like "email must be unique" or "a missing user returns 404" lives in the service — test it through the **API**. You can cover every edge case in a fraction of a second.
- "A user can add a colleague and sees them in the list" is a **journey** — that is what UI tests are for.

When the same rule is tested at several levels, keep the cheapest test and delete the rest.

## An example

In my open-source [demo project](https://report.usermanagementapp.com) the split looks like this:

- **19 API tests** cover create, read, update and delete, every validation error (`400`), duplicate emails (`409`) and missing resources (`404`).
- **12 UI tests** cover what only a browser can show: the form, validation messages, a server error surfacing in the interface, search and keyboard behaviour.

The UI tests do not re-check every validation rule — the API tests already do. Instead, UI tests prepare their data through the API and spend browser time only on the behaviour under test. The whole suite runs in about five seconds.

## Signs your pyramid is upside down

- A full run takes longer than a coffee break.
- Changing a button label breaks tests that have nothing to do with buttons.
- Developers do not run tests locally because "it takes too long".
- Most bugs are found by the slowest tests.

## How to fix it

Start by listing what your UI tests actually verify. Every check that is really a business rule can move down to the API layer. Every test that only exists to prepare data can use the API instead of clicking. Within a few weeks the suite becomes smaller, faster and much more trusted.
