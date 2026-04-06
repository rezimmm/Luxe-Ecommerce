import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Minus, Plus, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, incrementQty, decrementQty, removeFromCart } = useCart();
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxes = subtotal * 0.08; // 8% tax
  const total = subtotal + taxes;
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-vh-100 bg-light-subtle d-flex flex-column">
      <Navbar />
      
      <main className="flex-grow-1 container pb-5 position-relative pt-4 w-100" style={{ marginTop: '90px' }}>
        
        <div className="mb-5 pb-3">
           <h1 className="display-5 fw-bold mb-2 ls-tighter text-dark">Shopping Cart</h1>
           <p className="text-muted fw-medium ts-widest">
             {totalItems === 0 ? "YOUR BAG IS EMPTY" : `YOU HAVE ${totalItems} ${totalItems === 1 ? 'ITEM' : 'ITEMS'} IN YOUR BAG`}
           </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white p-5 text-center border shadow-sm">
            <i className="bi bi-cart3 display-1 text-muted mb-4 opacity-25 d-block" />
            <h2 className="h4 fw-bold text-dark mb-3">There are no items in your cart.</h2>
            <p className="text-muted mb-4">Discover our latest collections and add items to your cart.</p>
            <Link to="/" className="btn btn-dark uppercase rounded-0 px-5 py-3 fw-bold ls-widest" style={{ fontSize: '0.75rem' }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="row g-5">
            {/* Cart Items List */}
            <div className="col-lg-8">
               <div className="bg-white border rounded p-0 overflow-hidden shadow-sm">
                 
                 {/* Table Header */}
                 <div className="d-none d-md-grid text-muted small fw-bold uppercase ls-widest px-4 py-3 border-bottom bg-light" style={{ gridTemplateColumns: '2fr 1fr 1fr auto', fontSize: '0.7rem' }}>
                    <div>Product</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-end">Total</div>
                    <div style={{ width: 40}}></div>
                 </div>

                 <AnimatePresence>
                   <div className="d-flex flex-column">
                     {cart.map((item, idx) => (
                       <motion.div 
                         layout 
                         key={`${item.id}-${item.size}-${item.color}`}
                         initial={{ opacity: 0, scale: 0.98 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, height: 0, padding: 0, margin: 0, overflow: 'hidden' }}
                         className={`d-md-grid px-4 py-4 align-items-center ${idx !== cart.length - 1 ? 'border-bottom' : ''}`}
                         style={{ gridTemplateColumns: '2fr 1fr 1fr auto' }}
                       >
                          {/* Product Column */}
                          <div className="d-flex gap-4 align-items-start align-items-md-center mb-3 mb-md-0">
                            <Link to={`/product/${item.id}`} className="flex-shrink-0 d-block border" style={{ width: 100, height: 130, backgroundColor: '#f8f9fa' }}>
                              <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-cover mix-blend-multiply" />
                            </Link>
                            <div>
                               <Link to={`/product/${item.id}`} className="text-dark text-decoration-none fw-bold h6 d-block mb-1">{item.name}</Link>
                               <span className="text-muted small d-block mb-2 pb-1">${item.price.toFixed(2)}</span>
                               
                               <div className="text-muted small d-flex flex-column gap-1" style={{ fontSize: '0.8rem' }}>
                                  {item.size && <span>Size: <span className="text-dark fw-medium">{item.size}</span></span>}
                                  {item.color && (
                                    <span className="d-flex align-items-center gap-2">
                                      Color: 
                                      <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color, display: 'inline-block', border: '1px solid #ddd' }}></span>
                                    </span>
                                  )}
                               </div>
                               
                               {/* Mobile Only Qty/Total */}
                               <div className="d-md-none mt-3 d-flex justify-content-between align-items-center w-100">
                                  <div className="d-flex align-items-center border rounded-1">
                                     <button className="btn btn-sm text-dark px-2 border-0" onClick={() => decrementQty(item.id, item.size, item.color)}><Minus size={14} /></button>
                                     <span className="fw-medium px-2 small">{item.qty}</span>
                                     <button className="btn btn-sm text-dark px-2 border-0" onClick={() => incrementQty(item.id, item.size, item.color)}><Plus size={14} /></button>
                                  </div>
                                  <span className="fw-bold">${(item.price * item.qty).toFixed(2)}</span>
                               </div>
                            </div>
                          </div>

                          {/* Desktop Qty Column */}
                          <div className="d-none d-md-flex justify-content-center">
                             <div className="d-flex align-items-center border rounded-1 py-1 px-1">
                                <button className="btn btn-sm text-dark px-2 border-0 hover-opacity" onClick={() => decrementQty(item.id, item.size, item.color)}><Minus size={14} /></button>
                                <span className="fw-bold px-3 small">{item.qty}</span>
                                <button className="btn btn-sm text-dark px-2 border-0 hover-opacity" onClick={() => incrementQty(item.id, item.size, item.color)}><Plus size={14} /></button>
                             </div>
                          </div>

                          {/* Desktop Total Column */}
                          <div className="d-none d-md-block text-end fw-bold fs-5 text-dark">
                             ${(item.price * item.qty).toFixed(2)}
                          </div>

                          {/* Remove Action */}
                          <div className="text-end ps-3 position-absolute top-0 end-0 p-3 position-md-static">
                             <button className="btn btn-link text-danger p-0 border-0 hover-opacity" title="Remove Item" onClick={() => removeFromCart(item.id, item.size, item.color)}>
                               <i className="bi bi-trash3 fs-5" />
                             </button>
                          </div>
                          
                       </motion.div>
                     ))}
                   </div>
                 </AnimatePresence>
               </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="col-lg-4">
               <div className="bg-white border rounded p-4 shadow-sm position-sticky" style={{ top: 100 }}>
                  <h3 className="h5 fw-bold mb-4 ls-tighter">Order Summary</h3>
                  
                  <div className="d-flex flex-column gap-3 mb-4 text-muted small">
                     <div className="d-flex justify-content-between">
                        <span>Subtotal</span>
                        <span className="text-dark fw-medium">${subtotal.toFixed(2)}</span>
                     </div>
                     <div className="d-flex justify-content-between">
                        <span>Estimated Tax (8%)</span>
                        <span className="text-dark fw-medium">${taxes.toFixed(2)}</span>
                     </div>
                     <div className="d-flex justify-content-between">
                        <span>Shipping</span>
                        <span className="text-success fw-bold">Free</span>
                     </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center pt-4 border-top mb-4">
                     <span className="fw-bold text-dark h5 mb-0">Total</span>
                     <span className="fw-bold text-primary h4 mb-0">${total.toFixed(2)}</span>
                  </div>
                  
                  <Link to="/checkout" className="btn btn-primary w-100 rounded-2 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm hover-opacity text-decoration-none">
                    <Lock size={16} /> Proceed to Checkout
                  </Link>
                  
                  <Link to="/" className="btn btn-light w-100 rounded-2 py-2 text-muted fw-medium d-flex align-items-center justify-content-center gap-2 small border hover-opacity">
                    <ArrowRight size={14} className="order-2" /> Continue Shopping
                  </Link>
                  
                  {/* Payment Methods */}
                  <div className="mt-4 pt-4 border-top text-center">
                    <p className="text-muted small uppercase ls-widest mb-3" style={{ fontSize: '0.65rem' }}>Secure Checkout</p>
                    <div className="d-flex gap-2 justify-content-center opacity-75">
                      <i className="bi bi-credit-card-fill fs-4 text-muted" />
                      <i className="bi bi-paypal fs-4 text-primary" />
                      <i className="bi bi-apple fs-4 text-dark" />
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
