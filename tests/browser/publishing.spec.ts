import { expect, test } from "@playwright/test";

test("teacher decisions survive publication, a later edit and a reload", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.getByText("Saved on this device")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath("teacher-overview.png") });
  await page.getByRole("button", { name: "Suggest activities" }).click();
  const first = page.getByRole("article").filter({ hasText: "Worked example" });
  const second = page.getByRole("article").filter({ hasText: "Check for understanding" });
  const approved = "Use two equal strips to explain one half and two quarters.";
  await first.getByRole("textbox").fill(approved);
  await first.getByRole("button", { name: "Approve", exact: true }).click();
  await second.getByRole("button", { name: "Reject" }).click();
  await expect(first.getByText("approved", { exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("teacher-desk.png"), fullPage: true });

  await page.getByRole("button", { name: "Publish student edition" }).click();
  await expect(page.getByText(approved, { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Check for understanding" })).toHaveCount(0);
  await page.getByText("Fraction strips worksheet", { exact: true }).click();
  await expect(page.getByText(/Draw three equal bars/)).toBeVisible();
  await expect(page.getByText("Exit ticket", { exact: true })).toHaveCount(0);
  await page.screenshot({ path: info.outputPath("student-edition.png"), fullPage: true });

  await page.getByRole("button", { name: "Return to teacher desk" }).click();
  await first.getByRole("textbox").fill("New wording awaiting review.");
  await expect(first.getByText("pending", { exact: true })).toBeVisible();
  await page.reload();
  await expect(first.getByRole("textbox")).toHaveValue("New wording awaiting review.");
  await page.getByRole("button", { name: "Student view" }).click();
  await expect(page.getByText(approved, { exact: true })).toBeVisible();
  await expect(page.getByText("New wording awaiting review.", { exact: true })).toHaveCount(0);
});
