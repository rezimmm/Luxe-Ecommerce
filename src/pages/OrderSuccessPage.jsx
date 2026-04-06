import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/shop.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (id) getOrder(id).then(setOrder).catch(console.error);
  }, [id]);

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1 container pb-5 pt-4 d-flex align-items-center justify-content-center"
        style={{ marginTop: '90px' }}>
        <div className="text-center" style={{ maxWidth: 520 }}>
          <div className="display-1 mb-4">✅</div>
          <h1 className="display-5 fw-bold mb-3">Order Confirmed!</h1>
          <p className="text-muted mb-2">Thank you for your purchase.</p>
          {order && (
            <p className="text-muted mb-4 small">
              Order <strong>#{order._id}</strong> •{' '}
              {order.payment.method === 'cod' ? 'Cash on Delivery' : 'Paid Online'} •{' '}
              ₹{order.total.toFixed(2)}
            </p>
          )}
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/profile" className="btn btn-dark rounded-2 px-4 py-2 fw-bold">
              View Orders
            </Link>
            <Link to="/" className="btn btn-outline-dark rounded-2 px-4 py-2 fw-bold">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
