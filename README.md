# CI/CD Demo Repository with Antigravity AI Integration

This repository demonstrates a complete Node.js project integrated with a CI/CD pipeline powered by GitHub Actions and Google Antigravity.

## Repository Structure

- [src/math.js](file:///workspaces/CI_CD_Demo/src/math.js): Contains core mathematical operations.
- [test/math.test.js](file:///workspaces/CI_CD_Demo/test/math.test.js): Unit tests using Node.js's built-in test runner.
- [package.json](file:///workspaces/CI_CD_Demo/package.json): Defines npm scripts for testing, linting, and project details.
- [AGENTS.md](file:///workspaces/CI_CD_Demo/AGENTS.md): Contains instructions and quality control policies for the AI agent workspace.
- [.github/workflows/ci.yml](file:///workspaces/CI_CD_Demo/.github/workflows/ci.yml): The GitHub Actions pipeline configuration file.

## Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run unit tests:
   ```bash
   npm test
   ```

3. Run linting checks:
   ```bash
   npm run lint
   ```

## CI/CD Pipeline

The GitHub Actions workflow defined in [.github/workflows/ci.yml](file:///workspaces/CI_CD_Demo/.github/workflows/ci.yml) has two main jobs:

1. **Build, Test & Lint**:
   - Checks out code.
   - Installs dependencies.
   - Runs `npm run lint` and `npm test` on every push or pull request to the `main` branch.

2. **Antigravity Code Audit**:
   - Triggers only when `ANTIGRAVITY_TOKEN` is configured as a GitHub Secret.
   - Installs the Antigravity CLI (`agy`).
   - Runs a non-interactive audit of the repository using:
     ```bash
     agy --print "Perform a security, quality, and structure audit on the repository." --dangerously-skip-permissions
     ```
   - Automatically saves and uploads the audit findings (`audit_report.md`) as a build artifact.

## Configuring Antigravity Secrets in GitHub

To enable automated agent audits in your GitHub repository:
1. Generate an `ANTIGRAVITY_TOKEN` from your Antigravity management console.
2. Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
3. Create a new repository secret:
   - **Name**: `ANTIGRAVITY_TOKEN`
   - **Value**: *[Paste your Antigravity Token]*
