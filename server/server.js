const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from public/
app.use(express.static(path.join(__dirname, '..', 'public')));

// Serve node_modules for powerbi-client
app.use('/node_modules', express.static(path.join(__dirname, '..', 'node_modules')));

// Serve auth config (for MSAL)
app.get('/api/auth-config', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'config', 'auth.json'));
});

// Serve reports config (for Power BI embedding)
app.get('/api/reports-config', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'config', 'reports.json'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
