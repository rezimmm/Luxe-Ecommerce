// Frontend/src/pages/auth/VerifyEmail.jsx
import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { verifyEmail } from '../../services/auth.service'

const IconCheck = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
const IconX = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32"><line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" /><line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" /></svg>
const IconMail = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="M2 7l10 7 10-7" /></svg>

export default function VerifyEmail() {
  const [params] = useSearchParams(); const [status, setStatus] = useState('verifying');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setStatus('error'); setMsg('Missing token'); return }
    verifyEmail(token).then(d => { setStatus('success'); setMsg(d.message) })
      .catch(e => { setStatus('error'); setMsg(e.response?.data?.message || 'Failed') })
  }, [params])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', textAlign: 'center' }}>
      <div style={{ maxWidth: 400, background: 'var(--bg-secondary)', padding: 40, borderRadius: 20, border: '1px solid var(--border-subtle)' }}>
        {status === 'verifying' && <h2>Verifying...</h2>}
        {status === 'success' && (
          <>
            <div style={{ color: '#4caf8a', marginBottom: 20 }}><IconCheck /></div>
            <h2>Verified!</h2>
            <p>{msg}</p>
            <Link to="/login" className="btn-auth" style={{ display: 'block', marginTop: 20, textDecoration: 'none' }}>Sign In</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ color: '#e05c5c', marginBottom: 20 }}><IconX /></div>
            <h2>Error</h2>
            <p>{msg}</p>
            <Link to="/login" style={{ display: 'block', marginTop: 20, color: 'var(--accent-gold)' }}>Try Login</Link>
          </>
        )}
      </div>
    </div>
  )
}
