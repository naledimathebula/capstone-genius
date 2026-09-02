/**
 * ListingForm.jsx — shared form for creating and updating listings.
 *
 * Used by both CreateListing and UpdateListing pages.
 * `initialValues` pre-fills all fields when editing an existing listing.
 * `onSubmit` receives the parsed payload (arrays parsed, numbers cast).
 * Disables the submit button while the async request is in-flight to
 * prevent double-submission and gives users clear loading feedback.
 *
 * All 14 required fields per the brief are included:
 *   title, location, description, type, bedrooms, bathrooms, guests,
 *   price, amenities, images, weeklyDiscount, cleaningFee, serviceFee,
 *   occupancyTaxes
 */
import { useState } from 'react';

const emptyForm = {
  title: '',
  location: '',
  description: '',
  type: '',
  bedrooms: '',
  bathrooms: '',
  guests: '',
  price: '',
  amenities: '',
  images: '',
  weeklyDiscount: 0,
  cleaningFee: 0,
  serviceFee: 0,
  occupancyTaxes: 0,
};

export default function ListingForm({ initialValues = {}, onSubmit, submitLabel = 'Save' }) {
  const [form, setForm] = useState({
    ...emptyForm,
    ...initialValues,
    // Arrays from the API are joined back to comma-separated strings for the input
    amenities: (initialValues.amenities || []).join(', '),
    images:    (initialValues.images    || []).join(', '),
  });
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]         = useState(false);

  /** Generic change handler — returns a function for the given field. */
  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  /** Validates required fields and basic range checks. */
  const validate = () => {
    const errs = {};
    const required = ['title', 'location', 'description', 'type', 'bedrooms', 'bathrooms', 'guests', 'price'];
    required.forEach((field) => {
      if (form[field] === '' || form[field] === null || form[field] === undefined) {
        errs[field] = 'This field is required';
      }
    });
    if (form.price !== '' && Number(form.price) < 0)          errs.price          = 'Price cannot be negative';
    if (form.weeklyDiscount !== '' && Number(form.weeklyDiscount) > 100) errs.weeklyDiscount = 'Discount cannot exceed 100%';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    // Build the payload: cast numbers, split comma-separated strings to arrays
    const payload = {
      ...form,
      bedrooms:        Number(form.bedrooms),
      bathrooms:       Number(form.bathrooms),
      guests:          Number(form.guests),
      price:           Number(form.price),
      weeklyDiscount:  Number(form.weeklyDiscount)  || 0,
      cleaningFee:     Number(form.cleaningFee)     || 0,
      serviceFee:      Number(form.serviceFee)      || 0,
      occupancyTaxes:  Number(form.occupancyTaxes)  || 0,
      amenities: form.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      images:    form.images.split(',').map((s) => s.trim()).filter(Boolean),
    };

    setLoading(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="listing-form" noValidate>

      <label>
        Title *
        <input value={form.title} onChange={handleChange('title')} />
        {errors.title && <span className="field-error" role="alert">{errors.title}</span>}
      </label>

      <label>
        Location *
        <input value={form.location} onChange={handleChange('location')} />
        {errors.location && <span className="field-error" role="alert">{errors.location}</span>}
      </label>

      <label>
        Type (e.g. Entire apartment) *
        <input value={form.type} onChange={handleChange('type')} placeholder="Entire apartment" />
        {errors.type && <span className="field-error" role="alert">{errors.type}</span>}
      </label>

      <label>
        Description *
        <textarea rows={4} value={form.description} onChange={handleChange('description')} />
        {errors.description && <span className="field-error" role="alert">{errors.description}</span>}
      </label>

      {/* Numeric trio */}
      <div className="form-row">
        <label>
          Bedrooms *
          <input type="number" min="0" value={form.bedrooms} onChange={handleChange('bedrooms')} />
          {errors.bedrooms && <span className="field-error" role="alert">{errors.bedrooms}</span>}
        </label>
        <label>
          Bathrooms *
          <input type="number" min="0" value={form.bathrooms} onChange={handleChange('bathrooms')} />
          {errors.bathrooms && <span className="field-error" role="alert">{errors.bathrooms}</span>}
        </label>
        <label>
          Guests *
          <input type="number" min="1" value={form.guests} onChange={handleChange('guests')} />
          {errors.guests && <span className="field-error" role="alert">{errors.guests}</span>}
        </label>
      </div>

      {/* Amenities + images */}
      <label>
        Amenities <small>(comma-separated, e.g. WiFi, Kitchen, Pool)</small>
        <input
          value={form.amenities}
          onChange={handleChange('amenities')}
          placeholder="WiFi, Kitchen, Free parking"
        />
      </label>

      <label>
        Image URLs <small>(comma-separated — paste one URL per image)</small>
        <input
          value={form.images}
          onChange={handleChange('images')}
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
        />
      </label>

      {/* Pricing */}
      <div className="form-row">
        <label>
          Price / night ($) *
          <input type="number" min="0" value={form.price} onChange={handleChange('price')} />
          {errors.price && <span className="field-error" role="alert">{errors.price}</span>}
        </label>
        <label>
          Weekly discount (%)
          <input type="number" min="0" max="100" value={form.weeklyDiscount} onChange={handleChange('weeklyDiscount')} />
          {errors.weeklyDiscount && <span className="field-error" role="alert">{errors.weeklyDiscount}</span>}
        </label>
      </div>

      <div className="form-row">
        <label>
          Cleaning fee ($)
          <input type="number" min="0" value={form.cleaningFee} onChange={handleChange('cleaningFee')} />
        </label>
        <label>
          Service fee ($)
          <input type="number" min="0" value={form.serviceFee} onChange={handleChange('serviceFee')} />
        </label>
        <label>
          Occupancy taxes ($)
          <input type="number" min="0" value={form.occupancyTaxes} onChange={handleChange('occupancyTaxes')} />
        </label>
      </div>

      {serverError && <p className="form-error" role="alert">{serverError}</p>}

      {/* Disabled while loading to prevent double-submission */}
      <button type="submit" className="btn-primary btn-submit" disabled={loading}>
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
