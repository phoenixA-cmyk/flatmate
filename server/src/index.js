import 'dotenv/config';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import Match from './models/Match.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import discoverRoutes from './routes/discover.js';
import matchRoutes from './routes/matches.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { PORT = 5000, MONGO_URI, JWT_SECRET, CLIENT_URL = 'http://localhost:5173' } = process.env;
if (!MONGO_URI || !JWT_SECRET) throw new Error('Set MONGO_URI and JWT_SECRET in server/.env');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: CLIENT_URL, credentials: true } });
app.set('io', io);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }), authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/matches', matchRoutes);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Serve the built React app in production
const dist = path.join(__dirname, '../../client/dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

io.use((socket, next) => {
  try {
    socket.userId = jwt.verify(socket.handshake.auth?.token, JWT_SECRET).id;
    next();
  } catch {
    next(new Error('unauthorized'));
  }
});
io.on('connection', (socket) => {
  socket.on('join', async (matchId) => {
    try {
      const m = await Match.findById(matchId);
      if (m && m.users.some((u) => String(u) === socket.userId)) socket.join(String(matchId));
    } catch { /* ignore */ }
  });
});

mongoose.connect(MONGO_URI).then(() => {
  server.listen(PORT, () => console.log(`API + sockets on http://localhost:${PORT}`));
}).catch((e) => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
