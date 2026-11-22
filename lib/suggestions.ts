import type { Activity } from "./lesson";

export type ClassNeed = "guided" | "extension";
export function suggestActivities(objective: string, need: ClassNeed): Activity[] {
  const goal = objective.trim();
  if (!goal) throw new Error("Enter a learning objective first.");
  const plans = need === "guided" ? [
    ["Worked example", "Ask a partner to model the first step towards this goal: " + goal + " Repeat the step with a new example and explain what stayed the same."],
    ["Check for understanding", "In pairs, draw or describe one example that meets this goal: " + goal + " Exchange examples and identify one piece of evidence."]
  ] : [
    ["Find the exception", "Construct an example and a near miss for this goal: " + goal + " Ask a classmate to distinguish them and justify the decision."],
    ["Teach it back", "Design a short challenge for another group based on this goal: " + goal + " Include a solution and explain a common mistake."]
  ];
  return plans.map(([title, text], index) => ({
    id: need + "-" + index, title, text, decision: "pending"
  }));
}
