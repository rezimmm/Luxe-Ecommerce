import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

function RedirectHandler() {
  useEffect(() => {
    const path = sessionStorage.getItem("redirect");
    if (path) {
      sessionStorage.removeItem("redirect");
      window.history.replaceState(null, "", path);
    }
  }, []);
  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/Luxe-Ecommerce">
      <RedirectHandler />
      <App />
    </BrowserRouter>
  </StrictMode>,
)