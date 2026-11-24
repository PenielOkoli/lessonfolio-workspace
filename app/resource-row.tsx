import { useRef, useState } from "react";
import type { Draft } from "../lib/lesson";
import { ResourceForm } from "./resource-form";

type Resource = Draft["resources"][number];

type Props = {
  item: Resource;
  onAttach: (attached: boolean) => void;
  onSave: (fields: Pick<Resource, "title" | "content">) => void;
};

export function ResourceRow({ item, onAttach, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const editButton = useRef<HTMLButtonElement>(null);

  function closeEditor() {
    setEditing(false);
    editButton.current?.focus();
  }

  return (
    <div>
      <label className="resource">
        <input type="checkbox" checked={item.attached} onChange={event => onAttach(event.currentTarget.checked)} />
        <span><strong>{item.title}</strong><small>{item.content}</small></span>
      </label>
      <button type="button" className="quiet" ref={editButton} aria-label={`Edit ${item.title}`}
        aria-expanded={editing} onClick={() => setEditing(!editing)}>Edit</button>
      {editing && <ResourceForm initial={item} onCancel={closeEditor} onSave={fields => {
        onSave(fields);
        closeEditor();
      }} />}
    </div>
  );
}
