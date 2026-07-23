# Implementation Plan: Docker & Kubernetes-Based CI/CD Pipeline & Live Cluster Demo

This document outlines the step-by-step plan to transition the Web Calculator application into a complete **Docker and Kubernetes (K8s) based CI/CD pipeline** with live container verification and a Cluster Dashboard demo.

## 1. Goal Description
The objective is to refine and expand the repository (`CEME-DC-SE-CI_CD_K8s_Demo`) into a production-grade containerized microservice demonstration:
1. **Docker Containerization**: Optimize and verify multi-stage `Dockerfile` build for lightweight, secure node deployment.
2. **CI Pipeline Enhancement**: Update `.github/workflows/ci.yml` to include automated Docker image build, linting, testing, and container health verification.
3. **CD Pipeline Enhancement**: Update `.github/workflows/cd.yml` to build, tag, and publish Docker images to GitHub Container Registry (`ghcr.io`), followed by Kubernetes deployment manifest updates.
4. **Kubernetes Deployment**: Ensure all Kubernetes manifests (`k8s/namespace.yaml`, `k8s/deployment.yaml`, `k8s/service.yaml`, `k8s/ingress.yaml`) are fully aligned with Downward API pod telemetry (`POD_NAME`, `POD_IP`, `NODE_NAME`).
5. **Live App & Cluster Dashboard Demo**: Provide end-to-end instructions and local/cloud execution commands for running the app in Docker/K8s, accessing the web calculator, and launching the Kubernetes Cluster Dashboard.

---

## 2. User Review Required

> [!IMPORTANT]
> **Container Registry & Cluster Target Selection**
> - **Container Registry**: Defaulting to GitHub Container Registry (`ghcr.io/${{ github.repository }}`).
> - **CD Deployment Target**: For GitHub Actions automation, CD will publish immutable container images and render production manifests. For local demonstration (Minikube / Docker Desktop / Kind / K3s), local `kubectl` commands and local cluster dashboard access commands (`minikube dashboard` or `kubectl port-forward`) will be documented and verified.

---

## 3. Open Questions

1. **Local Kubernetes Engine**: Which local Kubernetes environment do you plan to use for the live demo? (Options: Minikube, Docker Desktop K8s, Kind, K3s, or a Cloud K8s cluster like GKE/EKS)?
2. **Kubernetes Dashboard Preference**: Would you prefer using the built-in **In-App Visual Cluster Dashboard** (already embedded in the web app UI showing pod IPs, node names, and load balancing), or also deploying the official **Kubernetes Web UI Dashboard** via `kubectl`?

---

## 4. Proposed Changes & Implementation Strategy

### Component 1: CI Workflow Update (`.github/workflows/ci.yml`)
Add Docker build and container validation steps alongside existing Node.js unit tests.

#### [MODIFY] [.github/workflows/ci.yml](file:///workspaces/CEME-DC-SE-CI_CD_K8s_Demo/.github/workflows/ci.yml)
- Add `Build Docker Image` step using `docker build`.
- Add local container test step to run container health check (`/api/cluster/info`).

```yaml
      # Step: Build Docker Container Image
      - name: Build Docker Image
        run: docker build -t ceme-calculator-demo:${{ github.sha }} .

      # Step: Verify Container Execution
      - name: Test Docker Container Startup
        run: |
          docker run -d --name test-app -p 3000:3000 ceme-calculator-demo:${{ github.sha }}
          sleep 3
          curl -f http://localhost:3000/api/cluster/info || exit 1
          docker stop test-app && docker rm test-app
```

---

### Component 2: CD Workflow Update (`.github/workflows/cd.yml`)
Transition CD pipeline from static GitHub Pages deployment to Docker Image Publishing (`ghcr.io`) and Kubernetes Manifest Packaging.

#### [MODIFY] [.github/workflows/cd.yml](file:///workspaces/CEME-DC-SE-CI_CD_K8s_Demo/.github/workflows/cd.yml)
- Add login to GitHub Container Registry (`ghcr.io`).
- Build, tag with `latest` and `${{ github.sha }}`, and push image to GHCR.
- Package Kubernetes manifests as build artifacts.

---

### Component 3: Kubernetes Manifest Alignment (`k8s/`)
Ensure `k8s/deployment.yaml` references the correct container image and namespace.

#### [MODIFY] [k8s/deployment.yaml](file:///workspaces/CEME-DC-SE-CI_CD_K8s_Demo/k8s/deployment.yaml)
- Verify `ghcr.io` image reference.
- Maintain Downward API metadata mapping (`POD_NAME`, `POD_IP`, `NODE_NAME`, `POD_NAMESPACE`).
- Set liveness & readiness probes to `/api/cluster/info`.

---

### Component 4: Local & Cluster Dashboard Demo Documentation
Create a detailed guide for launching and demonstrating the app & cluster dashboard.

#### [NEW] [docs/k8s_demo_guide.md](file:///workspaces/CEME-DC-SE-CI_CD_K8s_Demo/docs/k8s_demo_guide.md)
Will include step-by-step commands to:
1. Build and run via Docker locally (`docker build`, `docker run`).
2. Deploy to Kubernetes cluster (`kubectl apply -f k8s/`).
3. Port-forward the web application (`kubectl port-forward svc/calculator-service 3000:80 -n ci-cd-demo`).
4. Launch & access the Kubernetes Cluster Dashboard (`minikube dashboard` or standard K8s dashboard helm/manifest setup).
5. Interact with the Live App UI and view pod telemetry updates.

---

## 5. Verification Plan

### Automated Tests
1. **Unit Tests & Linting**:
   ```bash
   npm test
   npm run lint
   ```
2. **Docker Multi-Stage Build & Container Test**:
   ```bash
   docker build -t ceme-calculator-demo:test .
   docker run -d --name calc-test -p 3000:3000 ceme-calculator-demo:test
   curl http://localhost:3000/api/cluster/info
   docker stop calc-test && docker rm calc-test
   ```

### Manual Verification
1. Open web calculator app on `http://localhost:3000`.
2. Perform arithmetic operations (Add, Subtract, Multiply, Divide, Power).
3. Confirm that pod telemetry (`POD_NAME`, `POD_IP`, `NODE_NAME`) updates correctly.
4. Verify Cluster Dashboard access via Kubernetes tools (`kubectl get pods -n ci-cd-demo`, `kubectl get svc -n ci-cd-demo`).
