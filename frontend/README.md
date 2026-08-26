# Airbnb Clone – Frontend

React (Vite) app matching the Figma design: Home, Location, Location Details pages.

## Setup
```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend
npm run dev              # http://localhost:5173
```

## Structure
```
src/
  api/api.js           axios instance, attaches JWT automatically
  context/AuthContext.jsx   login/logout state, persisted to localStorage
  components/          Header, Footer, LocationCard
  pages/
    Home.jsx            hero, inspiration sections, footer (mostly static)
    Location.jsx         location filter results (dynamic, from API)
    LocationDetails.jsx  gallery, cost calculator, reservation button
    Login.jsx            email/password form with validation
  styles/index.css     shared styles
```

## What's scaffolded vs. what's left
Done: routing, auth wiring, cost calculator math, reservation POST, basic validation.

Still to build (per the Figma + rubric):
- [ ] Static sections with real content/images: Experiences, Things to do, ShopAirbnb, Future Getaways tabs
- [ ] Location filter dropdown with date pickers/guest counts (currently a plain text search)
- [ ] "View reservations" table page
- [ ] Visual polish to match Figma (spacing, imagery, typography)
- [ ] Currency/language selector in footer (can stay static per brief)

## Deploying to Heroku
Two common options:
1. **Static buildpack** (`heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static`) — uses the included `static.json`.
2. **Node buildpack serving the build** — the included `Procfile` runs `npx serve -s dist`.

Either way, run `npm run build` first (or let Heroku's build step do it) and set `VITE_API_URL` to your deployed backend's URL as a config var before building.
