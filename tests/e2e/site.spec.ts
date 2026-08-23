import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the luxury birthday week and seven-day itinerary", async ({ page }) => {
  await page.goto("./");

  await expect(page).toHaveTitle(/Janet's Island Week/);
  await expect(
    page.getByRole("heading", { name: /Janet's island week/i }),
  ).toBeVisible();
  await expect(page.locator("#itinerary > div > ol > li")).toHaveCount(7);
  await expect(
    page.getByRole("heading", { name: "Janet's golden celebration" }),
  ).toBeVisible();
  await expect(page.getByText("Sample celebration concept")).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
});

test("has no serious or critical automated accessibility violations", async ({
  page,
}) => {
  await page.goto("./");
  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );

  expect(blockingViolations).toEqual([]);
});
