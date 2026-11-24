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
  await expect(page.getByRole("alert").filter({ hasText: "Enter both a title and a question or instructions." })).toBeVisible();
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

test("edit a saved exit ticket and publish its correction separately", async ({ page }) => {
  const title = "Exit ticket";
  const updatedTitle = "Fraction comparison";
  const question = "Draw equal-sized bars to compare two sixths with one third.";
  const edit = page.getByRole("button", { name: "Edit Exit ticket", exact: true });
  const publish = page.getByRole("button", { name: "Publish student edition" });
  const teacher = page.getByRole("button", { name: "Return to teacher desk" });

  await page.goto("/");
  await page.getByRole("checkbox", { name: /Exit ticket/ }).check();
  await publish.click();
  await teacher.click();
  await edit.click();
  const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Save changes" }) });
  await form.getByLabel("Resource title").fill("Discard this");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(edit).toBeFocused();

  await edit.click();
  await expect(form.getByLabel("Resource title")).toHaveValue(title);
  await form.getByLabel("Resource title").fill(updatedTitle);
  await form.getByLabel("Question or instructions").fill(question);
  await form.getByRole("button", { name: "Save changes" }).click();
  await page.reload();
  await expect(page.getByRole("checkbox", { name: /Fraction comparison/ })).toBeChecked();
  await page.getByRole("button", { name: "Student view" }).click();
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  await expect(page.getByText(updatedTitle, { exact: true })).toHaveCount(0);
  await teacher.click();
  await publish.click();
  await page.getByText(updatedTitle, { exact: true }).click();
  await expect(page.getByText(question, { exact: true })).toBeVisible();
});
