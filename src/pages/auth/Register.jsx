// Frontend/src/pages/auth/Register.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout'
import { useAuth } from "../../context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';
import '../../App.css'

/* ── Icons ── */
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)
const IconEmail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <rect x="2" y="4" width="20" height="16" rx="3" /><path d="M2 7l10 7 10-7" />
  </svg>
)
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67 2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconEye = ({ open }) => open ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)
const IconGoogle = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', cls: '' }
  let s = 0
  if (pwd.length >= 8) s++
  if (/[A-Z]/.test(pwd)) s++
  if (/[0-9]/.test(pwd)) s++
  if (/[^A-Za-z0-9]/.test(pwd)) s++
  const map = ['', 'weak', 'fair', 'good', 'strong']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return { score: s, label: labels[s], cls: map[s] }
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  const strength = getStrength(form.password)

  const validate = () => {
    const e = {}
    if (!form.name || form.name.trim().length < 2) e.name = 'Full name is required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.password || form.password.length < 8) e.password = 'Min. 8 characters'
    if (form.confirm !== form.password) e.confirm = 'Passwords must match'
    if (!agreed) e.agreed = 'This is required'
    return e
  }

  const handleChange = (field) => (ev) => {
    setForm(f => ({ ...f, [field]: ev.target.value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  const { signUp, signInWithGoogle } = useAuth()

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true); setAlert(null);
    try {
      await signInWithGoogle(credentialResponse.credential);
      setAlert({ type: 'success', msg: 'Welcome back! Redirecting...' });
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setAlert({ type: 'error', msg: 'Google Sign-In failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true); setAlert(null)

    // Backend expects firstName & lastName
    const parts = form.name.trim().split(" ");
    const firstName = parts[0];
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : ".";

    try {
      await signUp({
        firstName, 
        lastName,
        email: form.email, 
        phone: form.phone, 
        password: form.password
      })
      setAlert({ type: 'success', msg: 'Welcome to LUXE! Account created.' })
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setAlert({ type: 'error', msg: err.response?.data?.message || 'Registration failed.' })
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout
      tagline="Crafting a bespoke" taglineHighlight="Legacy"
      description="Join our curated circle of excellence. Personalised collections and premium styling services await your arrival."
    >
      <div className="auth-form-container">
        <div className="auth-header text-center mb-5">
          <p className="auth-greeting mb-2">Member Admission</p>
          <h2 className="auth-title">Create your account</h2>
        </div>

        <div className="w-100 d-flex justify-content-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setAlert({ type: 'error', msg: 'Google Sign-In failed.' })}
            theme="filled_black"
            shape="pill"
            width="320"
          />
        </div>

        <div className="auth-divider mb-4">
          <div className="divider-line" /><span className="divider-text px-3">or regiser with email</span><div className="divider-line" />
        </div>

        {alert && (
          <div className={`auth-alert ${alert.type} mb-4 p-3 rounded-3`}>
            <span className="alert-icon me-2">{alert.type === 'error' ? '⚠' : '✓'}</span>{alert.msg}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* 1. Full Name */}
          <div className="form-group mb-4">
            <label className="form-label mb-2" htmlFor="full-name">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon"><IconUser /></span>
              <input 
                id="full-name"
                type="text" 
                className={`form-input ${errors.name ? 'input-error' : ''}`} 
                placeholder="Full Name" 
                value={form.name} 
                onChange={handleChange('name')} 
              />
            </div>
            {errors.name && <small className="text-danger mt-1 d-block">{errors.name}</small>}
          </div>

          {/* 2. Email */}
          <div className="form-group mb-4">
            <label className="form-label mb-2" htmlFor="reg-email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon"><IconEmail /></span>
              <input 
                id="reg-email"
                type="email" 
                className={`form-input ${errors.email ? 'input-error' : ''}`} 
                placeholder="Email" 
                value={form.email} 
                onChange={handleChange('email')} 
              />
            </div>
            {errors.email && <small className="text-danger mt-1 d-block">{errors.email}</small>}
          </div>

          {/* 3. Mobile Number */}
          <div className="form-group mb-4">
            <label className="form-label mb-2" htmlFor="reg-phone">Mobile Number (Optional)</label>
            <div className="input-wrapper">
              <span className="input-icon"><IconPhone /></span>
              <input 
                id="reg-phone"
                type="tel" 
                className="form-input" 
                placeholder="Mobile Number" 
                value={form.phone} 
                onChange={handleChange('phone')} 
              />
            </div>
          </div>

          {/* 4. Password Group */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 text-start">
              <div className="form-group">
                <label className="form-label mb-2" htmlFor="reg-password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconLock /></span>
                  <input 
                    id="reg-password"
                    type={showPwd ? 'text' : 'password'} 
                    className={`form-input ${errors.password ? 'input-error' : ''}`} 
                    placeholder="••••••••" 
                    value={form.password} 
                    onChange={handleChange('password')} 
                  />
                  <button type="button" className="input-action-btn" onClick={() => setShowPwd(s => !s)}>
                    <IconEye open={showPwd} />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 text-start">
              <div className="form-group">
                <label className="form-label mb-2" htmlFor="reg-confirm">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><IconLock /></span>
                  <input 
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'} 
                    className={`form-input ${errors.confirm ? 'input-error' : ''}`} 
                    placeholder="••••••••" 
                    value={form.confirm} 
                    onChange={handleChange('confirm')} 
                  />
                  <button type="button" className="input-action-btn" onClick={() => setShowConfirm(s => !s)}>
                    <IconEye open={showConfirm} />
                  </button>
                </div>
              </div>
            </div>
            {(errors.password || errors.confirm) && (
              <div className="col-12">
                <small className="text-danger">{errors.password || errors.confirm}</small>
              </div>
            )}
          </div>

          <div className="form-group mb-5">
            <div className="checkbox-group align-items-center">
              <input id="reg-agree" type="checkbox" className="form-checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ transform: 'scale(1.2)', marginRight: '10px' }} />
              <label className="checkbox-label mb-0" htmlFor="reg-agree" style={{ cursor: 'pointer' }}>
                I agree to the <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--accent-gold)' }}>Terms & Luxury Standards</a>.
              </label>
            </div>
            {errors.agreed && <small className="text-danger mt-1 d-block">{errors.agreed}</small>}
          </div>

          <button id="btn-register-submit" type="submit" className="btn-auth w-100 py-3 mb-4 rounded-pill fw-bold ls-widest" disabled={loading} style={{ height: '54px' }}>
            {loading ? 'Processing...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="auth-switch text-center mt-4 p-4 rounded-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="mb-0 text-secondary">
            Already have an account? 
            <button 
              onClick={() => navigate('/login')} 
              className="btn btn-link p-0 ms-2 fw-bold" 
              style={{ color: 'var(--accent-gold)', textDecoration: 'none', border: 'none', background: 'none', fontSize: '15px' }}
            >
              Sign In →
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
