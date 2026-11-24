import { useState, type FormEvent } from "react";
import type { Draft } from "../lib/lesson";

type Resource = Draft["resources"][number];

export function ResourceForm({ onSave }: { onSave: (resource: Resource) => void }) {
  const [error, setError] = useState("");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const title = String(fields.get("title") ?? "").trim();
    const content = String(fields.get("content") ?? "").trim();

    if (!title || !content) {
      setError("Enter both a title and a question or instructions.");
      return;
    }

    onSave({ id: crypto.randomUUID(), title, content, attached: false });
    form.reset();
    setError("");
  }

  return (
    <details className="resourceForm">
      <summary>Add a resource</summary>
      <form onSubmit={save} onChange={() => setError("")}>
        <label>Resource title<input name="title" required /></label>
        <label>Question or instructions<textarea name="content" rows={3} required /></label>
        {error && <p role="alert">{error}</p>}
        <button type="submit" className="outline">Save resource</button>
      </form>
    </details>
  );
}
