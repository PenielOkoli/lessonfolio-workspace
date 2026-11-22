"use client";

import { useEffect, useState } from "react";
import { BookOpen, Check, ClipboardList, FileText, Layers, Library, Send, Sparkles } from "lucide-react";
import { classroom, exampleWorkspace } from "../lib/sample";
import { publicationIssue, publishLesson, reviewActivity, reviseActivity, workspaceSchema } from "../lib/lesson";
import type { Draft, Workspace } from "../lib/lesson";
import { suggestActivities, type ClassNeed } from "../lib/suggestions";

const key = "lessonfolio.workspace.v1";

export function LessonDesk() {
  const [workspace, setWorkspace] = useState<Workspace>(exampleWorkspace);
  const [ready, setReady] = useState(false);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [storageNote, setStorageNote] = useState("Opening notebook…");
  const [notice, setNotice] = useState("");
  const [student, setStudent] = useState(false);
  const [need, setNeed] = useState<ClassNeed>("guided");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setWorkspace(workspaceSchema.parse(JSON.parse(raw)));
      setSaveEnabled(true);
    } catch {
      setStorageNote("Session only. Your saved notebook could not be opened.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!saveEnabled) return;
    try {
      localStorage.setItem(key, JSON.stringify(workspace));
      setStorageNote("Saved on this device");
    } catch {
      setStorageNote("Session only. Browser storage is unavailable.");
    }
  }, [workspace, saveEnabled]);

  const { draft, edition } = workspace;
  const approved = draft.activities.filter(item => item.decision === "approved").length;
  const attachments = draft.resources.filter(item => item.attached).length;
  const issue = publicationIssue(draft);

  function edit(change: (current: Draft) => Draft) {
    setWorkspace(current => ({ ...current, draft: change(current.draft) }));
    setNotice("");
  }
  function suggest() {
    const batchId = crypto.randomUUID();
    const activities = suggestActivities(draft.objective, need).map(item => ({ ...item, id: batchId + "-" + item.id }));
    edit(current => ({ ...current, activities: [...current.activities, ...activities] }));
    setNotice("Two suggestions are ready for review.");
  }
  function publish() {
    setWorkspace(current => publishLesson(current));
    setStudent(true);
    setNotice("Student edition published on this device.");
    window.scrollTo(0, 0);
  }
  return <>
    <header><div className="bar"><span className="brand"><Library aria-hidden="true"/> Lessonfolio</span>
      <nav aria-label="Workspace views">
        <button aria-pressed={!student} onClick={() => setStudent(false)}>Teacher desk</button>
        <button aria-pressed={student} onClick={() => setStudent(true)}>Student view</button>
      </nav></div></header>
    <main>
      <div className="mast"><p className="eyebrow">{classroom}</p>
        <h1>{student ? "Student edition" : "Lesson notebook"}</h1>
        <p className="sub">{student ? "The latest lesson published on this device." : "Prepare your lesson and decide what reaches the classroom."}</p>
      </div>
      <p role="status" className={notice ? "notice" : "sr"}>{notice}</p>
      {student ? <article className="paper reading">
        {edition ? <>
          <p className="eyebrow">Edition {edition.version}</p><h2>{edition.title}</h2>
          <h3>Learning objective</h3><p>{edition.objective}</p>
          {edition.instructions && <><h3>Instructions</h3><p>{edition.instructions}</p></>}
          {edition.activities.map((item, i) => <section key={i}><h3>{item.title}</h3><p>{item.text}</p></section>)}
          {edition.resources.length > 0 && <h3>Learning resources</h3>}
          {edition.resources.map(item => <details key={item.title}><summary>{item.title}</summary><p>{item.content}</p></details>)}
        </> : <><BookOpen/><h2>Your first edition starts at the teacher desk.</h2><p>Publish a lesson to see the student copy here.</p></>}
        <button className="outline" onClick={() => setStudent(false)}>Return to teacher desk</button>
      </article> : <div className="grid"><fieldset disabled={!ready} className="editor" aria-label="Lesson editor">
        <section className="paper"><div className="sectionTitle"><FileText/><h2>Lesson draft</h2></div>
          <label>Lesson title<input value={draft.title} onChange={e => edit(d => ({ ...d, title: e.target.value }))}/></label>
          <label>Learning objective<textarea rows={2} value={draft.objective} onChange={e => edit(d => ({ ...d, objective: e.target.value }))}/></label>
          <label>Student instructions<textarea rows={3} value={draft.instructions} onChange={e => edit(d => ({ ...d, instructions: e.target.value }))}/></label>
        </section>
        <section className="paper"><div className="sectionTitle"><Sparkles/><h2>Activity suggestions</h2></div>
          <p className="muted">Rule-based drafts use your objective and the support your class needs. Approve each activity you want to include.</p>
          <label>Class need<select value={need} onChange={e => setNeed(e.target.value as ClassNeed)}><option value="guided">Guided practice</option><option value="extension">Extension challenge</option></select></label>
          <button className="outline" disabled={!draft.objective.trim()} onClick={suggest}>Suggest activities</button>
          {draft.activities.map((item, index) => <article className="activity" key={item.id}>
            <div className="row"><strong>{item.title}</strong><span className="tag">{item.decision}</span></div>
            <label>Activity {index + 1}<textarea rows={3} value={item.text} onChange={e => edit(d => reviseActivity(d, item.id, e.target.value))}/></label>
            <div className="actions"><button className="outline" disabled={!item.text.trim() || item.decision === "approved"} onClick={() => edit(d => reviewActivity(d, item.id, "approved"))}><Check size={15}/> Approve</button>
            <button className="quiet" disabled={item.decision === "rejected"} onClick={() => edit(d => reviewActivity(d, item.id, "rejected"))}>Reject</button></div>
          </article>)}
        </section>
        <section className="paper"><div className="sectionTitle"><Layers/><h2>Resources</h2></div>
        {draft.resources.map((item, index) => <label className="resource" key={item.title}><input type="checkbox" checked={item.attached} onChange={e => edit(d => ({ ...d, resources: d.resources.map((r, i) => i === index ? { ...r, attached: e.target.checked } : r) }))}/>
        <span><strong>{item.title}</strong><small>{item.content}</small></span></label>)}</section>
      </fieldset>
      <aside className="paper publish"><ClipboardList/><h2>Publish lesson</h2><p>Students see a separate copy. Later edits stay in your draft until you publish again.</p>
        <dl><div><dt>Approved activities</dt><dd>{approved}</dd></div><div><dt>Attached resources</dt><dd>{attachments}</dd></div>
        <div><dt>Latest edition</dt><dd>{edition ? "v" + edition.version : "Unpublished"}</dd></div></dl>
        {issue && <p>{issue}</p>}
        <button className="primary" disabled={!ready || !!issue} onClick={publish}><Send size={16}/>Publish student edition</button>
        <small>{storageNote}</small></aside>
      </div>}
    </main></>;
}
