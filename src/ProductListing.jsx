import { useState, useEffect } from "react";

/* ─────────────────────── DATA ─────────────────────── */
const products = [
  {
    id: 1,
    name: "Wool Blend Overcoat",
    price: 895.00,
    originalPrice: 1200.00,
    category: "Menswear",
    rating: 4.8,
    reviews: 42,
    badge: "Limited Edition",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Cashmere Turtleneck",
    price: 450.00,
    originalPrice: null,
    category: "Essentials",
    rating: 5.0,
    reviews: 18,
    badge: "New Arrival",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Architectural Silk Dress",
    price: 1250.00,
    originalPrice: 1500.00,
    category: "Womenswear",
    rating: 4.9,
    reviews: 12,
    badge: "Exclusive",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Sculptural Leather Boots",
    price: 680.00,
    originalPrice: null,
    category: "Accessories",
    rating: 4.7,
    reviews: 24,
    badge: null,
    image: "https://images.unsplash.com/photo-1512374382149-433a72b75d9b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Sartorial Linen Shirt",
    price: 320.00,
    originalPrice: null,
    category: "Menswear",
    rating: 4.6,
    reviews: 31,
    badge: null,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Structured Blazer",
    price: 750.00,
    originalPrice: 950.00,
    category: "Menswear",
    rating: 4.9,
    reviews: 15,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Pleated Midi Skirt",
    price: 380.00,
    originalPrice: null,
    category: "Womenswear",
    rating: 4.8,
    reviews: 22,
    badge: null,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Minimalist Leather Tote",
    price: 520.00,
    originalPrice: null,
    category: "Accessories",
    rating: 4.9,
    reviews: 45,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
  },
];

const categories = ["All", ...new Set(products.map((p) => p.category))];

/* ─────────────────────── COMPONENTS ─────────────────────── */

function StarRating({ rating }) {
  return (
    <span className="text-secondary d-flex gap-1" style={{ fontSize: '0.75rem' }}>
      {[...Array(5)].map((_, i) => (
        <i key={i} className={`bi ${i < Math.floor(rating) ? "bi-star-fill text-dark" : "bi-star"}`} />
      ))}
    </span>
  );
}

function ProductCard({ product, onAddToCart, wishlist, toggleWishlist, cartQty }) {
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="col-sm-6 col-lg-3 mb-5 px-sm-3">
      <div className="card border-0 h-100 bg-transparent group">
        <div className="position-relative overflow-hidden mb-3 aspect-ratio-3/4" style={{ backgroundColor: '#f0f0f0' }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-100 h-100 object-fit-cover transition-luxury product-image-hover"
            style={{ minHeight: '400px' }}
          />
          {product.badge && (
            <span className="position-absolute top-0 start-0 m-3 px-2 py-1 bg-white text-dark uppercase fw-medium" style={{ fontSize: '0.65rem' }}>
              {product.badge}
            </span>
          )}
          <button
            className="btn btn-outline-dark position-absolute bottom-0 w-100 p-3 opacity-0 group-hover-opacity-100 translate-y-10 group-hover-translate-y-0 transition-luxury bg-white border-0 uppercase fw-bold"
            style={{ fontSize: '0.75rem', borderRadius: 0 }}
            onClick={() => onAddToCart(product)}
          >
            Add to Bag
          </button>
          <button
            className="btn position-absolute top-0 end-0 m-2 border-0 bg-transparent"
            onClick={() => toggleWishlist(product.id)}
          >
            <i className={`bi ${isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}`} />
          </button>
        </div>
        <div className="d-flex flex-column align-items-center text-center">
          <p className="small text-muted uppercase mb-1" style={{ fontSize: '0.6rem' }}>{product.category}</p>
          <h3 className="h6 mb-1 serif" style={{ fontSize: '1.05rem', letterSpacing: '-0.02em' }}>{product.name}</h3>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="fw-bold fs-6">${product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="text-muted text-decoration-line-through small">${product.originalPrice.toFixed(2)}</span>}
          </div>
          <StarRating rating={product.rating} />
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cartItems, onClose, onIncrement, onDecrement, onRemove }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal;

  return (
    <>
      <div className="position-fixed inset-0 bg-black bg-opacity-50 z-1040 transition-opacity" onClick={onClose} style={{ zIndex: 1050 }} />
      <div className="position-fixed top-0 end-0 h-100 bg-white d-flex flex-column shadow-lg no-scrollbar" style={{ width: 'min(450px, 100vw)', zIndex: 1060 }}>
        <div className="px-4 py-4 d-flex justify-content-between align-items-center border-bottom">
          <h2 className="serif h4 mb-0">Your Bag</h2>
          <button className="btn p-0 border-0 fs-4" onClick={onClose}><i className="bi bi-x" /></button>
        </div>

        <div className="flex-grow-1 overflow-auto px-4 py-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted italic serif">Your bag is currently empty.</p>
              <button className="btn btn-dark uppercase rounded-0 px-4 py-2 mt-2" onClick={onClose} style={{ fontSize: '0.75rem' }}>Continue Browsing</button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="d-flex gap-3 py-4 border-bottom">
                <img src={item.image} alt={item.name} width={90} height={120} className="object-fit-cover" />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between mb-1">
                    <h4 className="serif h6 mb-0">{item.name}</h4>
                    <span className="fw-bold">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                  <p className="small text-muted mb-3">{item.category}</p>
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center border px-2 py-1 gap-2">
                      <button className="btn btn-sm p-0 border-0" onClick={() => onDecrement(item.id)}><i className="bi bi-dash" /></button>
                      <span className="small fw-medium" style={{ minWidth: '1.2rem', textAlign: 'center' }}>{item.qty}</span>
                      <button className="btn btn-sm p-0 border-0" onClick={() => onIncrement(item.id)}><i className="bi bi-plus" /></button>
                    </div>
                    <button className="btn btn-link text-decoration-none text-dark small p-0 fw-medium" onClick={() => onRemove(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 bg-light border-top">
            <div className="d-flex justify-content-between mb-3">
              <span className="uppercase text-muted" style={{ fontSize: '0.7rem' }}>Subtotal</span>
              <span className="fw-bold fs-5">${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary w-100 rounded-0 p-3 bg-luxe-blue border-0 uppercase fw-bold" style={{ backgroundColor: 'var(--luxe-blue)', fontSize: '0.8rem' }}>Check Out</button>
            <p className="text-center mt-3 mb-0 small text-muted italic serif">Shipping and taxes calculated at checkout.</p>
          </div>
        )}
      </div>
    </>
  );
}

/* ─────────────────────── MAIN PAGE ─────────────────────── */
export default function ProductListing() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const incrementQty = (id) => setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  const decrementQty = (id) => setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i).filter((i) => i.qty > 0));
  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const toggleWishlist = (id) => setWishlist((prev) => prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]);

  const filtered = products.filter((p) => activeCategory === "All" || p.category === activeCategory);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="min-vh-100 bg-white">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      <style>{`
        .group:hover .group-hover-opacity-100 { opacity: 1 !important; }
        .group:hover .group-hover-translate-y-0 { transform: translateY(0) !important; }
        .translate-y-10 { transform: translateY(10px); }
        .bg-luxe-blue { background-color: var(--luxe-blue) !important; }
        .nav-link-luxe { color: var(--luxe-charcoal); text-decoration: none; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; transition: opacity 0.2s; }
        .nav-link-luxe:hover { opacity: 0.6; }
        .product-image-hover:hover { transform: scale(1.05); }
        .hero-section { height: 100vh; background: url('/hero.png') center/cover no-repeat; display: flex; align-items: center; justify-content: center; position: relative; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)); }
        .navbar-luxe { transition: all 0.4s ease; padding: 1.5rem 0; }
        .navbar-luxe.scrolled { background: white; padding: 1rem 0; border-bottom: 1px solid var(--luxe-border); }
        @media (max-width: 991px) { .navbar-luxe { background: white !important; } }
      `}</style>

      {/* ── Navigation ── */}
      <nav className={`navbar-luxe fixed-top w-100 z-50 ${scrolled ? 'scrolled shadow-sm' : ''}`}>
        <div className="container d-flex align-items-center">
          <div className="d-flex gap-4 flex-grow-1 d-none d-lg-flex">
            <a href="#" className="nav-link-luxe">Shop</a>
            <a href="#" className="nav-link-luxe">Collections</a>
          </div>

          <div className="mx-auto">
            <h1 className="h2 mb-0 serif uppercase" style={{ letterSpacing: '0.4em', marginRight: '-0.4em' }}>Luxe</h1>
          </div>

          <div className="d-flex gap-4 flex-grow-1 justify-content-end align-items-center">
            <a href="#" className="nav-link-luxe d-none d-lg-block">About</a>
            <button className="btn btn-link p-0 text-dark border-0"><i className="bi bi-search fs-5" /></button>
            <button className="btn btn-link p-0 text-dark border-0 position-relative" onClick={() => setCartOpen(true)}>
              <i className="bi bi-bag fs-5" />
              {totalItems > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-dark" style={{ fontSize: '0.6rem' }}>{totalItems}</span>}
            </button>
            <a href="#" className="btn btn-link p-0 text-dark border-0 d-none d-sm-block"><i className="bi bi-person fs-4" /></a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="hero-section">
        <div className="hero-overlay" />
        <div className="container position-relative z-10 text-center text-white">
          <h2 className="display-1 serif mb-3 animate-fade-in" style={{ letterSpacing: '-0.02em', fontWeight: 700 }}>Essentials of Form</h2>
          <p className="fs-5 mb-5 serif italic opacity-75 mx-auto" style={{ maxWidth: '600px' }}>Discover the new standard of modern tailoring. Meticulously crafted pieces for the contemporary wardrobe.</p>
          <button className="btn btn-primary bg-luxe-blue border-0 rounded-0 px-5 py-3 uppercase fw-bold transition-luxury" style={{ letterSpacing: '0.2em', fontSize: '0.8rem' }}>
            Discover the Collection
          </button>
        </div>
        <div className="position-absolute bottom-0 w-100 text-center pb-4 text-white opacity-50">
          <i className="bi bi-chevron-down fs-4" />
        </div>
      </header>

      {/* ── Product Section ── */}
      <section className="container py-5 mt-5">
        <div className="d-flex flex-column align-items-center mb-5">
          <h2 className="serif h1 mb-4">The Seasonal Edit</h2>
          <div className="d-flex gap-3 flex-wrap justify-content-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn uppercase rounded-0 px-4 py-2 transition-luxury ${activeCategory === cat ? 'btn-dark' : 'btn-outline-dark border-0 opacity-50 hover-opacity-100'}`}
                style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em' }}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-light py-5 mt-5 border-top">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h1 className="h4 serif uppercase mb-4" style={{ letterSpacing: '0.3em' }}>Luxe</h1>
              <p className="text-muted small mb-4 pr-lg-5">A brand built on the foundations of architectural precision and sartorial elegance. We believe in the essentials of form.</p>
              <div className="d-flex gap-3">
                <i className="bi bi-instagram fs-5" />
                <i className="bi bi-facebook fs-5" />
                <i className="bi bi-twitter fs-5" />
              </div>
            </div>
            <div className="col-lg-2 col-6">
              <h5 className="uppercase small fw-bold mb-4" style={{ letterSpacing: '0.1em' }}>Shop</h5>
              <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
                <li>All Collections</li>
                <li>Menswear</li>
                <li>Womenswear</li>
                <li>Accessories</li>
              </ul>
            </div>
            <div className="col-lg-2 col-6">
              <h5 className="uppercase small fw-bold mb-4" style={{ letterSpacing: '0.1em' }}>Help</h5>
              <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
                <li>Returns</li>
                <li>Shipping</li>
                <li>Sizing Guide</li>
                <li>Contact</li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h5 className="uppercase small fw-bold mb-4" style={{ letterSpacing: '0.1em' }}>Newsletter</h5>
              <p className="text-muted small mb-4">Join our list for exclusive releases and insights into our design process.</p>
              <div className="input-group">
                <input type="email" className="form-control border-0 border-bottom bg-transparent rounded-0 shadow-none px-0" placeholder="Email Address" />
                <button className="btn btn-link text-dark text-decoration-none uppercase fw-bold px-0 p-0" style={{ fontSize: '0.7rem' }}>Join</button>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-top d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
            <p className="mb-0">© 2026 LUXE. All Rights Reserved.</p>
            <div className="d-flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <CartDrawer
          cartItems={cart}
          onClose={() => setCartOpen(false)}
          onIncrement={incrementQty}
          onDecrement={decrementQty}
          onRemove={removeFromCart}
        />
      )}
    </div>
  );
}