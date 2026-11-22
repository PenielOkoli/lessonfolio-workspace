import assert from "node:assert/strict";
import test from "node:test";
import { publishLesson, reviewActivity, reviseActivity, workspaceSchema } from "../lib/lesson";
import { exampleWorkspace } from "../lib/sample";
import { suggestActivities } from "../lib/suggestions";

test("suggestions reflect the objective and start pending", () => {
  const guided = suggestActivities("Compare two diagrams.", "guided");
  const extension = suggestActivities("Compare two diagrams.", "extension");
  assert.ok(guided.every(item => item.decision === "pending" && item.text.includes("Compare two diagrams.")));
  assert.notDeepEqual(guided, extension);
  assert.throws(() => suggestActivities("  ", "guided"));
});

test("publish exposes only the reviewed wording and attached resources", () => {
  const workspace = exampleWorkspace();
  const items = suggestActivities(workspace.draft.objective, "guided");
  const more = suggestActivities(workspace.draft.objective, "extension");
  let draft = { ...workspace.draft, activities: [...items, ...more] };
  draft = reviseActivity(draft, items[0].id, "Explain using two equal strips.");
  draft = reviewActivity(draft, items[0].id, "approved");
  draft = reviewActivity(draft, items[1].id, "rejected");
  const { edition } = publishLesson({ ...workspace, draft });
  assert.deepEqual(edition?.activities, [{ title: items[0].title, text: "Explain using two equal strips." }]);
  assert.deepEqual(edition?.resources.map(item => item.title), [draft.resources[0].title]);
});

test("editing an approved activity requires a fresh review and preserves the existing edition", () => {
  const workspace = exampleWorkspace();
  const [item] = suggestActivities(workspace.draft.objective, "extension");
  workspace.draft = reviewActivity({ ...workspace.draft, activities: [item] }, item.id, "approved");
  const first = publishLesson(workspace);
  const edited = reviseActivity(first.draft, item.id, "New wording.");
  assert.equal(edited.activities[0].decision, "pending");
  assert.equal(first.edition?.activities[0].text, item.text);
  const second = publishLesson({ ...first, draft: edited });
  assert.equal(second.edition?.version, 2);
  assert.deepEqual(second.edition?.activities, []);
});

test("blank activities cannot be approved and empty lessons cannot be published", () => {
  const workspace = exampleWorkspace();
  const [item] = suggestActivities(workspace.draft.objective, "guided");
  const draft = { ...workspace.draft, instructions: "", activities: [{ ...item, text: " " }] };
  assert.equal(reviewActivity(draft, item.id, "approved").activities[0].decision, "pending");
  assert.throws(() => publishLesson({ ...workspace, draft }));
  assert.throws(() => publishLesson({ ...workspace, draft: { ...workspace.draft, objective: " " } }));
});

test("a saved edition round-trips and an unknown storage format fails validation", () => {
  const saved = publishLesson(exampleWorkspace());
  assert.deepEqual(workspaceSchema.parse(JSON.parse(JSON.stringify(saved))), saved);
  assert.equal(workspaceSchema.safeParse({ ...saved, format: 99 }).success, false);
});
