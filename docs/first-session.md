# First session • Follow one teacher decision

**Outcome.** Explain what changes when a teacher approves, edits and publishes an activity. Allow 25 minutes. Keep the app, the code and the test output open together.

## 1. Predict the student view

Generate two activities. Rewrite the first in your own words and approve it. Reject the second. Publish and open the student edition. Read the exact text that survived. Return to the desk, change one word in the approved activity, then open Student view again without publishing. Predict which wording you will see before looking.

## 2. Trace the click

1. In `app/lesson-desk.tsx`, search for `reviewActivity`. The button passes the activity ID and the teacher's decision to a function. React holds the new draft and renders the updated badge.
2. In `lib/lesson.ts`, the review function uses `map` to replace the matching activity. Other activities keep their values. A pure function lets you exercise that decision without starting the website.
3. Find `reviseActivity`. Changing wording returns the activity to pending. Approval applies to the words the teacher actually read.
4. Find `publishLesson`. The filter selects approved activities. The map copies only the title and student-facing text. Publication also copies the selected resources and increases the edition number.
5. In the student view, find the loop over `edition.activities`. That view reads the copy produced at publication. Draft changes can only reach it through another publication.

## 3. Make your first commit

Open `lib/sample.ts`. Write your own exit-ticket question for the example lesson. Decide what observation would convince a teacher that a student understands the objective. Keep the question synthetic and add a one-sentence rationale in your own words to your commit. The example seeds a new notebook, so open a fresh browser profile to see your change. Run `npm test` and compare the student view with the exit ticket attached and detached.

## 4. Explain it back

- If the published view were bound directly to the editable draft, what would a student see while the teacher typed?
- Which line prevents a rejected activity entering a new edition?
- What happens to an approved activity after a one-word edit? Which test demonstrates that?
- A student opens the live homepage on another phone. Which data would a server have to store and return for them to see *your* edition?

For the next session, bring your changed question and one decision you disagree with. We can review the diff together. Record observations only after you perform the exercise.
