import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Static home page per the brief: hero, inspiration sections, footer sections.
// The only dynamic piece here is the location filter, which routes to /locations/:name.
export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/locations/${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="home-page">
      <section className="hero-banner">
        <h1>Not sure where to go? Perfect.</h1>
        <p>We'll help you find your next adventure.</p> 
        <img className="hero-image" src="https://i.pinimg.com/736x/91/c6/1a/91c61ac69a498f7e85722e0442186ff9.jpg" alt="Hero" />
        <form onSubmit={handleSearch} className="hero-search">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations"
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="inspiration-section">
        <h2>Inspiration for your next trip</h2>
        {/* TODO: map static location cards from a local data file */}
      </section>

      <section className="experiences-section">
        <h2>Discover Airbnb Experiences</h2>
      </section>

      <section className="things-to-do trip">
        <h2>Things to do on your trip</h2>
        <button>Explore</button>
      </section>

      <section className="things-to-do home">
        <h2>Things to do at home</h2>
        <button>Explore</button>
      </section>

      <section className="shop-airbnb">
        <div className="shop-text">
          <h2>Give the gift of travel</h2>
          <button>Shop gift cards</button>
        </div>
        <div className="shop-image" />
      </section>

      <section className="future-getaways">
        <h2>Inspiration for future getaways</h2>
        {/* TODO: static tabs, one rendering a list-format layout */}
      </section>
    </div>
  );
}
