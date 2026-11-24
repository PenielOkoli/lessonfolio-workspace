import { useState, type FormEvent } from "react";
import type { Draft } from "../lib/lesson";

type ResourceText = Pick<Draft["resources"][number], "title" | "content">;

type Props = {
  initial?: ResourceText;
  onSave: (fields: ResourceText) => void;
  onCancel?: () => void;
};

export function ResourceForm({ initial, onSave, onCancel }: Props) {
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

    onSave({ title, content });
    if (!initial) form.reset();
    setError("");
  }

  return (
    <form onSubmit={save} onChange={() => setError("")}>
      <label>Resource title<input name="title" defaultValue={initial?.title} autoFocus={!!initial} required /></label>
      <label>Question or instructions<textarea name="content" defaultValue={initial?.content} rows={3} required /></label>
      {error && <p role="alert">{error}</p>}
      <div className="actions">
        <button type="submit" className="outline">{initial ? "Save changes" : "Save resource"}</button>
        {onCancel && <button type="button" className="quiet" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
