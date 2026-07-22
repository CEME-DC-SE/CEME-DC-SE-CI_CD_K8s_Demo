const express = require('express');
const path = require('path');
const MathLib = require('./src/math.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

// Calculate API endpoint returning calculation result + serving Kubernetes Pod telemetry
app.post('/api/calculate', (req, res) => {
  const { op, a, b } = req.body;
  try {
    const numA = Number(a);
    const numB = Number(b);
    if (!MathLib[op]) {
      return res.status(400).json({ error: 'Invalid operation' });
    }

    const result = MathLib[op](numA, numB);
    
    res.json({
      result,
      podInfo: {
        podName: process.env.POD_NAME || 'calculator-pod-local-1',
        podIp: process.env.POD_IP || '10.244.0.5',
        nodeName: process.env.NODE_NAME || 'k8s-node-01',
        namespace: process.env.POD_NAMESPACE || 'ci-cd-demo',
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Live Kubernetes Cluster info endpoint
app.get('/api/cluster/info', (req, res) => {
  res.json({
    podName: process.env.POD_NAME || 'calculator-pod-local-1',
    podIp: process.env.POD_IP || '10.244.0.5',
    nodeName: process.env.NODE_NAME || 'k8s-node-01',
    namespace: process.env.POD_NAMESPACE || 'ci-cd-demo',
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    isKubernetes: !!process.env.POD_NAME
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
