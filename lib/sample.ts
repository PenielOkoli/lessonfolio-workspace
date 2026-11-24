import type { Workspace } from "./lesson";

export const classroom = "JSS2 Mathematics";
export function exampleWorkspace(): Workspace {
  return {
    format: 1, edition: null,
    draft: {
      title: "Equivalent fractions",
      objective: "Use a diagram to explain why two different fractions can represent the same amount.",
      instructions: "Fold two equal strips of paper. Shade one half of the first strip and two quarters of the second. Compare the shaded lengths.",
      activities: [],
      resources: [
        { title: "Fraction strips worksheet", content: "Draw three equal bars. Divide them into halves, quarters and eighths. Shade the same amount in each. Write the three equivalent fractions.", attached: true },
        { title: "Exit ticket", content: "A friend argues 2/6 is larger than 1/3 because 6 is larger than 3. Prove him by drawing diagrams of both fractions to find out if your friend is correct or not.", attached: false }
      ]
    }
  };
}
