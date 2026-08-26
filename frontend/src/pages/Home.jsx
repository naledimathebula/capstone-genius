import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Static inspiration cards shown on the home page
const INSPIRATION_CARDS = [
  { name: 'Cape Town', distance: '3,200 km away', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80' },
  { name: 'Paris', distance: '9,000 km away', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80' },
  { name: 'New York', distance: '12,500 km away', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80' },
  { name: 'Tokyo', distance: '14,200 km away', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
  { name: 'London', distance: '9,600 km away', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=80' },
  { name: 'Sydney', distance: '11,000 km away', img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&q=80' },
  { name: 'Dubai', distance: '6,800 km away', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' },
  { name: 'Barcelona', distance: '9,400 km away', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&q=80' },
];

// Tabs for the "Future getaways" section
const GETAWAY_TABS = ['Beach', 'Mountains', 'City breaks', 'Countryside'];

const GETAWAY_CONTENT = {
  Beach: [
    { name: 'Maldives', nights: '5 nights', price: '$250/night' },
    { name: 'Bali', nights: '7 nights', price: '$120/night' },
    { name: 'Santorini', nights: '6 nights', price: '$310/night' },
    { name: 'Phuket', nights: '5 nights', price: '$140/night' },
  ],
  Mountains: [
    { name: 'Interlaken', nights: '4 nights', price: '$290/night' },
    { name: 'Aspen', nights: '3 nights', price: '$450/night' },
    { name: 'Zermatt', nights: '5 nights', price: '$380/night' },
    { name: 'Banff', nights: '4 nights', price: '$220/night' },
  ],
  'City breaks': [
    { name: 'Amsterdam', nights: '3 nights', price: '$185/night' },
    { name: 'Rome', nights: '4 nights', price: '$200/night' },
    { name: 'Berlin', nights: '3 nights', price: '$160/night' },
    { name: 'Vienna', nights: '3 nights', price: '$175/night' },
  ],
  Countryside: [
    { name: 'Tuscany', nights: '7 nights', price: '$230/night' },
    { name: 'Cotswolds', nights: '4 nights', price: '$210/night' },
    { name: 'Provence', nights: '5 nights', price: '$195/night' },
    { name: 'Douro Valley', nights: '4 nights', price: '$170/night' },
  ],
};

export default function Home() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Beach');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/locations/${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="home-page">

      {/* ── Hero Banner ───────────────────────────────────────────── */}
      <section className="hero-banner">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1400&q=80"
          alt="Scenic destination"
        />
        <h1>Not sure where to go? Perfect.</h1>
        <p className="hero-sub">We'll help you find your next adventure.</p>
        <form onSubmit={handleSearch} className="hero-search">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations"
            aria-label="Search destinations"
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {/* ── Inspiration Section ───────────────────────────────────── */}
      <section className="inspiration-section">
        <h2>Inspiration for your next trip</h2>
        <div className="inspiration-grid">
          {INSPIRATION_CARDS.map((card) => (
            <Link
              key={card.name}
              to={`/locations/${encodeURIComponent(card.name)}`}
              className="inspiration-card"
            >
              <img src={card.img} alt={card.name} />
              <div className="inspiration-card-body">
                <strong>{card.name}</strong>
                <span>{card.distance}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Discover Experiences ──────────────────────────────────── */}
      <section className="experiences-section">
        <h2>Discover Airbnb Experiences</h2>
        <div className="experiences-grid">
          <div
            className="experience-card"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80)',
            }}
          >
            <div className="experience-overlay">
              <h3>Things to do on your trip</h3>
              <button>Explore experiences</button>
            </div>
          </div>
          <div
            className="experience-card"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&q=80)',
            }}
          >
            <div className="experience-overlay">
              <h3>Things to do at home</h3>
              <button>Explore online experiences</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ShopAirbnb ────────────────────────────────────────────── */}
      <section className="shop-airbnb">
        <div className="shop-text">
          <h2>Give the gift of travel</h2>
          <p>Thoughtful presents for every budget.</p>
          <button>Shop gift cards</button>
        </div>
        <div className="shop-image">
          <img
            src="https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?w=600&q=80"
            alt="Airbnb gift cards"
          />
        </div>
      </section>

      {/* ── Future Getaways ───────────────────────────────────────── */}
      <section className="future-getaways">
        <h2>Inspiration for future getaways</h2>
        <div className="getaways-tabs" role="tablist">
          {GETAWAY_TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`tab-btn${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <ul className="getaways-list" role="tabpanel">
          {GETAWAY_CONTENT[activeTab].map((item) => (
            <li key={item.name} className="getaway-item">
              <span className="getaway-name">{item.name}</span>
              <span className="getaway-nights">{item.nights}</span>
              <span className="getaway-price">{item.price}</span>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
