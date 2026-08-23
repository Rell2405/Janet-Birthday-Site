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
    path: "./birthday-weekend/",
    title: /The celebration/,
    heading: "The celebration",
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

test("renders all five navigation tabs and official weekend events", async ({
  page,
}) => {
  for (const tab of tabs) {
    await page.goto(tab.path);
    await expect(page).toHaveTitle(tab.title);
    await expect(
      page.getByRole("heading", { level: 1, name: tab.heading }),
    ).toBeVisible();
  }

  await page.goto("./");
  await expect(page.locator("#itinerary > div > ol > li")).toHaveCount(7);
  await expect(
    page.getByRole("heading", { name: "Janet’s Island in Bloom" }),
  ).toBeVisible();

  await page.goto("./birthday-weekend/");
  await expect(page.getByRole("img")).toHaveCount(0);

  await page.goto("./what-to-wear/");
  await expect(page.getByRole("tab")).toHaveCount(0);
  const fridayDay = page.getByRole("article", {
    name: /Friday, June 18, Morning & afternoon/i,
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
    name: /Saturday, June 19, Morning & afternoon/i,
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

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
});

test("all five tabs have no serious or critical accessibility violations", async ({
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
