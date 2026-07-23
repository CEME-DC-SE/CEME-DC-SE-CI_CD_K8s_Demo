const express = require('express');
const path = require('path');
const MathLib = require('./src/math.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// Calculate API endpoint returning calculation result + serving Kubernetes Pod telemetry when running in K8s
app.post('/api/calculate', (req, res) => {
  const { op, a, b } = req.body;
  try {
    const numA = Number(a);
    const numB = Number(b);
    if (!MathLib[op]) {
      return res.status(400).json({ error: 'Invalid operation' });
    }

    const result = MathLib[op](numA, numB);
    const isKubernetes = !!process.env.POD_NAME;
    
    res.json({
      result,
      isKubernetes,
      podInfo: isKubernetes ? {
        podName: process.env.POD_NAME,
        podIp: process.env.POD_IP || '10.244.0.5',
        nodeName: process.env.NODE_NAME || 'k8s-node-01',
        namespace: process.env.POD_NAMESPACE || 'ci-cd-demo',
        timestamp: new Date().toISOString()
      } : null
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Live Kubernetes Cluster info endpoint
app.get('/api/cluster/info', (req, res) => {
  const isKubernetes = !!process.env.POD_NAME;
  res.json({
    isKubernetes,
    podName: isKubernetes ? process.env.POD_NAME : null,
    podIp: isKubernetes ? process.env.POD_IP : null,
    nodeName: isKubernetes ? process.env.NODE_NAME : null,
    namespace: isKubernetes ? process.env.POD_NAMESPACE : null,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
