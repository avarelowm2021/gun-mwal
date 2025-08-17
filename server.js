
/* GUN relay for MWAL on Render */
const express = require('express');
const http = require('http');
const cors = require('cors');
const Gun = require('gun');

/* Optional GUN extensions (SEA/auth, storage engines) */
require('gun/sea');
require('gun/lib/path');
require('gun/lib/radix');
require('gun/lib/radisk');
require('gun/lib/store');
require('gun/lib/rindexed');

const app = express();
app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

/* Simple landing + health endpoints */
app.get('/', (req, res) => {
  res.type('text/plain').send('✅ GUN relay for MWAL is running. Endpoint: /gun');
});
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/* Serve static test page */
app.use(express.static('public'));

/* Mount GUN assets and websocket handler; the relay will be available at /gun */
app.use(Gun.serve);

const port = process.env.PORT || 3000;
const server = http.createServer(app);

/* Persist data to ./data (attach a Render Disk to persist across deploys) */
const gun = Gun({
  web: server,
  radisk: true,
  file: 'data/gun',   // will write files under ./data
  localStorage: false
});

server.listen(port, '0.0.0.0', () => {
  console.log(`🔗 GUN relay listening on 0.0.0.0:${port} at /gun`);
});

/* Graceful shutdown */
function shutdown() {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
