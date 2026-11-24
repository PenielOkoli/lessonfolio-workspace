import { expect, test } from "@playwright/test";

test("save a resource, attach it and update its published visibility", async ({ page }) => {
  const title = "Quick check";
  const content = "Draw a strip showing three quarters.";
  const resource = page.getByRole("checkbox", { name: new RegExp(title) });
  const publish = page.getByRole("button", { name: "Publish student edition" });
  const teacher = page.getByRole("button", { name: "Return to teacher desk" });

  await page.goto("/");
  await page.getByText("Add a resource", { exact: true }).click();
  await page.getByLabel("Resource title").fill("   ");
  await page.getByLabel("Question or instructions").fill(content);
  await page.getByRole("button", { name: "Save resource" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByLabel("Resource title").fill(title);
  await page.getByRole("button", { name: "Save resource" }).click();
  await expect(resource).toBeVisible();
  await expect(resource).not.toBeChecked();

  await page.reload();
  await expect(resource).toBeVisible();
  await publish.click();
  await expect(page.getByText(title, { exact: true })).toHaveCount(0);
  await teacher.click();
  await resource.check();
  await publish.click();
  await page.getByText(title, { exact: true }).click();
  await expect(page.getByText(content, { exact: true })).toBeVisible();

  await teacher.click();
  await resource.uncheck();
  await page.getByRole("button", { name: "Student view" }).click();
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  await teacher.click();
  await publish.click();
  await expect(page.getByText(title, { exact: true })).toHaveCount(0);
});
