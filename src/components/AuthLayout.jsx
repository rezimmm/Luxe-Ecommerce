// Frontend/src/components/AuthLayout.jsx
import React from 'react';

const AuthLayout = ({ children, tagline, taglineHighlight, description }) => {
  return (
    <div className="auth-layout">
      {/* ── Brand Panel ── */}
      <div className="auth-brand-panel">
        <div className="brand-grid-overlay" />
        <div className="brand-decorative" />

        <div className="brand-top">
          <div className="brand-logo">
            <div className="brand-logo-icon">✦</div>
            <span className="brand-logo-text">LUXE</span>
          </div>
        </div>

        <div className="brand-center">
          <h1 className="brand-tagline">
            {tagline} <span>{taglineHighlight}</span>
          </h1>
          <p className="brand-description">{description}</p>
          <div className="brand-stats">
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Clients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">12K+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form Panel ── */}
      <div className="auth-form-panel">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout;
