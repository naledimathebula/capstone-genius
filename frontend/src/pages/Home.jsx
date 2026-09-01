import { Link } from 'react-router-dom';

// City cards use a rotating palette of gradients to match the Figma inspiration section.
const cityCards = [
  { name: 'Sandton City Hotel', distance: '85 mi away', gradient: 'gradient-1' },
  { name: 'Joburg City Hotel', distance: '150 mi away', gradient: 'gradient-2' },
  { name: 'Woodmead City Hotel', distance: '76 mi away', gradient: 'gradient-3' },
  { name: 'Hyde Park Hotel', distance: '84 mi away', gradient: 'gradient-4' },
];

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero-banner">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600"
          alt="Featured stay"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Not sure where to go? Perfect.Let's find somewhere unforgettable</h1>
          <button className="flexible-pill">I'm flexible</button>
        </div>
      </section>

      <section className="inspiration-section">
        <h2>Inspiration for your next trip</h2>
        <div className="city-cards-grid">
          {cityCards.map((city) => (
            <div key={city.name} className={`city-card ${city.gradient}`}>
              <div className="city-card-text">
                <span className="city-card-title">{city.name}</span>
                <span className="city-card-distance">{city.distance}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="experiences-section">
        <h2>Discover The Genius Airbnb Experiences</h2>
        <div className="experiences-grid">
          <div className="experience-card canyon">
            <span>Things to do on your trip</span>
          </div>
          <div className="experience-card home">
            <span>Things to do from the comfort of your home</span>
          </div>
        </div>
      </section>

      <section className="shop-airbnb">
        <div className="shop-text">
          <h2>Shop Genius Airbnb gift cards</h2>
          <button className="btn-dark-pill">Shop now</button>
        </div>
        <div className="shop-image" />
      </section>

      <section className="host-cta">
        <img
          className="host-cta-image"
          src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200"
          alt="Become a host"
        />
        <div className="host-cta-overlay" />
        <div className="host-cta-text">
          <h2> Have questions about hosting?</h2>
          <Link to="/login" className="btn-dark-pill">Ask a host</Link>
        </div>
      </section>

      <section className="future-getaways">
        <h2> Need Inspiration for future getaways?</h2>
        <div className="getaways-tabs">
          <span className="tab active">Local getaways</span>
          <span className="tab">International getaways</span>
        </div>
      </section>
    </div>
  );
}
