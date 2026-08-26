# Airbnb Clone – Backend

Node.js + Express + MongoDB (Mongoose) API for the Airbnb Clone capstone.

## Setup
```bash
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev             # nodemon, http://localhost:5000
```

## Structure
```
controllers/   business logic (user, accommodation, reservation)
models/        Mongoose schemas (User, Accommodation, Reservation)
routes/        Express routers, mounted in server.js
middleware/    auth.js — JWT verification + role guard
config/db.js   Mongoose connection
server.js      app entry point
```

## Endpoints implemented (matches Node.js Backend rubric)
| Method | Route | Access |
|---|---|---|
| POST | /api/users/login | Public |
| POST | /api/users/register | Public (seed/test accounts) |
| GET | /api/users/me | Private |
| POST | /api/accommodations | Private (host/admin) |
| GET | /api/accommodations | Public |
| GET | /api/accommodations/:id | Public |
| PUT | /api/accommodations/:id | Private (host/admin) |
| DELETE | /api/accommodations/:id | Private (host/admin) |
| POST | /api/reservations | Private |
| GET | /api/reservations/host | Private |
| GET | /api/reservations/user | Private |
| DELETE | /api/reservations/:id | Private |

## Auth
Send `Authorization: Bearer <token>` on protected routes. Token is returned from `/api/users/login`.

## Seeding test users
```bash
npm run seed
```
Creates three accounts and one sample listing:
| Role | Email | Password |
|---|---|---|
| user | john@example.com | password123 |
| host | jane@example.com | password321 |
| admin | admin@example.com | admin1234 |

Use `host` or `admin` to log into the admin dashboard (per its AuthContext, `user`-role accounts are rejected there). Safe to re-run — it skips accounts/listings that already exist.

## Deploying to Heroku
```bash
heroku create your-app-name
heroku config:set MONGO_URI=... JWT_SECRET=... CLIENT_URL=... ADMIN_URL=...
git push heroku main
```
The included `Procfile` (`web: node server.js`) is picked up automatically.

## TODO (not yet built — next steps)
- [ ] Multer image upload route (optional per brief)
- [ ] Input validation library (e.g. express-validator) for stricter error messages
- [ ] Automated tests
