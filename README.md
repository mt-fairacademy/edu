# EDU — Fair Academy Portal

This repository hosts the **Fair Academy Education Portal** as a static website on **GitHub Pages**.

- **Live hub:** `https://mt-fairacademy.github.io/edu/`
- **Main entry file:** `index.html`

The site is organized as a single hub page with “course cards”, each linking into a course folder under `/courses/`.

---

## Repository structure

```text
/
  index.html                # Hub page (all course cards + dropdown menus)
  README.md
  shared/
    hub.css                 # Hub styling (index.html)
    quiz.css                # Shared quiz styling (used by course quizzes/tests)
    quiz.js                 # Shared quiz engine logic (used by course quizzes/tests)
  courses/
    <course-slug>/
      password-gate.html
      test-1.html
      quiz-1.html
      test-2.html
      materials.html
```

### What is “course-slug”?
A short folder name used in URLs. Examples:
- `buseth`
- `scm`
- `susfashion`

Rule of thumb: lowercase, no spaces, use `-` if needed.

---

## How to add a new course (recommended workflow)

### 1) Create the course folder
Create a new directory:

```text
courses/<course-slug>/
```

### 2) Copy a working template from an existing course
Pick an existing course that already works (for example `courses/buseth/`) and copy these files into the new folder:

- `password-gate.html`
- `test-1.html`
- `quiz-1.html`
- `test-2.html`
- `materials.html`

Then edit the **titles/text/questions** inside the copied files.

> Tip: Keep filenames consistent across courses (`test-1.html`, `quiz-1.html`, etc.).  
> It makes the hub dropdown options predictable and fast to manage.

### 3) Add the course to the hub (`index.html`)
In `index.html`, add a new `.course-card` with:
- course name and description
- a dropdown with options pointing to your new course:

Example URL pattern:

- `courses/<course-slug>/password-gate.html?to=test-1.html`
- `courses/<course-slug>/password-gate.html?to=quiz-1.html`
- `courses/<course-slug>/password-gate.html?to=test-2.html`
- `courses/<course-slug>/password-gate.html?to=materials.html`

### 4) Commit & deploy
Commit to `main` (or open a PR). GitHub Pages will update automatically after a short delay.

---

## Styling

### Hub styling
The hub page (`index.html`) uses:

- `shared/hub.css`

### Quiz styling & logic
Course quiz/test pages typically use:

- `shared/quiz.css`
- `shared/quiz.js`

If you change the quiz engine, it may affect **all** courses that reference these files.

---

## Editing and publishing

### Recommended workflow
1. Create a branch for changes
2. Open a Pull Request into `main`
3. Merge
4. Wait ~1–5 minutes for GitHub Pages to update

### Cache note
If changes don’t appear immediately, do a hard refresh:
- Windows/Linux: `Ctrl + F5`
- macOS: `Cmd + Shift + R`

---

## Notes / conventions

- This is a **static** site (no server). The password gate is client-side.
- Keep course content inside `/courses/<course-slug>/` to stay consistent.
- Shared assets belong in `/shared/`.
