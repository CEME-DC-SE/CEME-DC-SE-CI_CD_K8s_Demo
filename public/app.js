/**
 * Web Application Logic for K8s Web Calculator & Cluster Dashboard
 * Sends calculations to Express /api/calculate API and updates live Kubernetes Pod topology UI.
 */
document.addEventListener('DOMContentLoaded', () => {
  const numA = document.getElementById('numA');
  const numB = document.getElementById('numB');
  const resultVal = document.getElementById('result-value');
  const buttons = document.querySelectorAll('.btn-op');

  const servingPodName = document.getElementById('serving-pod-name');
  const servingPodDetails = document.getElementById('serving-pod-details');
  const metricMemory = document.getElementById('metric-memory');
  const metricUptime = document.getElementById('metric-uptime');

  // Elements for dynamic environment detection
  const clusterCard = document.querySelector('.cluster-card');
  const pipelineStatus = document.getElementById('pipeline-status');
  const bannerIcon = document.getElementById('banner-icon');
  const bannerText = document.getElementById('banner-text');
  const appSubtitle = document.getElementById('app-subtitle');
  const calcCardDesc = document.getElementById('calc-card-desc');

  let isK8sActive = false;

  // Function to adapt UI depending on whether backend runs in K8s or Standalone Docker
  function adaptEnvironmentUI(isK8s) {
    isK8sActive = !!isK8s;
    if (isK8sActive) {
      if (clusterCard) clusterCard.style.display = 'block';
      if (pipelineStatus) pipelineStatus.textContent = '☸️ K8s Cluster Healthy';
      if (bannerIcon) bannerIcon.textContent = '🚀';
      if (bannerText) bannerText.innerHTML = 'Live Kubernetes Deployment • Namespace: <code>ci-cd-demo</code> • Service: <code>ClusterIP:80</code>';
      if (appSubtitle) appSubtitle.textContent = 'Kubernetes Load Balanced Microservice • Docker Containerized';
      if (calcCardDesc) calcCardDesc.textContent = 'Calculations executed via Kubernetes Pod Load Balancers';
    } else {
      if (clusterCard) clusterCard.style.display = 'none';
      if (pipelineStatus) pipelineStatus.textContent = '🐳 Docker Container 1/1 Healthy';
      if (bannerIcon) bannerIcon.textContent = '🐳';
      if (bannerText) bannerText.innerHTML = 'Standalone Docker Container Mode • Port: <code>3000</code>';
      if (appSubtitle) appSubtitle.textContent = 'Standalone Docker Containerized Microservice';
      if (calcCardDesc) calcCardDesc.textContent = 'Calculations executed via Node.js Express Math Engine';
    }
  }

  // Simulated Pod round-robin fallback list for static demo
  const mockPods = [
    { name: 'calculator-deployment-7f89d-p1', node: 'k8s-worker-node-01', ip: '10.244.0.5' },
    { name: 'calculator-deployment-7f89d-p2', node: 'k8s-worker-node-02', ip: '10.244.0.6' },
    { name: 'calculator-deployment-7f89d-p3', node: 'k8s-worker-node-01', ip: '10.244.0.7' }
  ];
  let mockIndex = 0;

  // Function to highlight active serving Pod in Cluster Dashboard
  function highlightServingPod(podInfo) {
    if (!isK8sActive || !podInfo) return;

    const pName = podInfo.podName || mockPods[mockIndex].name;
    const pNode = podInfo.nodeName || mockPods[mockIndex].node;
    const pIp = podInfo.podIp || mockPods[mockIndex].ip;

    if (servingPodName) servingPodName.textContent = pName;
    if (servingPodDetails) servingPodDetails.textContent = `Node: ${pNode} | IP: ${pIp}`;

    // Map pod index (1, 2, or 3)
    let cardId = 1;
    if (pName.includes('2') || pName.includes('-p2')) cardId = 2;
    if (pName.includes('3') || pName.includes('-p3')) cardId = 3;

    // Reset all pod cards
    document.querySelectorAll('.pod-card').forEach((card, idx) => {
      card.classList.remove('pod-active');
      const trafficTag = document.getElementById(`pod-traffic-${idx + 1}`);
      if (trafficTag) trafficTag.style.opacity = '0';
    });

    // Highlight serving pod card
    const activeCard = document.getElementById(`pod-card-${cardId}`);
    const activeTraffic = document.getElementById(`pod-traffic-${cardId}`);
    if (activeCard) {
      activeCard.classList.add('pod-active');
    }
    if (activeTraffic) {
      activeTraffic.style.opacity = '1';
    }

    // Increment mock index for static fallback
    mockIndex = (mockIndex + 1) % mockPods.length;
  }

  // Handle calculator operations
  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const op = btn.getAttribute('data-op');
      const a = parseFloat(numA.value);
      const b = parseFloat(numB.value);

      if (isNaN(a) || isNaN(b)) {
        resultVal.textContent = 'Error: Invalid Input';
        resultVal.style.color = '#f85149';
        return;
      }

      try {
        // Try calling server API endpoint /api/calculate
        const response = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ op, a, b })
        });

        if (response.ok) {
          const data = await response.json();
          resultVal.textContent = data.result;
          resultVal.style.color = '#3fb950';
          adaptEnvironmentUI(data.isKubernetes);
          if (data.podInfo) {
            highlightServingPod(data.podInfo);
          }
        } else {
          // Fallback to client-side window.MathLib calculation
          const math = window.MathLib || {};
          let res;
          switch (op) {
            case 'add': res = math.add ? math.add(a, b) : a + b; break;
            case 'subtract': res = math.subtract ? math.subtract(a, b) : a - b; break;
            case 'multiply': res = math.multiply ? math.multiply(a, b) : a * b; break;
            case 'divide': res = math.divide ? math.divide(a, b) : a / b; break;
            case 'power': res = math.power ? math.power(a, b) : Math.pow(a, b); break;
            default: res = 0;
          }
          resultVal.textContent = res;
          resultVal.style.color = '#3fb950';
          adaptEnvironmentUI(false);
        }
      } catch (err) {
        // Fallback for static browser preview without backend server
        const math = window.MathLib || {};
        let res;
        try {
          switch (op) {
            case 'add': res = math.add ? math.add(a, b) : a + b; break;
            case 'subtract': res = math.subtract ? math.subtract(a, b) : a - b; break;
            case 'multiply': res = math.multiply ? math.multiply(a, b) : a * b; break;
            case 'divide': res = math.divide ? math.divide(a, b) : a / b; break;
            case 'power': res = math.power ? math.power(a, b) : Math.pow(a, b); break;
            default: res = 0;
          }
          resultVal.textContent = res;
          resultVal.style.color = '#3fb950';
        } catch (e) {
          resultVal.textContent = `Error: ${e.message}`;
          resultVal.style.color = '#f85149';
        }
        adaptEnvironmentUI(false);
      }
    });
  });

  // Fetch cluster telemetry
  async function updateClusterTelemetry() {
    try {
      const res = await fetch('/api/cluster/info');
      if (res.ok) {
        const info = await res.json();
        adaptEnvironmentUI(info.isKubernetes);
        if (metricMemory) metricMemory.textContent = `${info.memoryUsageMb} MB`;
        if (metricUptime) metricUptime.textContent = `${info.uptimeSeconds}s Uptime`;
      }
    } catch (e) {
      adaptEnvironmentUI(false);
    }
  }

  updateClusterTelemetry();
  setInterval(updateClusterTelemetry, 5000);
});
