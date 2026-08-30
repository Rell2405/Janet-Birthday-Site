import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const tabs = [
  {
    path: "./",
    title: /Janet’s Island in Bloom/,
    heading: /Janet's island in bloom/i,
  },
  {
    path: "./resort/",
    title: /Dreams Rose Hall Resort/,
    heading: "Dreams Rose Hall Resort & Spa",
  },
  {
    path: "./what-to-wear/",
    title: /birthday weekend style guide/i,
    heading: "The birthday weekend style guide",
  },
  {
    path: "./book-your-stay/",
    title: /Secure your spot in paradise/,
    heading: "Secure your spot in paradise",
  },
] as const;

test("renders all four navigation tabs and official weekend events", async ({
  page,
}) => {
  for (const tab of tabs) {
    await page.goto(tab.path);
    await expect(page).toHaveTitle(tab.title);
    await expect(
      page.getByRole("heading", { level: 1, name: tab.heading }),
    ).toBeVisible();

    const header = page.locator("header");
    await expect(header).toHaveCSS("position", "fixed");
    const homeSurface = page.locator("[data-header-home]");
    const homeRadius = await homeSurface.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).borderRadius),
    );
    expect(homeRadius).toBeGreaterThan(100);
    const menuSurface = page.locator("[data-header-menu]:visible");
    const menuAlpha = await menuSurface.evaluate((element) => {
      const color = getComputedStyle(element).backgroundColor;
      const modernAlpha = color.match(/\/\s*([\d.]+)\)$/)?.[1];
      const legacyAlpha = color.match(/rgba\(.+,\s*([\d.]+)\)$/)?.[1];
      return Number(modernAlpha ?? legacyAlpha ?? 1);
    });
    expect(menuAlpha).toBeGreaterThan(0);
    expect(menuAlpha).toBeLessThan(1);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect
      .poll(async () => (await header.boundingBox())?.y ?? -1)
      .toBeGreaterThanOrEqual(0);
    await expect
      .poll(async () => (await header.boundingBox())?.y ?? 99)
      .toBeLessThan(2);
  }

  await page.goto("./");
  await expect(page.locator("#itinerary > div > ol > li")).toHaveCount(7);
  await expect(
    page.getByRole("heading", { name: "Janet’s Island in Bloom" }),
  ).toBeVisible();

  await page.goto("./what-to-wear/");
  await expect(page.getByRole("tab")).toHaveCount(0);
  const fridayDay = page.getByRole("article", {
    name: /Friday, June 18, Daytime/i,
  });
  await expect(fridayDay).toBeVisible();
  await fridayDay.focus();
  await expect(
    page.getByRole("img", { name: /Shades of Blue pool party attire/i }),
  ).toBeVisible();
  const fridayNight = page.getByRole("article", {
    name: /Friday, June 18, Nighttime/i,
  });
  await fridayNight.focus();
  await expect(
    page.getByRole("img", { name: /White Lights all-white attire/i }),
  ).toBeVisible();
  const saturdayDay = page.getByRole("article", {
    name: /Saturday, June 19, Daytime/i,
  });
  await saturdayDay.focus();
  await expect(
    page.getByRole("img", { name: /Animal Prints pool party attire/i }),
  ).toBeVisible();
  const saturdayNight = page.getByRole("article", {
    name: /Saturday, June 19, Nighttime/i,
  });
  await saturdayNight.focus();
  await expect(
    page.getByRole("img", { name: /Island in Bloom tropical cocktail attire/i }),
  ).toBeVisible();
  const thursday = page.getByRole("article", {
    name: /Thursday, June 17, Arrival day/i,
  });
  await thursday.focus();
  await expect(page.getByText("Resort chic", { exact: true })).toBeVisible();
  const sunday = page.getByRole("article", {
    name: /Sunday, June 20, Daytime/i,
  });
  await sunday.focus();
  await expect(page.getByText("Resort wear", { exact: true })).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
});

test("removed Birthday Weekend route is not published", async ({ page }) => {
  const response = await page.goto("./birthday-weekend/");
  expect(response?.status()).toBe(404);
});

test("menu opens on hover or click and closes when exited", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium");
  await page.goto("./resort/");

  const menu = page.locator("[data-site-menu]");
  const panel = page.locator("[data-menu-panel]");
  const summary = page.locator("[data-header-menu]");

  await expect(panel).toBeHidden();
  await menu.hover();
  await expect(panel).toBeVisible();

  await page.mouse.move(0, 300);
  await expect(panel).toBeHidden();

  await summary.click();
  await expect(panel).toBeVisible();
  await page.locator("main").click({ position: { x: 10, y: 200 } });
  await expect(panel).toBeHidden();
});

test("Resort page keeps the hotel link and shows the supplied gallery", async ({
  page,
}) => {
  await page.goto("./resort/");

  await expect(
    page.getByRole("heading", { name: "Your island escape" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Explore Dreams Rose Hall Resort & Spa" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "A closer look at paradise" }),
  ).toBeVisible();
  await expect(page.locator(".resort-gallery img")).toHaveCount(3);
});

test("all four tabs have no serious or critical accessibility violations", async ({
  page,
}) => {
  for (const tab of tabs) {
    await page.goto(tab.path);
    const results = await new AxeBuilder({ page }).analyze();
    const blockingViolations = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );

    expect(blockingViolations, tab.path).toEqual([]);
  }
});
