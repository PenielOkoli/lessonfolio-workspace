"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, Check, CheckCircle2, ChevronDown, CircleAlert, ClipboardList, FileText, Layers, LayoutDashboard, Plus, Send, Sparkles } from "lucide-react";
import { NotebookCover } from "./notebook-cover";
import { ResourceRow } from "./resource-row";
import { ResourceForm } from "./resource-form";
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
  function updateResource(index: number, changes: Partial<Pick<Draft["resources"][number], "title" | "content" | "attached">>) {
    edit(current => ({
      ...current,
      resources: current.resources.map((item, i) => i === index ? { ...item, ...changes } : item)
    }));
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
  function openView(showStudent: boolean) {
    setStudent(showStudent);
    setNotice("");
    window.scrollTo(0, 0);
  }

  const heading = student ? edition?.title || "Student edition" : draft.title.trim() || "Untitled lesson";

  return <>
    <a className="skip" href="#notebook">Skip to lesson</a>
    <header className="topbar"><div className="bar">
      <span className="brand"><img src="/folio.svg" width="34" height="34" alt="" />Lessonfolio</span>
      <nav className="views" aria-label="Workspace views">
        <button aria-pressed={!student} onClick={() => openView(false)}><LayoutDashboard/>Teacher desk</button>
        <button aria-pressed={student} onClick={() => openView(true)}><BookOpen/>Student view</button>
      </nav>
      <span className="saveState">{saveEnabled && storageNote === "Saved on this device" ? <CheckCircle2/> : <CircleAlert/>}{storageNote}</span>
    </div></header>
    <main id="notebook" tabIndex={-1}>
      <div className="mast">
        <div className="mastText">
          <p className="mastMeta"><span>{student ? "Student edition" : "Lesson notebook"}</span><i aria-hidden="true"/>{classroom}</p>
          <h1>{heading}</h1>
          <p className="sub">{student ? (edition ? `Edition ${edition.version} · Published on this device` : "Published lessons appear here.") : "Prepare your lesson, review activities and choose what your students see."}</p>
        </div>
        <NotebookCover/>
      </div>
      {!student && <nav className="mobileSections" aria-label="Jump to lesson section">
        <a href="#lesson-draft">Draft</a><a href="#lesson-activities">Activities</a>
        <a href="#lesson-resources">Resources</a><a href="#publish-lesson">Publish</a>
      </nav>}
      <p role="status" className={notice ? "notice" : "sr"}>{notice}</p>
      {student ? <article className="paper reading">
        {edition ? <>
          <h2>Learning objective</h2><p>{edition.objective}</p>
          {edition.instructions && <><h2>Instructions</h2><p>{edition.instructions}</p></>}
          {edition.activities.map((item, i) => <section key={i}><h2>{item.title}</h2><p>{item.text}</p></section>)}
          {edition.resources.length > 0 && <h2>Learning resources</h2>}
          {edition.resources.map((item, index) => <details key={item.id ?? `sample-${index}`}><summary>{item.title}</summary><p>{item.content}</p></details>)}
        </> : <><BookOpen/><h2>Your first edition starts at the teacher desk.</h2><p>Publish a lesson to see the student copy here.</p></>}
        <button className="outline" onClick={() => openView(false)}>Return to teacher desk</button>
      </article> : <div className="grid"><fieldset disabled={!ready} className="editor" aria-label="Lesson editor">
        <section id="lesson-draft" className="paper"><div className="sectionTitle"><FileText/><h2>Lesson draft</h2></div>
          <label>Lesson title<input value={draft.title} onChange={e => edit(d => ({ ...d, title: e.target.value }))}/></label>
          <label>Learning objective<textarea rows={2} value={draft.objective} onChange={e => edit(d => ({ ...d, objective: e.target.value }))}/></label>
          <label>Student instructions<textarea rows={3} value={draft.instructions} onChange={e => edit(d => ({ ...d, instructions: e.target.value }))}/></label>
        </section>
        <section id="lesson-activities" className="paper"><div className="sectionTitle"><Sparkles/><h2>Activity suggestions</h2></div>
          <p className="muted">Rule-based drafts use your objective and the support your class needs. Approve each activity you want to include.</p>
          <label>Class need<select value={need} onChange={e => setNeed(e.target.value as ClassNeed)}><option value="guided">Guided practice</option><option value="extension">Extension challenge</option></select></label>
          <button className="outline" disabled={!draft.objective.trim()} onClick={suggest}>Suggest activities</button>
          {draft.activities.map((item, index) => <article className="activity" key={item.id}>
            <div className="row"><strong>{item.title}</strong><span className={`tag ${item.decision}`}>{item.decision}</span></div>
            <label>Activity {index + 1}<textarea rows={3} value={item.text} onChange={e => edit(d => reviseActivity(d, item.id, e.target.value))}/></label>
            <div className="actions"><button className="outline" disabled={!item.text.trim() || item.decision === "approved"} onClick={() => edit(d => reviewActivity(d, item.id, "approved"))}><Check size={15}/> Approve</button>
            <button className="quiet" disabled={item.decision === "rejected"} onClick={() => edit(d => reviewActivity(d, item.id, "rejected"))}>Reject</button></div>
          </article>)}
        </section>
        <section id="lesson-resources" className="paper"><div className="sectionTitle"><Layers/><h2>Resources</h2></div>
          <details className="resourceForm">
            <summary><Plus aria-hidden="true"/>Add a resource<ChevronDown aria-hidden="true" className="chevron"/></summary>
            <ResourceForm onSave={fields => {
              const resource = { ...fields, id: crypto.randomUUID(), attached: false };
              edit(current => ({ ...current, resources: [...current.resources, resource] }));
              setNotice("Resource saved. Select its checkbox to attach it to the lesson.");
            }} />
          </details>
          {draft.resources.map((item, index) => (
            <ResourceRow key={item.id ?? `sample-${index}`} item={item}
              onAttach={attached => updateResource(index, { attached })}
              onSave={fields => {
                updateResource(index, fields);
                setNotice("Resource updated in your draft.");
              }} />
          ))}
        </section>
      </fieldset>
      <aside className="rail" aria-label="Lesson publishing and navigation">
        <section id="publish-lesson" className="paper publish"><div className="sectionTitle"><ClipboardList/><h2>Publish lesson</h2></div>
        <p>Publish a copy for your students. You can keep editing your draft afterwards.</p>
        <dl><div><dt>Approved activities</dt><dd>{approved}</dd></div><div><dt>Attached resources</dt><dd>{attachments}</dd></div>
        <div><dt>Latest edition</dt><dd>{edition ? "v" + edition.version : "Unpublished"}</dd></div></dl>
        {issue && <p className="issue"><CircleAlert/>{issue}</p>}
        <button className="primary" disabled={!ready || !!issue} onClick={publish}><Send size={16}/>Publish student edition</button>
        </section>
        <nav className="contents" aria-label="Jump to lesson section">
          <h2>In this notebook</h2>
          <a href="#lesson-draft"><FileText/>Lesson draft<ArrowUpRight/></a>
          <a href="#lesson-activities"><Sparkles/>Activity suggestions<ArrowUpRight/></a>
          <a href="#lesson-resources"><Layers/>Resources<ArrowUpRight/></a>
        </nav>
      </aside>
      </div>}
    </main></>;
}
