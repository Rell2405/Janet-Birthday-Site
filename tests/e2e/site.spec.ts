import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders and opens the configured birthday experience", async ({
  page,
}) => {
  await page.goto("./");

  await expect(page).toHaveTitle(/Janet's Journey/);
  const passport = page.getByRole("button", { name: "Open passport" });
  await expect(passport).toBeVisible();
  await passport.press("Enter");
  await expect(page.getByText("JANET", { exact: true })).toBeVisible();
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
