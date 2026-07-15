# Antigravity CI/CD Integration & Configuration Guide

This guide details how to configure a Continuous Integration (CI) and Continuous Delivery/Deployment (CD) pipeline utilizing the **Antigravity CLI (`agy`)**.

---

## 1. Workflow Architecture

The diagram below illustrates how standard build-and-test steps run alongside the automated Antigravity AI Code Audit:

```mermaid
graph TD
    A["Code Push / PR"] --> B["GitHub Actions Runner"]
    B --> C["Job 1: Build, Test & Lint"]
    C --> D{"Tests Pass?"}
    D -- "No" --> E["Pipeline Fails"]
    D -- "Yes" --> F["Job 2: Antigravity Code Audit"]
    F --> G{"ANTIGRAVITY_TOKEN exists?"}
    G -- "No" --> H["Skip Audit / Pipeline Success"]
    G -- "Yes" --> I["Install agy CLI"]
    I --> J["Run non-interactive agy audit"]
    J --> K["Upload Audit Report Artifact"]
    K --> L["Pipeline Success"]
```

---

## 2. CI/CD Files Configured

The following configurations are placed at the root of the project:
1. **[.github/workflows/ci.yml](file:///workspaces/CI_CD_Demo/.github/workflows/ci.yml)**: The GitHub Actions configuration file.
2. **[AGENTS.md](file:///workspaces/CI_CD_Demo/AGENTS.md)**: Contains rules and execution policies for the AI agent inside the workspace.

### GitHub Actions YAML

Below is the workflow code defined in [.github/workflows/ci.yml](file:///workspaces/CI_CD_Demo/.github/workflows/ci.yml):

```yaml
name: CI/CD Pipeline with Antigravity Agent

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    name: Build, Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Install Dependencies
        run: npm install

      - name: Run Linter
        run: npm run lint

      - name: Run Tests
        run: npm test

  antigravity-audit:
    name: Antigravity Code Audit
    needs: build-and-test
    runs-on: ubuntu-latest
    env:
      ANTIGRAVITY_TOKEN: ${{ secrets.ANTIGRAVITY_TOKEN }}
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Install Antigravity CLI
        if: ${{ env.ANTIGRAVITY_TOKEN != '' }}
        run: |
          curl -fsSL https://antigravity.google/cli/install.sh | bash
          echo "$HOME/.local/bin" >> $GITHUB_PATH

      - name: Run Automated Audit
        if: ${{ env.ANTIGRAVITY_TOKEN != '' }}
        run: |
          echo "### Antigravity AI Code Audit Report" > audit_report.md
          echo "Generated on: $(date)" >> audit_report.md
          echo "" >> audit_report.md
          agy --print "Perform a security, quality, and structure audit on the repository. Highlight potential issues, code quality, and adherence to AGENTS.md instructions. Format the output in Markdown." --dangerously-skip-permissions >> audit_report.md

      - name: Upload Audit Report
        if: ${{ env.ANTIGRAVITY_TOKEN != '' }}
        uses: actions/upload-artifact@v4
        with:
          name: antigravity-audit-report
          path: audit_report.md
```

> [!IMPORTANT]
> The `--dangerously-skip-permissions` flag is critical here. Since the agent executes commands autonomously inside the runner, it would otherwise halt the workflow waiting for interactive human approval.

---

## 3. Configuration & Authentication Details

### A. Environment Variables
Because CI environments cannot display a browser window for Google Sign-In, the CLI uses:
* **`ANTIGRAVITY_TOKEN`**: A persistent machine token generated from the Antigravity developer dashboard.

> [!CAUTION]
> Treat the `ANTIGRAVITY_TOKEN` as a high-security credential. Never hardcode it directly into your YAML workflow file. Instead, save it as a **GitHub Actions Secret** (`secrets.ANTIGRAVITY_TOKEN`).

### B. Headless Execution Flags
When running `agy` programmatically or inside workflows, use the following options:
* **`-p` or `--print`**: Runs a single prompt non-interactively and prints the response to stdout.
* **`--dangerously-skip-permissions`**: Instructs the agent to automatically approve all permission prompts (e.g. read/write files or execute commands).

---

## 4. Local Validation

Before pushing your changes, you can validate the code and formatting locally using:
* **Run Tests**: `npm test` (uses [test/math.test.js](file:///workspaces/CI_CD_Demo/test/math.test.js))
* **Run Linter**: `npm run lint` (uses Node's native compiler `--check` to verify syntax)

---

## 5. How Tests and Linting Work Under the Hood

### A. Test Execution & Discovery
When you run `npm test`, it calls Node's native test runner (`node --test test/*.test.js`):
1. **Runner Invocation:** Node.js executes the built-in test runner without needing third-party testing frameworks.
2. **File Discovery:** The glob pattern `test/*.test.js` matches and runs all test suites located in the `test/` directory.
3. **Execution:** Assertions defined using `node:assert` are evaluated, returning success (`✔`) or descriptive failure logs.

### B. Linter & Syntax Checking
When you run `npm run lint`, it runs `node --check src/*.js test/*.js`:
1. **Compilation Check:** The `--check` flag compile-checks the JavaScript files to catch syntax errors without executing the code.
2. **Path Discovery:** It checks all `.js` files in `src/` and `test/` folders.

