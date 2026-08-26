# Airbnb Clone – Admin Dashboard

React (Vite) app for managing listings: login, create/view/update/delete listings, view reservations.

## Setup
```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend
npm run dev              # http://localhost:5174
```

## Structure
```
src/
  api/api.js                 axios instance, attaches admin JWT
  context/AuthContext.jsx    login (host/admin only), logout
  components/
    Header.jsx                logo, nav, profile dropdown
    ProtectedRoute.jsx         redirects to /login if not authenticated
    ListingForm.jsx            shared form for Create + Update (validation included)
  pages/
    Login.jsx
    ViewListings.jsx            table with edit/delete actions
    CreateListing.jsx
    UpdateListing.jsx           pre-fills ListingForm from existing data
    Reservations.jsx            reservations for the logged-in host's listings
```

## Notes
- Login rejects accounts with `role: "user"` client-side — only `host`/`admin` can access the dashboard. The backend doesn't yet enforce this server-side; consider adding an `authorize('host', 'admin')` check to `/api/users/login` or a dedicated admin login route if you want it enforced there too.
- Image handling is via comma-separated URLs for now (matches "optional" image upload note in the brief). Swap in a real file input + Multer endpoint if you want actual uploads.

## Still to build
- [ ] Wire real image upload (optional per brief)
- [ ] Nicer table/empty states, loading skeletons
- [ ] Visual polish to match your overall design system

## Deploying to Heroku
Same pattern as the frontend app — static buildpack with `static.json`, or the included `Procfile` (`npx serve -s dist`). Set `VITE_API_URL` as a config var before building.
