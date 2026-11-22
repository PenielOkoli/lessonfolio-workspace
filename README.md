# Lessonfolio • AI-Assisted Teacher Workspace

FlexiSAF Frontend Advanced capstone, project 5. Lessonfolio helps a teacher prepare one lesson, adapt activities to a class, review suggestions and publish a student edition.

## First milestone

A single-device prototype with an editable lesson, guided-practice and extension suggestions, teacher approval, two attachable resources and a student preview. Suggestions come from labelled rules. The browser saves this notebook locally. A different browser opens its own sample. A public student link, teacher accounts and a hosted model are future decisions.

**Try it.** Open the teacher desk, suggest activities, rewrite and approve one, reject the other, attach the worksheet and publish. Open the worksheet in Student view. Return to the desk and edit the approved activity. The copy you already published stays readable until you publish again.

## Run locally

Use Node.js 22 and npm. From this repository:

```sh
npm install
npm run dev
```

Open http://localhost:3000. Run `npm test`, `npm run typecheck` and `npm run build` to check a change.

## Start learning

- [First code walkthrough and hands-on lab](docs/first-session.md)
- [Product brief, release targets and collaboration record](docs/product.md)
- [Publishing and approval rules](lib/lesson.ts)
- [Example lesson and worksheets](lib/sample.ts)
- [Behaviour tests](tests/lesson.test.ts) and [browser walkthrough tests](tests/browser/publishing.spec.ts)
- [Build results and downloadable browser screenshots](https://github.com/PenielOkoli/lessonfolio-workspace/actions/workflows/check.yml)

For the browser checks, run `npx playwright install chromium`, `npm run build` and `npm run test:browser`. Each viewport exercises the full approval flow and reloads the saved notebook.

The release evidence will grow with the project. The final README should lead with the verified live site and link to desktop/mobile screenshots, the colour palette, test results, the presentation PDF, demo and AI-use reflection.
