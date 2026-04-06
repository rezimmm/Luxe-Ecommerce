import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, Settings, ChevronRight, LogOut, CreditCard, Mail, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import * as shopService from '../services/shop.service';
import * as authService from '../services/auth.service';
import { toast } from 'react-hot-toast';

export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const { user, signOut, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [prefs, setPrefs] = useState({
    newsletter: user?.emailPreferences?.newsletter ?? true,
    promotions: user?.emailPreferences?.promotions ?? true,
  });

  useEffect(() => {
    if (user) {
      shopService.getMyOrders()
        .then(res => setOrders(res.orders || []))
        .catch(err => console.error('Failed to fetch orders:', err))
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  if (!user) return null; // fallback for ProtectedRoute

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSavePrefs = async () => {
    try {
      const res = await authService.updateEmailPreferences(prefs);
      if (res.success) {
        updateUser(res.user);
        toast.success('Preferences saved successfully');
      }
    } catch (err) {
      toast.error('Failed to save preferences');
    }
  };

  const [showCardModal, setShowCardModal] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({ line1: '', city: '', state: '', zip: '', country: 'India', isDefault: true });

  const handleAddPayment = async (e) => {
    e.preventDefault();
    setLoadingOrders(true);
    try {
      // Simulation: Extract brand and last4
      const brand = newCard.number.startsWith('4') ? 'Visa' : newCard.number.startsWith('5') ? 'Mastercard' : 'Amex';
      const last4 = newCard.number.slice(-4);
      
      const payload = { brand, last4, expiry: newCard.expiry, isDefault: true };
      const res = await authService.addPaymentMethod(payload);
      
      if (res.success) {
        updateUser({ ...user, paymentMethods: res.paymentMethods });
        toast.success('Card added successfully');
        setShowCardModal(false);
        setNewCard({ number: '', name: '', expiry: '', cvv: '' });
      }
    } catch (err) {
      toast.error('Failed to add payment method');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleRemovePayment = async (index) => {
    try {
      const res = await authService.removePaymentMethod(index);
      if (res.success) {
        updateUser({ ...user, paymentMethods: res.paymentMethods });
        toast.success('Payment method removed');
      }
    } catch (err) {
      toast.error('Failed to remove payment method');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.updateProfile(profileForm);
      if (res.success) {
        updateUser(res.user);
        toast.success('Profile updated');
        setShowProfileModal(false);
      }
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.addAddress(addressForm);
      if (res.success) {
        updateUser({ ...user, addresses: res.addresses });
        toast.success('Address added');
        setShowAddressModal(false);
        setAddressForm({ line1: '', city: '', state: '', zip: '', country: 'India', isDefault: true });
      }
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleRemoveAddress = async (index) => {
    try {
      const res = await authService.removeAddress(index);
      if (res.success) {
        updateUser({ ...user, addresses: res.addresses });
        toast.success('Address removed');
      }
    } catch (err) {
      toast.error('Failed to remove address');
    }
  };

  const handleQuickAdd = async (product) => {
    try {
      const size  = product.sizes?.[0] || 'M';
      const color = product.colors?.[0] || 'Black';
      await addToCart(product, size, color, 1);
      toast.success(`${product.name} added to bag`);
    } catch (err) {
      toast.error('Failed to add to bag');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Account Overview', icon: <User size={18} /> },
    { id: 'orders', label: 'Order History', icon: <Package size={18} /> },
    { id: 'wishlist', label: 'Saved Items', icon: <Heart size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2 className="h4 fw-bold mb-4 ls-widest uppercase">Account Overview</h2>
            <div className="row g-4 mb-5">
              <div className="col-md-6">
                <div className="p-4 border bg-light-subtle h-100">
                  <h3 className="h6 fw-bold mb-3 uppercase text-muted">Profile Details</h3>
                   <p className="mb-1 text-dark fw-medium">{user.name}</p>
                  <p className="mb-2 text-muted small">{user.email}</p>
                  <p className="mb-0 text-muted small">{user.joined}</p>
                  <button onClick={() => setShowProfileModal(true)} className="btn btn-link text-primary p-0 text-decoration-none small mt-3 fw-bold uppercase" style={{ fontSize: '0.75rem' }}>Edit Profile</button>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-4 border bg-light-subtle h-100">
                  <h3 className="h6 fw-bold mb-3 uppercase text-muted">Default Address</h3>
                  <p className="mb-1 text-dark fw-medium">{user.addresses?.[0]?.fullName || user.name}</p>
                  <p className="mb-1 text-dark small lh-lg" style={{ maxWidth: '200px' }}>
                    {user.addresses?.find(a => a.isDefault)?.line1 || user.addresses?.[0]?.line1 || 'No address saved.'}
                    {user.addresses?.length > 0 && <span className="d-block text-muted">{user.addresses?.[0]?.city}, {user.addresses?.[0]?.state}</span>}
                  </p>
                  <button onClick={() => setShowAddressModal(true)} className="btn btn-link text-primary p-0 text-decoration-none small mt-3 fw-bold uppercase" style={{ fontSize: '0.75rem' }}>Manage Addresses</button>
                </div>
              </div>
            </div>

            <h3 className="h6 fw-bold mb-3 uppercase text-muted mt-5">Recent Activity</h3>
            {loadingOrders ? (
              <div className="py-4 text-center border"><span className="spinner-border spinner-border-sm me-2"></span>Loading orders...</div>
            ) : orders.length > 0 ? (
              <div className="border p-3 d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-0 fw-bold">#{orders[0].orderId || orders[0]._id}</p>
                  <p className="mb-0 small text-muted">{new Date(orders[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="text-end">
                  <p className="mb-0 fw-bold">${orders[0].total?.toFixed(2)}</p>
                  <span className="badge bg-dark-subtle text-dark fw-medium rounded-0 text-uppercase">{orders[0].status}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted small">No recent activity.</p>
            )}
          </motion.div>
        );

      case 'orders':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2 className="h4 fw-bold mb-4 ls-widest uppercase">Order History</h2>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr className="uppercase small text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    <th className="fw-medium pb-3 border-bottom">Order</th>
                    <th className="fw-medium pb-3 border-bottom">Date</th>
                    <th className="fw-medium pb-3 border-bottom">Status</th>
                    <th className="fw-medium pb-3 border-bottom">Total</th>
                    <th className="fw-medium pb-3 border-bottom text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingOrders ? (
                    <tr><td colSpan="5" className="text-center py-5">Loading orders...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-5 text-muted">No orders found.</td></tr>
                  ) : orders.map((order, idx) => (
                    <tr key={idx}>
                      <td className="py-4 fw-bold text-dark">#{order.orderId || order._id}</td>
                      <td className="py-4 text-muted small">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className={`badge rounded-0 fw-medium text-uppercase ${order.status === 'delivered' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 fw-medium text-dark">${order.total?.toFixed(2)}</td>
                      <td className="py-4 text-end">
                        <button className="btn btn-outline-dark btn-sm rounded-0 uppercase py-2 px-3 fw-bold" style={{ fontSize: '0.7rem' }}>View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        );

      case 'wishlist':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2 className="h4 fw-bold mb-4 ls-widest uppercase">Saved Items</h2>
            {wishlist.length === 0 ? (
              <div className="text-center py-5 border bg-light-subtle">
                <Heart size={32} className="text-muted mb-3" />
                <p className="text-muted fw-medium mb-4">Your wishlist is currently empty.</p>
                <Link to="/" className="btn btn-dark uppercase rounded-0 px-4 py-2 text-white fw-bold">Explore Collection</Link>
              </div>
            ) : (
              <div className="row g-4">
                {wishlist.map(item => (
                  <div key={item.id} className="col-md-6 col-lg-4">
                    <div className="card border-0 rounded-0 h-100 group">
                      <div className="position-relative bg-light mb-3" style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                        <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-cover transition-luxury hover-scale" />
                        <button
                          className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                          style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={() => toggleWishlist(item)}
                        >
                          <Heart size={16} fill="#000" color="#000" />
                        </button>
                      </div>
                      <div className="d-flex flex-column flex-grow-1">
                        <h3 className="h6 fw-bold mb-1">{item.name}</h3>
                        <p className="small text-muted mb-3">${item.price.toFixed(2)}</p>
                        <button
                          onClick={() => handleQuickAdd(item)}
                          className="btn btn-dark w-100 rounded-0 uppercase fw-bold py-2 mt-auto text-white transition-luxury hover-opacity"
                          style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h2 className="h4 fw-bold mb-4 ls-widest uppercase">Settings</h2>

            {/* Payment Methods */}
            <div className="mb-5">
              <h3 className="h6 fw-bold mb-4 uppercase text-muted d-flex align-items-center gap-2">
                <CreditCard size={18} /> Payment Methods
              </h3>
              {user.paymentMethods?.length > 0 ? user.paymentMethods.map((pm, idx) => (
                <div key={idx} className="border p-4 mb-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2 border">
                      <span className="fw-bold fw-italic" style={{ fontStyle: 'italic', letterSpacing: '0.1em' }}>{pm.brand.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="mb-0 fw-medium">{pm.brand} ending in {pm.last4}</p>
                      <p className="mb-0 small text-muted">Expires {pm.expiry}</p>
                    </div>
                  </div>
                  <button onClick={() => handleRemovePayment(idx)} className="btn btn-link text-muted p-0 small text-decoration-none">Remove</button>
                </div>
              )) : (
                <p className="text-muted small border p-4 mb-3">No payment methods saved.</p>
              )}
              <button onClick={() => setShowCardModal(true)} className="btn btn-outline-dark rounded-0 uppercase px-4 py-2 fw-bold" style={{ fontSize: '0.75rem' }}>+ Add Payment Method</button>
            </div>

            {/* Email Preferences */}
            <div>
              <h3 className="h6 fw-bold mb-4 uppercase text-muted d-flex align-items-center gap-2">
                <Mail size={18} /> Email Preferences
              </h3>
              <div className="border p-4">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input bg-dark border-dark"
                    type="checkbox"
                    role="switch"
                    id="newsSwitch"
                    checked={prefs.newsletter}
                    onChange={(e) => setPrefs({ ...prefs, newsletter: e.target.checked })}
                  />
                  <label className="form-check-label ms-2" htmlFor="newsSwitch">
                    <span className="fw-medium d-block">LUXE Newsletter</span>
                    <span className="small text-muted">Receive updates on new arrivals, exclusive collections, and styling tips.</span>
                  </label>
                </div>
                <hr className="my-4 text-muted opacity-25" />
                <div className="form-check form-switch">
                  <input
                    className="form-check-input bg-dark border-dark"
                    type="checkbox"
                    role="switch"
                    id="promoSwitch"
                    checked={prefs.promotions}
                    onChange={(e) => setPrefs({ ...prefs, promotions: e.target.checked })}
                  />
                  <label className="form-check-label ms-2" htmlFor="promoSwitch">
                    <span className="fw-medium d-block">Promotions & Offers</span>
                    <span className="small text-muted">Get notified about private sales and special promotional events.</span>
                  </label>
                </div>
              </div>
              <button onClick={handleSavePrefs} className="btn btn-dark rounded-0 uppercase px-5 py-3 fw-bold text-white mt-4" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>Save Preferences</button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Navbar />

      <main className="flex-grow-1 container pb-5 position-relative pt-4 w-100" style={{ marginTop: '120px' }}>

        {/* Page Header */}
        <div className="mb-5 pb-3 border-bottom d-flex justify-content-between align-items-end">
          <div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb small uppercase ls-widest mb-1" style={{ fontSize: '0.65rem' }}>
                <li className="breadcrumb-item text-muted"><Link to="/" className="text-muted text-decoration-none">HOME</Link></li>
                <li className="breadcrumb-item text-dark fw-bold" aria-current="page">PROFILE</li>
              </ol>
            </nav>
            <h1 className="display-5 fw-bold mb-0 ls-tighter text-dark">My Account</h1>
          </div>
          <p className="text-muted mb-0 d-none d-md-block fw-medium">Welcome back, {user.name?.split(" ")[0] || 'Member'}</p>
        </div>

        <div className="row g-5">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="d-flex flex-column gap-2 sticky-top" style={{ top: '120px' }}>
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`btn text-start d-flex align-items-center justify-content-between p-3 rounded-0 border-0 transition-luxury ${activeTab === item.id
                    ? 'bg-dark text-white fw-bold shadow-sm'
                    : 'bg-transparent text-dark hover-bg-light'
                    }`}
                >
                  <span className="d-flex align-items-center gap-3">
                    {item.icon}
                    <span className="uppercase ls-widest" style={{ fontSize: '0.75rem' }}>{item.label}</span>
                  </span>
                  {activeTab === item.id && <ChevronRight size={16} />}
                </button>
              ))}

              <hr className="my-3 text-muted opacity-25" />

              <button onClick={handleLogout} className="btn text-start d-flex align-items-center p-3 rounded-0 border-0 text-danger hover-bg-light transition-luxury w-100">
                <span className="d-flex align-items-center gap-3">
                  <LogOut size={18} />
                  <span className="uppercase ls-widest fw-bold" style={{ fontSize: '0.75rem' }}>Log Out</span>
                </span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="col-lg-9 ps-lg-5">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>

      </main>

      <Footer />

      {/* Add Card Modal */}
      <AnimatePresence>
        {showCardModal && (
          <div className="position-fixed inset-0 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 9999 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="position-absolute w-100 h-100 bg-black bg-opacity-75" style={{ backdropFilter: 'blur(4px)' }} onClick={() => setShowCardModal(false)} />
            
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-4 p-md-5 rounded-0 shadow-lg position-relative" style={{ width: '100%', maxWidth: '450px' }}>
              <h3 className="h5 fw-bold mb-4 uppercase ls-widest">New Payment Method</h3>
              <form onSubmit={handleAddPayment}>
                <div className="mb-3">
                  <label className="form-label small fw-bold uppercase text-muted">Cardholder Name</label>
                  <input type="text" className="form-control rounded-0" required placeholder="Name as on card"
                    value={newCard.name} onChange={e => setNewCard({...newCard, name: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold uppercase text-muted">Card Number</label>
                  <div className="position-relative">
                    <input type="text" className="form-control rounded-0" required placeholder="0000 0000 0000 0000" maxLength={16}
                      value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value})} />
                    <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                       <CreditCard size={18} className="text-muted" />
                    </div>
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold uppercase text-muted">Expiry (MM/YY)</label>
                    <input type="text" className="form-control rounded-0" required placeholder="MM/YY" maxLength={5}
                      value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold uppercase text-muted">CVV</label>
                    <input type="password" className="form-control rounded-0" required placeholder="000" maxLength={3}
                      value={newCard.cvv} onChange={e => setNewCard({...newCard, cvv: e.target.value})} />
                  </div>
                </div>
                <div className="mt-5 d-flex gap-3">
                  <button type="button" className="btn btn-outline-dark w-100 rounded-0 uppercase fw-bold" onClick={() => setShowCardModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-dark w-100 rounded-0 uppercase fw-bold">Securely Save</button>
                </div>
                <p className="mt-4 mb-0 text-center text-muted" style={{ fontSize: '0.65rem' }}>
                  <span className="me-1">🔒</span> Your payment data is protected with 256-bit encryption.
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="position-fixed inset-0 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 9999 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="position-absolute w-100 h-100 bg-black bg-opacity-75" style={{ backdropFilter: 'blur(4px)' }} onClick={() => setShowProfileModal(false)} />
            
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-4 p-md-5 rounded-0 shadow-lg position-relative" style={{ width: '100%', maxWidth: '450px' }}>
              <h3 className="h5 fw-bold mb-4 uppercase ls-widest text-dark">Edit Profile</h3>
              <form onSubmit={handleSaveProfile}>
                <div className="mb-3">
                  <label className="form-label small fw-bold uppercase text-muted">Full Name</label>
                  <input type="text" className="form-control rounded-0" required 
                    value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold uppercase text-muted">Phone Number</label>
                  <input type="text" className="form-control rounded-0" 
                    value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
                </div>
                <div className="d-flex gap-3 mt-5">
                  <button type="button" className="btn btn-outline-dark w-100 rounded-0 uppercase fw-bold" onClick={() => setShowProfileModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-dark w-100 rounded-0 uppercase fw-bold">Update Profile</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="position-fixed inset-0 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 9999 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="position-absolute w-100 h-100 bg-black bg-opacity-75" style={{ backdropFilter: 'blur(4px)' }} onClick={() => setShowAddressModal(false)} />
            
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-4 p-md-5 rounded-0 shadow-lg position-relative" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 className="h5 fw-bold mb-4 uppercase ls-widest text-dark">Manage Addresses</h3>
              
              {/* Existing Addresses */}
              <div className="mb-5">
                <h4 className="small fw-bold uppercase text-muted mb-3">Saved Addresses</h4>
                {user.addresses?.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {user.addresses.map((addr, idx) => (
                      <div key={idx} className="border p-3 d-flex justify-content-between align-items-center bg-light">
                        <div>
                          <p className="mb-0 fw-bold small">{addr.line1}</p>
                          <p className="mb-0 text-muted smaller">{addr.city}, {addr.state} {addr.zip}</p>
                          {addr.isDefault && <span className="badge bg-dark-subtle text-dark rounded-0 mt-2 uppercase" style={{ fontSize: '0.6rem' }}>Default</span>}
                        </div>
                        <button onClick={() => handleRemoveAddress(idx)} className="btn btn-link text-danger p-0 border-0"><Plus size={18} style={{ transform: 'rotate(45deg)' }} /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small italic">No addresses saved yet.</p>
                )}
              </div>

              {/* Add New Address */}
              <h4 className="small fw-bold uppercase text-muted mb-3 border-top pt-4">Add New Address</h4>
              <form onSubmit={handleAddAddress}>
                <div className="mb-3">
                  <label className="form-label small fw-bold uppercase text-muted">Address Line 1</label>
                  <input type="text" className="form-control rounded-0" required value={addressForm.line1} onChange={e => setAddressForm({...addressForm, line1: e.target.value})} />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold uppercase text-muted">City</label>
                    <input type="text" className="form-control rounded-0" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold uppercase text-muted">State</label>
                    <input type="text" className="form-control rounded-0" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                  </div>
                </div>
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="form-label small fw-bold uppercase text-muted">ZIP Code</label>
                    <input type="text" className="form-control rounded-0" required value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold uppercase text-muted">Country</label>
                    <input type="text" className="form-control rounded-0" required value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} />
                  </div>
                </div>
                <div className="d-flex gap-3 mt-5">
                  <button type="button" className="btn btn-outline-dark w-100 rounded-0 uppercase fw-bold" onClick={() => setShowAddressModal(false)}>Close</button>
                  <button type="submit" className="btn btn-dark w-100 rounded-0 uppercase fw-bold">Save Address</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
