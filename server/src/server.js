import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { startActivityRetentionJob } from './jobs/activityRetention.job.js';
import { seedBaseData } from './scripts/seedBaseData.js';

const app = createApp();
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: env.clientUrl, credentials: true } });
app.set('io', io);

io.on('connection', (socket) => {
  const userId = socket.handshake.auth?.userId;
  if (userId) socket.join(`user:${userId}`);
});

await connectDb();
await seedBaseData();
startActivityRetentionJob();

server.listen(env.port, () => {
  process.stdout.write(`API running on port ${env.port}\n`);
});
