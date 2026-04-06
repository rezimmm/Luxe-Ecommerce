// Frontend/src/pages/auth/ForgotPassword.jsx
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout'
import { forgotPassword, verifyOtp, resetPassword } from '../../services/auth.service'
import api from '../../services/api'
import '../../App.css'

const IconEmail = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="M2 7l10 7 10-7" /></svg>
const IconLock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
const IconEye = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    {open ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></> : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>}
  </svg>
)

const OtpInput = ({ value, onChange }) => {
  const inputs = useRef([])
  const digits = (value || '').split('').concat(Array(6).fill('')).slice(0, 6)
  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/, '').slice(-1)
    const next = [...digits]; next[i] = val; onChange(next.join(''));
    if (val && i < 5) inputs.current[i + 1]?.focus()
  }
  return (
    <div className="otp-group">
      {digits.map((d, i) => (
        <input key={i} ref={el => inputs.current[i] = el} type="text" className="otp-input" value={d} onChange={e => handleChange(i, e)} maxLength={1} />
      ))}
    </div>
  )
}

export default function ForgotPassword() {
  const [step, setStep] = useState(0); 
  const [email, setEmail] = useState(''); 
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false); 
  const [alert, setAlert] = useState(null);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (timer > 0) return;
    setLoading(true); setAlert(null)
    try { 
      await forgotPassword(email); 
      setStep(1);
      setTimer(60);
    } catch (e) { 
      setAlert({ type: 'error', msg: e.response?.data?.message || 'Error' }) 
    } finally { setLoading(false) }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault(); setLoading(true); setAlert(null)
    try { 
      await verifyOtp(email, otp); 
      setStep(2);
    } catch (e) { 
      setAlert({ type: 'error', msg: e.response?.data?.message || 'Invalid code' }) 
    } finally { setLoading(false) }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setAlert({ type: 'error', msg: 'Passwords do not match.' });
      return;
    }
    if (passwords.new.length < 8) {
      setAlert({ type: 'error', msg: 'Password must be at least 8 characters.' });
      return;
    }

    setLoading(true); setAlert(null)
    try {
      await resetPassword(email, passwords.new);
      setAlert({ type: 'success', msg: 'Password reset successfully! Redirecting...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (e) {
      setAlert({ type: 'error', msg: e.response?.data?.message || 'Error' });
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout tagline="Recover your" taglineHighlight="Account" description="Enter your email to receive a recovery code and reset your password.">
      <div className="auth-form-container">
        <div className="auth-header text-center mb-5">
          <p className="auth-greeting mb-2">{step === 0 ? 'Account Recovery' : step === 1 ? 'Verify Code' : 'Reset Password'}</p>
          <h2 className="auth-title">{step === 0 ? 'Forgot Password' : step === 1 ? 'Enter OTP' : 'Set New Password'}</h2>
        </div>

        {alert && (
          <div className={`auth-alert ${alert.type} mb-4 p-3 rounded-3`}>
            <span className="alert-icon me-2">{alert.type === 'error' ? '⚠' : '✓'}</span>{alert.msg}
          </div>
        )}

        {step === 0 && (
          <form onSubmit={handleSendOtp} className="auth-form">
            <div className="form-group mb-4">
              <label className="form-label mb-2">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconEmail /></span>
                <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
              </div>
            </div>
            <button type="submit" className="btn-auth w-100 py-3 rounded-pill" disabled={loading}>
              {loading ? 'SENDING CODE...' : 'SEND CODE'}
            </button>
          </form>
        )}

        {step === 1 && (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <p className="text-secondary text-center mb-4">We've sent a 6-digit code to <strong>{email}</strong></p>
            <div className="mb-4">
              <OtpInput value={otp} onChange={setOtp} />
            </div>
            <button type="submit" className="btn-auth w-100 py-3 rounded-pill mb-3" disabled={loading}>
              {loading ? 'VERIFYING...' : 'VERIFY CODE'}
            </button>
            <button type="button" className="btn btn-link w-100 text-gold" style={{ textDecoration: 'none', opacity: timer > 0 ? 0.6 : 1 }} onClick={handleSendOtp} disabled={timer > 0}>
              {timer > 0 ? `Resend Code in ${timer}s` : 'Resend Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group mb-4">
              <label className="form-label mb-2">New Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <input 
                  type={showPwd ? 'text' : 'password'} 
                  className="form-input" 
                  value={passwords.new} 
                  onChange={e => setPasswords(p => ({...p, new: e.target.value}))} 
                  placeholder="Min. 8 characters" 
                />
                <button type="button" className="input-action-btn" onClick={() => setShowPwd(!showPwd)}>
                  <IconEye open={showPwd} />
                </button>
              </div>
            </div>
            <div className="form-group mb-5">
              <label className="form-label mb-2">Confirm New Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <input 
                  type={showPwd ? 'text' : 'password'} 
                  className="form-input" 
                  value={passwords.confirm} 
                  onChange={e => setPasswords(p => ({...p, confirm: e.target.value}))} 
                  placeholder="Re-enter new password" 
                />
              </div>
            </div>
            <button type="submit" className="btn-auth w-100 py-3 rounded-pill" disabled={loading}>
              {loading ? 'RESETTING...' : 'RESET PASSWORD'}
            </button>
          </form>
        )}
        
        <div className="mt-5 text-center px-4">
          <Link to="/login" className="text-secondary" style={{ textDecoration: 'none', fontSize: '14px' }}>← Back to Sign In</Link>
        </div>
      </div>
    </AuthLayout>
  )
}
