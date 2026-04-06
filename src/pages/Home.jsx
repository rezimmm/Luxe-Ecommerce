import { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import * as shopService from '../services/shop.service';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All Clothing"]);
  const [activeCategory, setActiveCategory] = useState("All Clothing");
  const [activeSizes, setActiveSizes] = useState([]);
  const [activeColors, setActiveColors] = useState([]);
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodData, catData] = await Promise.all([
          shopService.getProducts(),
          shopService.getCategories()
        ]);
        setProducts(prodData.products || []);
        setTotalCount(prodData.total || 0);
        if (catData) setCategories(["All Clothing", ...catData]);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (activeCategory !== 'All Clothing') params.category = activeCategory;
    if (activeSizes.length) params.sizes = activeSizes.join(',');
    if (activeColors.length) params.colors = activeColors.join(',');

    // ← ADD THIS
    const search = searchParams.get('search');
    if (search) params.search = search;

    shopService.getProducts(params)
      .then(data => {
        setProducts(data.products || []);
        setTotalCount(data.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, activeSizes, activeColors, page, searchParams]);

  // Filter products client-side for immediate feedback
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = activeCategory === "All Clothing" || p.category === activeCategory;
      const matchSize = activeSizes.length === 0 || activeSizes.some(size => p.sizes?.includes(size));
      const matchColor = activeColors.length === 0 || activeColors.some(color => p.colors?.includes(color));
      return matchCategory && matchSize && matchColor;
    });
  }, [products, activeCategory, activeSizes, activeColors]);

  const scrollToCollection = () => {
    const section = document.getElementById('collection-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-vh-100 bg-white d-flex flex-column">
      <Navbar />

      <style>{`
        .hero-section {
          height: 90vh;
          background: url('/hero.png') center/cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-top: 70px; /* Offset for fixed navbar */
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(17, 24, 39, 0.4); /* Dark Luxe Charcoal overlay */
        }
        .luxe-blue-btn {
          background-color: #2563eb !important;
          color: white !important;
          border: none !important;
          letter-spacing: 0.15em;
          border-radius: 4px !important;
        }
        .luxe-blue-btn:hover {
          background-color: #1d4ed8 !important;
        }
        .serif-font {
          font-family: 'Playfair Display', serif;
        }
      `}</style>

      {/* ── High-Impact LUXE Hero ── */}
      <header className="hero-section text-white text-center w-100">
        <div className="hero-overlay" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container position-relative z-10"
        >
          <h1 className="display-2 fw-bold mb-3 ls-tighter lh-1 mx-auto" style={{ maxWidth: '800px', fontWeight: 800 }}>
            ESSENTIALS<br />OF FORM
          </h1>
          <p className="fs-5 mb-5 opacity-100 mx-auto fw-medium" style={{ maxWidth: '600px', letterSpacing: '0.01em' }}>
            Discover the new standard of modern tailoring. Meticulously crafted pieces for the contemporary wardrobe.
          </p>
          <button
            onClick={scrollToCollection}
            className="btn luxe-blue-btn px-5 py-3 uppercase fw-bold transition-luxury fs-6 shadow-sm"
          >
            Discover the Collection
          </button>
        </motion.div>

        <div className="position-absolute bottom-0 w-100 text-center pb-4 text-white opacity-75">
          <i className="bi bi-chevron-down fs-4 cursor-pointer hover-opacity" onClick={scrollToCollection} />
        </div>
      </header>

      <main id="collection-section" className="flex-grow-1 container pb-5 position-relative pt-5 mt-4" style={{ zIndex: 1 }}>

        {/* Breadcrumbs & Header Section */}
        <div className="pb-5 mb-4 border-bottom">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small uppercase ls-widest mb-1" style={{ fontSize: '0.65rem' }}>
              <li className="breadcrumb-item text-muted">HOME</li>
              <li className="breadcrumb-item text-muted">CLOTHING</li>
              <li className="breadcrumb-item text-dark fw-bold" aria-current="page">NEW ARRIVALS</li>
            </ol>
          </nav>

          <h2 className="display-4 fw-bold mb-3 ls-tighter">New Arrivals</h2>

          <p className="fs-5 text-muted lh-base" style={{ maxWidth: '700px' }}>
            Experience the shift in season with our latest collection of elevated essentials.
            Designed for the modern wardrobe with a focus on sustainable materials and timeless silhouettes.
          </p>
        </div>

        {/* Filter Bar Mobile */}
        <div className="d-flex d-lg-none justify-content-between align-items-center py-3 mb-4 border-bottom">
          <button className="btn btn-outline-dark fw-medium small px-4 rounded-0 d-flex align-items-center gap-2">
            <i className="bi bi-sliders" /> Filter
          </button>
          <span className="small text-muted">{filteredProducts.length} Products</span>
        </div>

        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3">
            <Sidebar
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activeSizes={activeSizes}
              setActiveSizes={setActiveSizes}
              activeColors={activeColors}
              setActiveColors={setActiveColors}
            />
          </div>

          {searchParams.get('search') && (
            <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
              <span className="text-muted small">
                Results for: <strong className="text-dark">"{searchParams.get('search')}"</strong>
                &nbsp;({totalCount} items)
              </span>
              <button
                className="btn btn-sm btn-outline-secondary rounded-pill ms-2 py-0"
                onClick={() => navigate('/')}
                style={{ fontSize: '0.75rem' }}
              >
                Clear ✕
              </button>
            </div>
          )}

          {/* Product Grid */}
          <div className="col-lg-9">
            {/* Desktop Sorting Header */}
            <div className="d-none d-lg-flex justify-content-between align-items-center mb-4">
              <span className="small text-muted">{filteredProducts.length} Products</span>
              <div className="d-flex align-items-center gap-2">
                <span className="small fw-bold">Sort by:</span>
                <select className="form-select border-0 shadow-none fw-medium pe-4 cursor-pointer" style={{ width: 'auto', background: 'transparent' }}>
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            <motion.div layout className="row g-sm-4 g-2">
              {loading ? (
                <div className="col-12 py-5 text-center"><span className="spinner-border text-dark"></span></div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <ProductCard key={p._id || p.id} product={p} />
                ))
              ) : (
                <div className="col-12 py-5 text-center">
                  <h3 className="h5 fw-bold text-muted mb-3">No products found</h3>
                  <p className="text-muted">Try adjusting your filters to find what you're looking for.</p>
                  <button
                    className="btn btn-dark uppercase mt-3"
                    onClick={() => { setActiveCategory("All Clothing"); setActiveSizes([]); setActiveColors([]); }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </motion.div>

            {filteredProducts.length > 0 && (
              <div className="mt-5 pt-4 border-top d-flex flex-column align-items-center">
                <span className="small text-muted uppercase ls-widest mb-3" style={{ fontSize: '0.7rem' }}>
                  Showing {filteredProducts.length} of {products.length} Items
                </span>
                <div className="progress w-100 rounded-0 bg-light mb-4" style={{ height: 2, maxWidth: 300 }}>
                  <div className="progress-bar bg-primary" style={{ width: `${(filteredProducts.length / products.length) * 100}%` }}></div>
                </div>
                <button className="btn btn-outline-dark uppercase rounded-0 px-5 py-3 fw-bold transition-luxury hover-bg-dark hover-text-white" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

