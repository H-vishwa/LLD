import { createApp } from './app.js';

const PORT = process.env.PORT || 5000;
const { app } = createApp();

app.listen(PORT, () => {
  console.log(`[LLD Platform Server] Running on http://localhost:${PORT}`);
  console.log(`[LLD Platform Server] API Endpoints available at http://localhost:${PORT}/api/`);
});
