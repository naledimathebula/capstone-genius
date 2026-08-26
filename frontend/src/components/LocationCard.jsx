import { Link } from 'react-router-dom';

export default function LocationCard({ listing }) {
  return (
    <Link to={`/listings/${listing._id}`} className="location-card">
      <img src={listing.images?.[0]} alt={listing.title} />
      <div className="location-card-body">
        <h3>{listing.type} in {listing.location}</h3>
        <p>{listing.amenities?.slice(0, 3).join(', ')}</p>
        <p>★ {listing.rating} ({listing.reviews} reviews)</p>
        <p><strong>${listing.price}</strong> / night</p>
      </div>
    </Link>
  );
}
