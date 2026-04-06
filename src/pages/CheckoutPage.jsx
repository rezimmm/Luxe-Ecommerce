// Frontend/src/pages/CheckoutPage.jsx  (NEW FILE)
// Full checkout page with address form + Razorpay + COD

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkout, initiateRazorpayPayment } from '../services/shop.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    line1: '', line2: '', city: '', state: '', zip: '', country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const tax = parseFloat((subtotal * 0.18).toFixed(2));
  const shippingCost = subtotal >= 999 ? 0 : 99;
  const total = subtotal + tax + shippingCost;

  const validate = () => {
    const e = {};
    if (!address.fullName.trim()) e.fullName = 'Full name is required';
    if (!address.phone.trim()) e.phone = 'Phone is required';
    if (!address.line1.trim()) e.line1 = 'Address is required';
    if (!address.city.trim()) e.city = 'City is required';
    if (!address.state.trim()) e.state = 'State is required';
    if (!address.zip.trim()) e.zip = 'PIN code is required';
    return e;
  };

  const handleChange = (field) => (e) => {
    setAddress(a => ({ ...a, [field]: e.target.value }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const result = await checkout(address, paymentMethod);

      if (paymentMethod === 'cod') {
        await clearCart();
        navigate(`/order-success/${result.order._id}`);
        return;
      }

      // Razorpay
      initiateRazorpayPayment({
        razorpayOrder: result.razorpayOrder,
        order: result.order,
        user,
        onSuccess: async (order) => {
          await clearCart();
          navigate(`/order-success/${order._id}`);
        },
        onFailure: (err) => {
          console.error('Payment failed:', err);
          toast.error(err.message || 'Payment failed');
          setLoading(false);
        },
      });
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.message || err.message || 'Checkout failed. Please try again.';
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1 container pb-5 pt-4" style={{ marginTop: '90px' }}>
        <h1 className="display-5 fw-bold mb-5 ls-tighter">Checkout</h1>

        <div className="row g-5">
          {/* ── Address Form ── */}
          <div className="col-lg-7">
            <div className="bg-white border rounded p-4 shadow-sm">
              <h3 className="h5 fw-bold mb-4">Shipping Address</h3>
              <form onSubmit={handlePlaceOrder} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-uppercase">Full Name *</label>
                    <input className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                      value={address.fullName} onChange={handleChange('fullName')} />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-uppercase">Phone *</label>
                    <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      value={address.phone} onChange={handleChange('phone')} type="tel" />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-uppercase">Address Line 1 *</label>
                    <input className={`form-control ${errors.line1 ? 'is-invalid' : ''}`}
                      value={address.line1} onChange={handleChange('line1')}
                      placeholder="House no., Street name" />
                    {errors.line1 && <div className="invalid-feedback">{errors.line1}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold text-uppercase">Address Line 2 (optional)</label>
                    <input className="form-control" value={address.line2} onChange={handleChange('line2')}
                      placeholder="Landmark, Area" />
                  </div>
                  <div className="col-md-5">
                    <label className="form-label small fw-bold text-uppercase">City *</label>
                    <input className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      value={address.city} onChange={handleChange('city')} />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-uppercase">State *</label>
                    <input className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                      value={address.state} onChange={handleChange('state')} />
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold text-uppercase">PIN Code *</label>
                    <input className={`form-control ${errors.zip ? 'is-invalid' : ''}`}
                      value={address.zip} onChange={handleChange('zip')} maxLength={6} />
                    {errors.zip && <div className="invalid-feedback">{errors.zip}</div>}
                  </div>
                </div>

                {/* Payment Method */}
                <h3 className="h5 fw-bold mt-5 mb-4">Payment Method</h3>
                <div className="d-flex gap-3 mb-4">
                  <div
                    className={`border rounded-2 p-3 flex-grow-1 cursor-pointer ${paymentMethod === 'razorpay' ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                    onClick={() => setPaymentMethod('razorpay')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <input type="radio" readOnly checked={paymentMethod === 'razorpay'} />
                      <div>
                        <p className="fw-bold mb-0 small">Pay Online</p>
                        <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>UPI, Cards, Net Banking via Razorpay</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`border rounded-2 p-3 flex-grow-1 ${paymentMethod === 'cod' ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <input type="radio" readOnly checked={paymentMethod === 'cod'} />
                      <div>
                        <p className="fw-bold mb-0 small">Cash on Delivery</p>
                        <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Pay when your order arrives</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-2"
                  disabled={loading || cart.length === 0}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                  {paymentMethod === 'cod' ? 'Place Order' : `Secure Checkout — $${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="col-lg-5">
            <div className="bg-white border rounded p-4 shadow-sm position-sticky" style={{ top: 100 }}>
              <h3 className="h5 fw-bold mb-4">Order Summary</h3>
              <div className="d-flex flex-column gap-3 mb-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="d-flex gap-3 align-items-center">
                    <img src={item.image} alt={item.name}
                      style={{ width: 60, height: 70, objectFit: 'cover', borderRadius: 4 }} />
                    <div className="flex-grow-1">
                      <p className="fw-medium mb-0 small">{item.name}</p>
                      <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                        {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                        {` • Qty: ${item.qty}`}
                      </p>
                    </div>
                    <span className="fw-bold small">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr />
              <div className="d-flex flex-column gap-2 small text-muted mb-3">
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span><span className="text-dark">${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>GST (18%)</span><span className="text-dark">${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-success fw-bold' : 'text-dark'}>
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 border-top pt-3">
                <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
