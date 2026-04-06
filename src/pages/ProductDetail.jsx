import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import * as shopService from '../services/shop.service';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchProduct() {
      try {
        const data = await shopService.getProduct(id);
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center px-4">
        <div className="spinner-border text-dark mb-3"></div>
        <p className="text-muted">Fetching details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center px-4">
        <h1 className="display-5 fw-bold mb-3 ls-tighter">Product Not Found</h1>
        <p className="text-muted mb-4">We couldn't find the piece you're looking for.</p>
        <button onClick={() => navigate('/')} className="btn btn-dark uppercase rounded-0 px-4 py-3 fw-bold ls-widest" style={{ fontSize: '0.75rem' }}>
          Back to Shopping
        </button>
      </div>
    );
  }

  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product, selectedSize, selectedColor);
    // Optional: Open Drawer or toast here directly from context or via state
  };

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Navbar />
      
      <main className="flex-grow-1 container pb-5 position-relative pt-4 w-100 d-flex justify-content-center" style={{ zIndex: 1, marginTop: '90px' }}>
        <div className="row w-100" style={{ maxWidth: '1200px' }}>
          
          {/* Product Image Section */}
          <div className="col-lg-7 mb-5 mb-lg-0 pe-lg-5">
             <ol className="breadcrumb small uppercase ls-widest mb-4 d-lg-none" style={{ fontSize: '0.65rem' }}>
               <li className="breadcrumb-item text-muted">HOME</li>
               <li className="breadcrumb-item text-muted">{product.department?.toUpperCase() || 'SHOP'}</li>
               <li className="breadcrumb-item text-dark fw-bold" aria-current="page">{product.category?.toUpperCase() || 'ITEM'}</li>
             </ol>
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5, ease: 'easeOut' }}
               className="bg-light position-relative" style={{ aspectRatio: '3/4', maxHeight: '80vh', overflow: 'hidden' }}
             >
               <img src={product.images?.[0]?.url || product.image || "/placeholder.png"} alt={product.name} className="w-100 h-100 object-fit-cover mix-blend-multiply" />
               {product.badge && (
                 <span className="position-absolute top-0 start-0 m-4 px-3 py-1 bg-dark text-white uppercase fw-bold" style={{ fontSize: '0.75rem' }}>
                   {product.badge}
                 </span>
               )}
             </motion.div>
          </div>

          {/* Product Info Section */}
          <div className="col-lg-5 ps-lg-4 pt-lg-2">
            
            <div className="d-none d-lg-block mb-4">
              <ol className="breadcrumb small uppercase ls-widest" style={{ fontSize: '0.65rem' }}>
                <li className="breadcrumb-item text-muted">HOME</li>
                <li className="breadcrumb-item text-muted">{product.department?.toUpperCase() || 'SHOP'}</li>
                <li className="breadcrumb-item text-dark fw-bold" aria-current="page">{product.category?.toUpperCase() || 'ITEM'}</li>
              </ol>
            </div>

            <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="display-5 fw-bold mb-3 ls-tighter">{product.name}</h1>
              
              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="fs-4 fw-bold text-dark">${product.price.toFixed(2)}</span>
                {product.originalPrice && <span className="fs-5 text-muted text-decoration-line-through">${product.originalPrice.toFixed(2)}</span>}
              </div>

              <p className="text-muted lh-lg mb-5" style={{ fontSize: '0.95rem' }}>
                {product.description || "A delicately crafted piece designed with timeless elegance and modern functionality. Made from premium materials for enduring quality."}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-medium uppercase ls-widest small">Color</span>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button 
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className="btn btn-link p-0 rounded-circle border d-flex align-items-center justify-content-center position-relative transition-luxury"
                        style={{ 
                          width: 40, height: 40, backgroundColor: c, 
                          borderColor: c === '#FFFFFF' ? '#e2e8f0' : 'transparent',
                          boxShadow: selectedColor === c ? `0 0 0 2px white, 0 0 0 4px ${c === '#FFFFFF' ? '#e2e8f0' : c}` : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-medium uppercase ls-widest small">Size</span>
                    <button className="btn btn-link text-decoration-underline p-0 text-muted small hover-opacity">Size Guide</button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button 
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`btn rounded-1 fw-medium transition-luxury ${selectedSize === s ? 'btn-dark' : 'btn-outline-dark text-dark border-light bg-light hover-border-dark'}`}
                        style={{ width: 64, height: 48, fontSize: '0.85rem' }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Actions */}
              <div className="d-flex flex-column gap-3 mb-5 pt-3">
                 <button 
                   onClick={handleAddToCart}
                   className="btn btn-dark w-100 rounded-0 py-3 uppercase fw-bold ls-widest d-flex align-items-center justify-content-center gap-2 hover-opacity"
                   style={{ fontSize: '0.85rem' }}
                 >
                   Add to Bag <span className="text-light opacity-75">—</span> ${product.price.toFixed(2)}
                 </button>
                 <button onClick={() => toggleWishlist(product)} className="btn btn-outline-dark w-100 rounded-0 py-3 uppercase fw-bold ls-widest d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '0.85rem' }}><Heart size={18} fill={isInWishlist(product._id || product.id) ? "#ff4757" : "transparent"} color={isInWishlist(product._id || product.id) ? "#ff4757" : "#111"} strokeWidth={2} /> {isInWishlist(product._id || product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}</button>
              </div>

              {/* Accordions / Details */}
              <div className="border-top pt-4">
                 <div className="d-flex justify-content-between align-items-center cursor-pointer mb-3 fs-6 fw-medium text-dark uppercase ls-widest" style={{ fontSize: '0.85rem' }}>
                   <span>Details & Care</span>
                   <i className="bi bi-plus fs-5" />
                 </div>
                 <div className="d-flex justify-content-between align-items-center cursor-pointer mb-3 fs-6 fw-medium text-dark uppercase ls-widest" style={{ fontSize: '0.85rem' }}>
                   <span>Shipping & Returns</span>
                   <i className="bi bi-plus fs-5" />
                 </div>
              </div>

            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

