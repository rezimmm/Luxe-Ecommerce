import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, incrementQty, decrementQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="position-fixed inset-0 bg-black bg-opacity-25" style={{ zIndex: 1050 }}
            onClick={onClose} 
          />
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="position-fixed top-0 end-0 h-100 bg-white d-flex flex-column shadow-lg" 
            style={{ width: 'min(400px, 100vw)', zIndex: 1060 }}
          >
            <div className="px-4 py-4 d-flex justify-content-between align-items-center border-bottom">
              <div>
                 <h2 className="fw-bold h5 mb-0">Shopping Cart</h2>
                 {totalItems > 0 && <span className="text-muted small">You have {totalItems} items in your bag</span>}
              </div>
              <button className="btn p-0 border-0" onClick={onClose}><X size={20} className="text-muted" /></button>
            </div>
            
            <div className="flex-grow-1 overflow-auto px-4 py-3 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center">
                  <p className="text-muted mb-4 uppercase ls-widest small">Your bag is empty.</p>
                  <button className="btn btn-primary rounded-1 px-4 py-2 small fw-medium" onClick={onClose}>Continue Shopping</button>
                </div>
              ) : (
                cart.map(item => (
                  <motion.div layout key={`${item.id}-${item.size}-${item.color}`} className="d-flex gap-3 py-3 border-bottom position-relative">
                    <Link to={`/product/${item.id}`} onClick={onClose} className="d-block flex-shrink-0" style={{ width: 80, height: 100, backgroundColor: '#f8f9fa' }}>
                       <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-cover mix-blend-multiply" />
                    </Link>
                    <div className="flex-grow-1 d-flex flex-column">
                      <div className="d-flex justify-content-between mb-1">
                        <Link to={`/product/${item.id}`} onClick={onClose} className="text-dark text-decoration-none fw-medium small">{item.name}</Link>
                        <span className="fw-bold text-primary small">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="small text-muted mb-auto" style={{ fontSize: '0.75rem'}}>
                         {item.size && `Size: ${item.size}`} {item.size && item.color && '|'} {item.color && <span className="d-inline-flex align-items-center gap-1">Color: <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color, display: 'inline-block', border: '1px solid #ddd' }}></span></span>}
                      </p>
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="d-flex align-items-center border rounded-1 bg-white">
                           <button className="btn btn-sm p-1 border-0" onClick={() => decrementQty(item.id, item.size, item.color)}><Minus size={14} /></button>
                           <span className="small fw-medium px-2" style={{ minWidth: '1.5rem', textAlign: 'center' }}>{item.qty}</span>
                           <button className="btn btn-sm p-1 border-0" onClick={() => incrementQty(item.id, item.size, item.color)}><Plus size={14} /></button>
                        </div>
                        <button className="btn btn-link text-danger text-decoration-none small p-0 d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }} onClick={() => removeFromCart(item.id, item.size, item.color)}>
                           Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 bg-light border-top">
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-medium text-muted">Subtotal</span>
                  <span className="fw-bold">${subtotal.toFixed(2)}</span>
                </div>
                <button className="btn btn-primary w-100 rounded-2 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mb-2" onClick={handleCheckout}>
                  View Bag & Checkout <ArrowRight size={18} />
                </button>
                <button className="btn btn-link w-100 text-decoration-none text-muted small hover-opacity" onClick={onClose}>
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
