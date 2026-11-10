import { expect, test, type Page } from "@playwright/test";

const LOCALES = ["en", "de"] as const;

/** Собирает ошибки страницы и консоли, чтобы падать на любой из них */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

for (const locale of LOCALES) {
  test.describe(`home (${locale})`, () => {
    test("renders main sections without errors", async ({ page }) => {
      const errors = trackErrors(page);
      await page.goto(`/${locale}/`);

      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      for (const id of ["services", "expertise", "work", "experience", "pricing", "blog", "contact"]) {
        await expect(page.locator(`#${id}`)).toBeAttached();
      }
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });

    test("navigation links point inside the same locale", async ({ page }) => {
      await page.goto(`/${locale}/`);
      const links = page.getByRole("navigation", { name: "Main" }).getByRole("link");
      await expect(links).toHaveCount(6);
      for (const href of await links.evaluateAll((els) => els.map((a) => a.getAttribute("href")))) {
        expect(href).toMatch(new RegExp(`^/${locale}/`));
      }
    });

    test("language switch opens the same page in the other language", async ({ page }) => {
      const other = locale === "en" ? "de" : "en";
      await page.goto(`/${locale}/pricing/`);
      await page.locator(`header a[hreflang="${other}"]`).click();
      await expect(page).toHaveURL(`/${other}/pricing/`);
      await expect(page.locator("html")).toHaveAttribute("lang", other);
    });

    test("pricing page lists three plans and expandable FAQ", async ({ page }) => {
      await page.goto(`/${locale}/pricing/`);
      await expect(page.locator("article")).toHaveCount(3);

      const firstQuestion = page.locator("details").first();
      await firstQuestion.locator("summary").click();
      await expect(firstQuestion).toHaveAttribute("open", "");
    });

    test("blog lists articles and opens one", async ({ page }) => {
      await page.goto(`/${locale}/blog/`);
      const posts = page.locator("main li a");
      await expect(posts).toHaveCount(3);

      const title = (await posts.first().locator("h3").textContent())!;
      await posts.first().click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page.locator(".prose-terminal h2").first()).toBeVisible();
    });
  });
}

test("root redirects to a language version", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|de)\/$/);
});

test("unknown pages show the custom 404", async ({ page }) => {
  const response = await page.goto("/does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("HTTP/1.1 404 Not Found")).toBeVisible();
});

test("all internal links resolve", async ({ page, request }) => {
  const visited = new Set<string>();
  const queue = ["/en/", "/de/"];

  while (queue.length > 0) {
    const path = queue.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);

    await page.goto(path);
    const hrefs = await page.locator("a[href^='/']").evaluateAll((els) => els.map((a) => a.getAttribute("href")!));
    for (const href of hrefs) {
      const clean = href.split("#")[0];
      if (clean && !visited.has(clean)) queue.push(clean);
    }
  }

  for (const path of visited) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
  expect(visited.size).toBeGreaterThan(10);
});

test("external links open safely", async ({ page }) => {
  await page.goto("/en/");
  const unsafe = await page
    .locator("a[target='_blank']")
    .evaluateAll((els) => els.filter((a) => !(a.getAttribute("rel") ?? "").includes("noopener")).length);
  expect(unsafe).toBe(0);
});
