import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { Heart } from 'lucide-react';

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavourite = isInWishlist(product._id || product.id);

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="col-6 col-lg-4 mb-5"
    >
      <div className="card border-0 h-100 bg-transparent group">
        <div className="position-relative overflow-hidden mb-3" style={{ aspectRatio: '3/4', backgroundColor: '#f0f0f0' }}>
          <Link to={`/product/${product._id || product.id}`} className="d-block w-100 h-100">
            <img
              src={product.images?.[0]?.url || product.image}
              alt={product.name}
              className="w-100 h-100 object-fit-cover transition-luxury mix-blend-multiply"
              style={{ objectPosition: 'center' }}
            />
          </Link>
          {product.badge && (
            <span className="position-absolute top-0 start-0 m-3 px-2 py-1 bg-primary text-white uppercase fw-bold" style={{ fontSize: '0.65rem' }}>
              {product.badge}
            </span>
          )}
          
          <button 
            className="btn wishlist-btn position-absolute top-0 end-0 m-2 p-2 rounded-circle"
            onClick={() => toggleWishlist(product)}
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s ease'
            }}
          >
            <Heart 
              size={18} 
              fill={isFavourite ? "#ff4757" : "transparent"} 
              color={isFavourite ? "#ff4757" : "#111"} 
              strokeWidth={2}
            />
          </button>
        </div>
        <div className="d-flex flex-column align-items-start">
          <Link to={`/product/${product._id || product.id}`} className="text-dark text-decoration-none">
            <h3 className="h6 mb-1 fw-bold">{product.name}</h3>
          </Link>
          <div className="d-flex align-items-center gap-2 mb-1">
             <span className="fw-bold text-primary">${product.price.toFixed(2)}</span>
             {product.originalPrice && <span className="text-muted text-decoration-line-through small" style={{fontSize: '0.8rem'}}>${product.originalPrice.toFixed(2)}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
