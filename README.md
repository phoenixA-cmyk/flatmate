# Flatmate 🏠 (MERN)

Find a flatmate who actually lives like you. Built from the reel's plan:

1. **Create your profile**: budget, location, sleep time, cleaning, smoking, pets, parties
2. **Lifestyle match score** (e.g. 94%) with "why" tags (budget fits, sleep clash, ...)
3. **Before you sign anything**: Chat (vibe check) → Verify IDs → Meet first

## Stack
- **MongoDB + Mongoose**: users, matches, messages
- **Express**: JWT auth, bcrypt, helmet, rate limiting, REST API
- **React (Vite)**: React Router, context auth, responsive dark neon UI
- **Node + Socket.IO**: realtime chat (authenticated sockets, per-match rooms)

## Run locally
Requirements: Node 18+, MongoDB running locally (or an Atlas URI).

```bash
npm install                    # installs root tooling (concurrently)
npm run install:all            # installs server + client deps
# server/.env is already created from .env.example. Edit MONGO_URI / JWT_SECRET if needed.
npm run seed                   # 12 demo profiles in Bengaluru (password: demo1234)
npm run dev                    # API on :5000, web on :5173
```
Open http://localhost:5173

**Try matching + chat:** sign up as yourself, finish your profile, like some profiles.
To see a mutual match, open a second (incognito) window, log in as e.g. `kabir@demo.flatmate / demo1234`,
like your new account's profile, then like Kabir from your own account. Chat updates live in both windows.

## Production
```bash
npm run build      # builds client/dist
npm start          # Express serves API + the built React app on one port
```
Set `MONGO_URI` (Atlas), a strong `JWT_SECRET`, `CLIENT_URL`, and `VERIFY_AUTO_APPROVE=false` on your host (Render / Railway / Fly.io).

## API
| Method | Route | Purpose |
|---|---|---|
| POST | /api/auth/register, /login | Auth |
| GET | /api/auth/me | Current user |
| PUT | /api/profile | Save profile |
| POST | /api/profile/verify | Submit ID (stores last 4 digits only) |
| GET | /api/discover?area=&verified= | Ranked candidates with compatibility |
| POST | /api/discover/:id/like \| pass | Swipe; returns `matched` on mutual like |
| GET | /api/matches, /api/matches/:id | Matches + milestone state |
| GET/POST | /api/matches/:id/messages | Chat history / send (broadcast via Socket.IO) |
| POST | /api/matches/:id/met | Confirm you met in person |

## Compatibility algorithm (`server/src/utils/score.js`)
Budget overlap 28 · same area 25 · sleep time 15 · cleaning 15 · smoking 10 · pets 4 · parties 3 = 100.

## Before real launch (honest notes)
- **ID verification is demo-mode.** Replace `/api/profile/verify` with a KYC provider (e.g. DigiLocker / Aadhaar eKYC partner). Never store full ID numbers.
- Add photo upload (S3/Cloudinary), email verification, report/block, and a moderation queue.
- Add more cities: the `city` field and the `AREAS` list in `client/src/format.js` are the only things to extend.
- Add tests and a CI pipeline.
