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

// Shared form used by both Create and Update listing pages.
// `initialValues` pre-fills the form for updates; `onSubmit` receives the parsed payload.
export default function ListingForm({ initialValues = {}, onSubmit, submitLabel = 'Save' }) {
  const [form, setForm] = useState({
    ...emptyForm,
    ...initialValues,
    amenities: (initialValues.amenities || []).join(', '),
    images: (initialValues.images || []).join(', '),
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    const required = ['title', 'location', 'description', 'type', 'bedrooms', 'bathrooms', 'guests', 'price'];
    required.forEach((field) => {
      if (form[field] === '' || form[field] === null || form[field] === undefined) {
        errs[field] = 'This field is required';
      }
    });
    if (form.price && Number(form.price) < 0) errs.price = 'Price cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    const payload = {
      ...form,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      guests: Number(form.guests),
      price: Number(form.price),
      weeklyDiscount: Number(form.weeklyDiscount) || 0,
      cleaningFee: Number(form.cleaningFee) || 0,
      serviceFee: Number(form.serviceFee) || 0,
      occupancyTaxes: Number(form.occupancyTaxes) || 0,
      amenities: form.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="listing-form">
      <label>
        Title
        <input value={form.title} onChange={handleChange('title')} />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </label>

      <label>
        Location
        <input value={form.location} onChange={handleChange('location')} />
        {errors.location && <span className="field-error">{errors.location}</span>}
      </label>

      <label>
        Type (e.g. Entire apartment)
        <input value={form.type} onChange={handleChange('type')} />
        {errors.type && <span className="field-error">{errors.type}</span>}
      </label>

      <label>
        Description
        <textarea value={form.description} onChange={handleChange('description')} />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </label>

      <div className="form-row">
        <label>
          Bedrooms
          <input type="number" min="0" value={form.bedrooms} onChange={handleChange('bedrooms')} />
          {errors.bedrooms && <span className="field-error">{errors.bedrooms}</span>}
        </label>
        <label>
          Bathrooms
          <input type="number" min="0" value={form.bathrooms} onChange={handleChange('bathrooms')} />
          {errors.bathrooms && <span className="field-error">{errors.bathrooms}</span>}
        </label>
        <label>
          Guests
          <input type="number" min="1" value={form.guests} onChange={handleChange('guests')} />
          {errors.guests && <span className="field-error">{errors.guests}</span>}
        </label>
      </div>

      <label>
        Amenities (comma-separated)
        <input value={form.amenities} onChange={handleChange('amenities')} placeholder="wifi, kitchen, free parking" />
      </label>

      <label>
        Image URLs (comma-separated)
        <input value={form.images} onChange={handleChange('images')} placeholder="/images/one.jpg, /images/two.jpg" />
      </label>

      <div className="form-row">
        <label>
          Price / night
          <input type="number" min="0" value={form.price} onChange={handleChange('price')} />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </label>
        <label>
          Weekly discount (%)
          <input type="number" min="0" value={form.weeklyDiscount} onChange={handleChange('weeklyDiscount')} />
        </label>
      </div>

      <div className="form-row">
        <label>
          Cleaning fee
          <input type="number" min="0" value={form.cleaningFee} onChange={handleChange('cleaningFee')} />
        </label>
        <label>
          Service fee
          <input type="number" min="0" value={form.serviceFee} onChange={handleChange('serviceFee')} />
        </label>
        <label>
          Occupancy taxes
          <input type="number" min="0" value={form.occupancyTaxes} onChange={handleChange('occupancyTaxes')} />
        </label>
      </div>

      {serverError && <p className="form-error">{serverError}</p>}

      <button type="submit" className="btn-primary">{submitLabel}</button>
    </form>
  );
}
