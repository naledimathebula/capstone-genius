/**
 * Login.jsx — Admin Dashboard login page.
 * Only users with role 'admin' or 'host' are permitted through.
 * Validates email and password, disables the submit button while
 * the request is in-flight to prevent double-submission.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]               = useState({ email: '', password: '' });
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]         = useState(false);

  /** Client-side validation — returns true when all fields are valid. */
  const validate = () => {
    const errs = {};
    if (!form.email) {
      errs.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/listings');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <h1>Admin Log in</h1>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
          Sign in with a host or admin account.
        </p>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            autoComplete="email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="field-error" role="alert">{errors.email}</span>}
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            autoComplete="current-password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            aria-invalid={!!errors.password}
          />
          {errors.password && <span className="field-error" role="alert">{errors.password}</span>}
        </label>

        {serverError && <p className="form-error" role="alert">{serverError}</p>}

        {/* Disabled while loading to prevent double-submit */}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
