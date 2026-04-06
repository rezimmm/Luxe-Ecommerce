import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Thank you for subscribing to LUXE!');
    setEmail('');
  };

  return (
    <footer id="about-section" className="bg-light py-5 mt-5">
      <div className="container py-4">
        <div className="row g-5">
          <div className="col-lg-3">
            <h1 className="h5 fw-bold uppercase ls-widest mb-4 text-dark">Minimal</h1>
            <p className="text-muted small mb-4 lh-base" style={{ maxWidth: 280 }}>
              Curating high-end essentials for the modern lifestyle. Our mission is to provide timeless pieces that last a lifetime.
            </p>
          </div>
          <div className="col-lg-2 col-6">
            <h5 className="uppercase small fw-bold mb-4 ls-widest text-dark" style={{ fontSize: '0.75rem' }}>Shop</h5>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-3">
              <li><Link to="/" className="text-decoration-none text-muted hover-opacity">New Arrivals</Link></li>
              <li><Link to="/" className="text-decoration-none text-muted hover-opacity">Best Sellers</Link></li>
              <li><Link to="/" className="text-decoration-none text-muted hover-opacity">Gift Cards</Link></li>
              <li><Link to="/" className="text-decoration-none text-muted hover-opacity text-danger">Sale</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-6">
            <h5 className="uppercase small fw-bold mb-4 ls-widest text-dark" style={{ fontSize: '0.75rem' }}>Assistance</h5>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-3">
              <li><Link to="/" className="text-decoration-none text-muted hover-opacity">Shipping & Returns</Link></li>
              <li><Link to="/" className="text-decoration-none text-muted hover-opacity">Size Guide</Link></li>
              <li><Link to="/" className="text-decoration-none text-muted hover-opacity">Contact Us</Link></li>
              <li><Link to="/" className="text-decoration-none text-muted hover-opacity">FAQs</Link></li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h5 className="uppercase small fw-bold mb-4 ls-widest text-dark" style={{ fontSize: '0.75rem' }}>Stay Connected</h5>
            <p className="text-muted small mb-4 lh-base" style={{ maxWidth: 300 }}>
              Subscribe to our newsletter for exclusive access to new launches.
            </p>
            <form onSubmit={handleSubscribe} className="input-group">
              <input 
                type="email" 
                className="form-control rounded-1 px-3 py-2 bg-white border-subtle shadow-none" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-dark fw-bold uppercase ls-widest border-0 px-4" style={{ fontSize: '0.75rem' }}>Join</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
