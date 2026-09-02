/**
 * Home.jsx — static home page for the Airbnb clone frontend.
 *
 * Sections:
 *  1. Hero banner with search pill CTA
 *  2. Inspiration cards (click to navigate to /locations/:city)
 *  3. Discover Experiences (two photo cards with action buttons)
 *  4. ShopAirbnb (title + button + real image)
 *  5. Host CTA banner
 *  6. Future Getaways (functional tab switcher with list content)
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ── Inspiration section data ──────────────────────────────────
const CITY_CARDS = [
  { name: 'Cape Town',  distance: '85 mi away',  gradient: 'gradient-1' },
  { name: 'New York',   distance: '150 mi away', gradient: 'gradient-2' },
  { name: 'Paris',      distance: '76 mi away',  gradient: 'gradient-3' },
  { name: 'Tokyo',      distance: '84 mi away',  gradient: 'gradient-4' },
];

// ── Future Getaways tab content ───────────────────────────────
const GETAWAY_TABS = ['Local getaways', 'International getaways'];

const GETAWAY_CONTENT = {
  'Local getaways': [
    { name: 'Johannesburg',  nights: '4 nights',  price: '$85/night' },
    { name: 'Durban',        nights: '3 nights',  price: '$95/night' },
    { name: 'Pretoria',      nights: '2 nights',  price: '$75/night' },
    { name: 'Stellenbosch',  nights: '5 nights',  price: '$110/night' },
    { name: 'Knysna',        nights: '7 nights',  price: '$130/night' },
    { name: 'Hermanus',      nights: '4 nights',  price: '$120/night' },
  ],
  'International getaways': [
    { name: 'Cape Town',     nights: '5 nights',  price: '$210/night' },
    { name: 'Paris',         nights: '4 nights',  price: '$195/night' },
    { name: 'New York',      nights: '3 nights',  price: '$320/night' },
    { name: 'Tokyo',         nights: '6 nights',  price: '$145/night' },
    { name: 'Dubai',         nights: '4 nights',  price: '$850/night' },
    { name: 'London',        nights: '5 nights',  price: '$230/night' },
  ],
};

export default function Home() {
  // Track which Future Getaways tab is active
  const [activeTab, setActiveTab] = useState('Local getaways');
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* ── 1. Hero Banner ─────────────────────────────────── */}
      <section className="hero-banner">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600"
          alt="Featured stay"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Not sure where to go? Perfect. Let's find somewhere unforgettable.</h1>
          <button
            className="flexible-pill"
            onClick={() => navigate('/locations/Cape Town')}
          >
            I'm flexible
          </button>
        </div>
      </section>

      {/* ── 2. Inspiration Section ─────────────────────────── */}
      <section className="inspiration-section">
        <h2>Inspiration for your next trip</h2>
        <div className="city-cards-grid">
          {CITY_CARDS.map((city) => (
            /* Each card links to the Location results page for that city */
            <Link
              key={city.name}
              to={`/locations/${encodeURIComponent(city.name)}`}
              className={`city-card ${city.gradient}`}
            >
              <div className="city-card-text">
                <span className="city-card-title">{city.name}</span>
                <span className="city-card-distance">{city.distance}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. Discover Experiences ────────────────────────── */}
      <section className="experiences-section">
        <h2>Discover The Genius Airbnb Experiences</h2>
        <div className="experiences-grid">
          <div className="experience-card canyon">
            <div className="experience-card-content">
              <span>Things to do on your trip</span>
              <button
                className="experience-btn"
                onClick={() => navigate('/locations/Cape Town')}
              >
                Explore experiences
              </button>
            </div>
          </div>
          <div className="experience-card home">
            <div className="experience-card-content">
              <span>Things to do from the comfort of your home</span>
              <button
                className="experience-btn"
                onClick={() => navigate('/locations/New York')}
              >
                Explore online experiences
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. ShopAirbnb ──────────────────────────────────── */}
      <section className="shop-airbnb">
        <div className="shop-text">
          <h2>Shop Genius Airbnb gift cards</h2>
          <p>Give someone the gift of a perfect stay.</p>
          <button className="btn-dark-pill">Shop now</button>
        </div>
        {/* Real image instead of CSS gradient placeholder */}
        <div className="shop-image">
          <img
            src="https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=600&q=80"
            alt="Airbnb gift card"
          />
        </div>
      </section>

      {/* ── 5. Host CTA ────────────────────────────────────── */}
      <section className="host-cta">
        <img
          className="host-cta-image"
          src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200"
          alt="Become a host"
        />
        <div className="host-cta-overlay" />
        <div className="host-cta-text">
          <h2>Have questions about hosting?</h2>
          <Link to="/login" className="btn-dark-pill">Ask a Superhost</Link>
        </div>
      </section>

      {/* ── 6. Future Getaways ─────────────────────────────── */}
      <section className="future-getaways">
        <h2>Need inspiration for future getaways?</h2>

        {/* Tab switcher */}
        <div className="getaways-tabs" role="tablist">
          {GETAWAY_TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content — list format */}
        <ul className="getaways-list" role="tabpanel">
          {GETAWAY_CONTENT[activeTab].map((item) => (
            <li key={item.name} className="getaway-item">
              <Link
                to={`/locations/${encodeURIComponent(item.name)}`}
                className="getaway-link"
              >
                <span className="getaway-name">{item.name}</span>
                <span className="getaway-meta">{item.nights} · {item.price}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
