import { z } from "zod";

const decision = z.enum(["pending", "approved", "rejected"]);
const activity = z.object({
  id: z.string(), title: z.string(), text: z.string(), decision
});
const resource = z.object({ id: z.string().optional(), title: z.string(), content: z.string(), attached: z.boolean() });
const draftSchema = z.object({
  title: z.string(), objective: z.string(), instructions: z.string(),
  activities: z.array(activity), resources: z.array(resource)
});
const editionSchema = z.object({
  version: z.number().int().positive(), title: z.string(), objective: z.string(),
  instructions: z.string(), activities: z.array(activity.pick({ title: true, text: true })),
  resources: z.array(resource.pick({ id: true, title: true, content: true }))
});
export const workspaceSchema = z.object({
  format: z.literal(1), draft: draftSchema, edition: editionSchema.nullable()
});
export type Workspace = z.infer<typeof workspaceSchema>;
export type Draft = Workspace["draft"];
export type Activity = Draft["activities"][number];
export type Decision = Activity["decision"];

export function reviseActivity(draft: Draft, id: string, text: string): Draft {
  return { ...draft, activities: draft.activities.map(item =>
    item.id === id ? { ...item, text, decision: "pending" } : item) };
}

export function reviewActivity(draft: Draft, id: string, decision: Decision): Draft {
  return { ...draft, activities: draft.activities.map(item =>
    item.id === id && (decision !== "approved" || item.text.trim())
      ? { ...item, decision } : item) };
}

export function publicationIssue(draft: Draft): string | null {
  if (!draft.title.trim() || !draft.objective.trim()) return "Add a title and learning objective to publish.";
  if (!draft.instructions.trim() && !draft.activities.some(item => item.decision === "approved" && item.text.trim()))
    return "Add lesson instructions or approve an activity to publish.";
  return null;
}

export function publishLesson(workspace: Workspace): Workspace {
  const { draft, edition } = workspace;
  const issue = publicationIssue(draft);
  if (issue) throw new Error(issue);
  return {
    ...workspace,
    edition: {
      version: (edition?.version ?? 0) + 1, title: draft.title.trim(),
      objective: draft.objective.trim(), instructions: draft.instructions.trim(),
      activities: draft.activities.filter(item => item.decision === "approved")
        .map(({ title, text }) => ({ title, text })),
      resources: draft.resources.filter(item => item.attached)
        .map(({ attached, ...resource }) => resource)
    }
  };
}
