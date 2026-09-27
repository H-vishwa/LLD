import { createApp } from './app.js';

const PORT = process.env.PORT || 5000;
const { app } = createApp();

const server = app.listen(PORT, () => {
  console.log(`[LLD Platform Server] Running on http://localhost:${PORT}`);
  console.log(`[LLD Platform Server] API Endpoints available at http://localhost:${PORT}/api/`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[LLD Platform Server] Port ${PORT} is already in use by another process.`);
    console.error(`[LLD Platform Server] Tip: Free port ${PORT} or run with PORT=5001 npm run dev`);
  } else {
    console.error('[LLD Platform Server] Server error:', err);
  }
  process.exit(1);
});
