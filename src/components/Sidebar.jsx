import { Check } from 'lucide-react';

export default function Sidebar({ categories, activeCategory, setActiveCategory, activeSizes, setActiveSizes, activeColors, setActiveColors }) {
  
  const toggleSize = (size) => {
    setActiveSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const toggleColor = (color) => {
    setActiveColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  return (
    <div className="d-none d-lg-block pe-4" style={{ width: '240px' }}>
      
      {/* Category Filter */}
      <div className="mb-5">
        <h6 className="uppercase ls-widest small fw-bold mb-3" style={{ fontSize: '0.7rem' }}>Category</h6>
        <div className="d-flex flex-column gap-2">
          {categories.map((cat, idx) => (
            <div key={idx} className="form-check d-flex align-items-center mb-1">
              <input 
                className="form-check-input mt-0 rounded-0 me-2" 
                type="checkbox" 
                id={`cat-${idx}`} 
                checked={activeCategory === cat}
                onChange={() => setActiveCategory(activeCategory === cat ? 'All Clothing' : cat)} 
                style={{ width: 16, height: 16, cursor: 'pointer', appearance: 'none', border: '1px solid #ccc' }}
              />
              <label 
                className={`form-check-label w-100 ${activeCategory === cat ? 'fw-bold text-dark' : 'text-muted'} small lh-1`} 
                htmlFor={`cat-${idx}`} 
                style={{ cursor: 'pointer', fontSize: '0.85rem' }}
              >
                {cat}
              </label>
              {/* Custom checkbox checkmark implementation via CSS for checked state would go in index.css */}
            </div>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-5">
        <h6 className="uppercase ls-widest small fw-bold mb-3" style={{ fontSize: '0.7rem' }}>Size</h6>
        <div className="d-flex flex-wrap gap-2">
           {['2XS', 'XS', 'S', 'M', 'L', 'XL'].map((s, idx) => (
             <button 
                key={idx}
                onClick={() => toggleSize(s)}
                className={`btn btn-sm border rounded-0 ${activeSizes.includes(s) ? 'border-primary text-primary fw-medium' : 'border-light text-muted bg-light'}`}
                style={{ width: 44, height: 44, fontSize: '0.75rem' }}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h6 className="uppercase ls-widest small fw-bold mb-3" style={{ fontSize: '0.7rem' }}>Color</h6>
        <div className="d-flex flex-wrap gap-2">
           {['#000000', '#F5DEB3', '#FFFFFF', '#4B5320', '#D2B48C'].map((c, idx) => (
             <button 
                key={idx}
                onClick={() => toggleColor(c)}
                className="btn btn-link p-0 rounded-circle border d-flex align-items-center justify-content-center position-relative"
                style={{ 
                  width: 32, height: 32, backgroundColor: c, 
                  borderColor: c === '#FFFFFF' ? '#e2e8f0' : 'transparent',
                  boxShadow: activeColors.includes(c) ? `0 0 0 2px white, 0 0 0 4px ${c === '#FFFFFF' ? '#e2e8f0' : c}` : 'none',
                  transition: 'box-shadow 0.2s'
                }}
             >
             </button>
           ))}
        </div>
      </div>
      
    </div>
  );
}
