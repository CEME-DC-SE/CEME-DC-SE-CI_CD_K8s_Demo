# Agent Instructions for CI_CD_Demo

You are an automated development and CI/CD agent working on the `CI_CD_Demo` repository. 

Follow these instructions during autonomous or semi-autonomous execution:

## 1. Quality Control & Testing
- **Run Tests**: Always run `npm test` after modifying any code to ensure that no functionality is broken.
- **Run Linting**: Always verify formatting and run `npm run lint`.
- **Zero Breakages**: Do not submit changes that break existing unit tests.

## 2. Coding Standards
- Keep code simple, modular, and cleanly documented.
- Use vanilla JavaScript (Node.js ES modules or CommonJS as structured in the project).
- Write new unit tests in the `test/` directory using Node.js's native test runner (`node --test`) for any new features introduced.
- **Minimalist Educational Footprint**: Maintain a clean structure for student tutorials. Do not generate or commit unnecessary IDE/editor configuration directories (such as `.vscode/`), scratch files, or unneeded boilerplate.

## 3. Dependency Management
- Avoid adding third-party dependencies unless explicitly requested by the user. Keep the footprint lightweight.

## 4. Target Deployment Endpoints & Objectives
- **Local Standalone Docker Container**: Serves web app on `http://127.0.0.1:3000/`.
- **Minikube Kubernetes Cluster Service**: Serves microservice on `http://127.0.0.1:8080/`.
- **Kubernetes Telemetry Dashboard**: Accessible via Proxy at `http://127.0.0.1:46723/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/#/workloads?namespace=ci-cd-demo`.

## 5. CI/CD & Secret Resilience
- **Kubeconfig Normalization**: In GitHub Actions deployment workflows (`.github/workflows/cd.yml`), normalize `KUBECONFIG` secrets (strip outer quotes, decode Base64, and unescape JSON) before passing to `kubectl`.
- **Graceful Fallback**: If `KUBECONFIG` is unconfigured or invalid, log a workflow notice (`::notice::`) and skip cluster deployment cleanly so CI/CD image build and site packaging finish with 100% success.

