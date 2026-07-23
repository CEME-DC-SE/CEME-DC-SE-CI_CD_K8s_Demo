# GitHub Project: CI/CD Pipeline Development Tasks

This task list is designed to be imported or added as cards to your GitHub Project Kanban board (To-Do, In-Progress, Done) to track your progress as you learn how to develop, test, and automate CI/CD pipelines.

---

### Task 1: Setup Repository & Local Validation
*   **Description:** Initialize the project, configure dependencies, and verify that the application has working tests and style check scripts locally.
*   **Steps:**
    1. Ensure Node.js and dependencies are installed (`npm install`).
    2. Run local tests: `npm test` and verify that 5 math test cases pass.
    3. Run the linter: `npm run lint` and verify there are no compilation/syntax errors.
*   **Acceptance Criteria (Done):**
    *   [ ] Local commands `npm test` and `npm run lint` complete successfully with zero errors.

---

### Task 2: Create Basic GitHub Actions Workflow
*   **Description:** Create a basic CI pipeline that runs style checks and unit tests automatically whenever code is pushed or a PR is opened.
*   **Steps:**
    1. Create a `.github/workflows/` directory in the root of the project.
    2. Create a `ci.yml` workflow file.
    3. Define a job `build-and-test` that runs on `ubuntu-latest`, installs Node.js, installs dependencies, and runs `npm run lint` and `npm test`.
*   **Acceptance Criteria (Done):**
    *   [ ] The workflow file exists at `.github/workflows/ci.yml`.
    *   [ ] A git push triggers the workflow, and the "Build, Test & Lint" job passes in the Actions tab.

---

### Task 3: Securely Configure Repository Secrets
*   **Description:** Locate the active session credentials in your workspace and store them securely in GitHub Secrets to allow headless/automated pipelines to authenticate.
*   **Steps:**
    1. Retrieve the OAuth refresh token string from the file `~/.gemini/antigravity-cli/antigravity-oauth-token` in your Codespace.
    2. Navigate to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
    3. Add a new repository secret named `ANTIGRAVITY_TOKEN` with the value of the refresh token.
*   **Acceptance Criteria (Done):**
    *   [ ] The `ANTIGRAVITY_TOKEN` is saved under GitHub Repository Secrets.

---

### Task 4: Integrate AI Code Audit & Configure Credentials
*   **Description:** Add a second job to the pipeline to run the Antigravity AI Code Audit. Configure it to write credentials dynamically on the runner so the CLI runs fully authenticated.
*   **Steps:**
    1. Add the `antigravity-audit` job to `.github/workflows/ci.yml`.
    2. Configure the `Configure Credentials` step in the workflow to write the token JSON to `$HOME/.gemini/antigravity-cli/antigravity-oauth-token`.
    3. Add the step to install the CLI and trigger `agy --print "Perform a security, quality, and structure audit..."`.
*   **Acceptance Criteria (Done):**
    *   [ ] The `Configure Credentials` and `Run Automated Audit` steps are correctly defined in `.github/workflows/ci.yml`.
    *   [ ] The job executes without prompting for interactive authentication.

---

### Task 5: Configure and Verify Audit Report Artifacts
*   **Description:** Set up the workflow to capture the audit output (`audit_report.md`) and upload it as a downloadable build artifact in the Actions run.
*   **Steps:**
    1. In `.github/workflows/ci.yml`, direct the output of the `agy` audit command to `audit_report.md`.
    2. Add the `actions/upload-artifact@v4` step to save `audit_report.md` as an artifact named `antigravity-audit-report`.
*   **Acceptance Criteria (Done):**
    *   [ ] The workflow uploads `audit_report.md`.
    *   [ ] After a successful run, a downloadable zip file named `antigravity-audit-report` appears under the artifacts section in the workflow run.

---

### Task 6: Trigger, Monitor, and Fix Failures
*   **Description:** Make a change to the repository, push it to trigger the entire pipeline, and monitor execution. Fix any lint, test, or authentication issues.
*   **Steps:**
    1. Make a small code or docs change in the repository.
    2. Commit and push the changes to `main`.
    3. Open the GitHub **Actions** tab, select the latest run, and monitor both jobs.
    4. Review job logs for any warnings or errors and correct them.
*   **Acceptance Criteria (Done):**
    *   [ ] The full pipeline (both jobs) passes with green checkmarks.

---

### Task 7: Set up a Kanban Project Board
*   **Description:** Create a GitHub Project board to visually track your learning and progress through the tasks.
*   **Steps:**
    1. In GitHub, navigate to **Projects** (at the Organization or Profile level) -> **New Project** -> Select **Board** template.
    2. Customize the columns to: **To-Do**, **In Progress**, and **Done**.
    3. Link the project to your repository.
    4. Create cards for Tasks 1 to 6 and practice moving them across columns as they progress.
*   **Acceptance Criteria (Done):**
    *   [ ] The Kanban board is fully set up and linked to the repository.
    *   [ ] Tasks are populated and moved to "Done" as they are completed.
