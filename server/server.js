const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Parse JSON bodies for error logging
app.use(express.json());

// Serve static files from public/
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve node_modules for powerbi-client
app.use('/node_modules', express.static(path.join(__dirname, '..', 'node_modules')));

// Error logging endpoint
app.post('/api/log', (req, res) => {
  const { level, message, data } = req.body;
  const timestamp = new Date().toISOString();
  
  if (level === 'error') {
    console.error(`[${timestamp}] [CLIENT ERROR] ${message}`, data || '');
  } else if (level === 'warn') {
    console.warn(`[${timestamp}] [CLIENT WARN] ${message}`, data || '');
  } else {
    console.log(`[${timestamp}] [CLIENT] ${message}`, data || '');
  }
  
  res.json({ ok: true });
});

// Serve auth config (for MSAL)
app.get('/api/auth-config', (req, res) => {
  console.log(`[${new Date().toISOString()}] [SERVER] Auth config requested`);
  res.sendFile(path.join(__dirname, '..', 'config', 'auth.json'));
});

// Serve reports config (for Power BI embedding)
app.get('/api/reports-config', (req, res) => {
  console.log(`[${new Date().toISOString()}] [SERVER] Reports config requested`);
  res.sendFile(path.join(__dirname, '..', 'config', 'reports.json'));
});

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] [SERVER] Server started at http://localhost:${PORT}`);
});
