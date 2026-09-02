/**
 * App.jsx — root router for the Airbnb clone frontend.
 * Defines all client-side routes and wraps every page in the
 * shared Header and Footer components.
 */
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Location from './pages/Location.jsx';
import LocationDetails from './pages/LocationDetails.jsx';
import Login from './pages/Login.jsx';
import Reservations from './pages/Reservations.jsx';

/** Simple 404 page rendered for any unknown route. */
function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Sorry, we couldn't find that page.</p>
      <a href="/" className="nf-home-link">Go back home</a>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/"                        element={<Home />} />
          <Route path="/locations/:locationName" element={<Location />} />
          <Route path="/listings/:id"            element={<LocationDetails />} />
          <Route path="/login"                   element={<Login />} />
          <Route path="/reservations"            element={<Reservations />} />
          {/* 404 catch-all */}
          <Route path="*"                        element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
