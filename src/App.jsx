import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import Header from './components/Header';
import Home from './pages/Home';
import Platform from './pages/Platform';

// Scroll To Top Component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [isDark, setIsDark] = useState(false);
  
  // Refs for animations
  const cursorRef = useRef(null);
  const loaderRef = useRef(null);
  const loaderLogoRef = useRef(null);
  
  // Theme Initialization
  useEffect(() => {
    const htmlEl = document.documentElement;
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      htmlEl.classList.add('dark');
      setIsDark(true);
    } else {
      htmlEl.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Theme Toggle Handler
  const toggleTheme = () => {
    const htmlEl = document.documentElement;
    if (htmlEl.classList.contains('dark')) {
      htmlEl.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      htmlEl.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  // Loader Animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(loaderLogoRef.current, { opacity: 1 });
      const loaderTl = gsap.timeline({ delay: 0.5 });
      loaderTl.to(loaderLogoRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          ease: "power2.in"
      })
      .to(loaderRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power3.inOut"
      }, "-=0.2");
    });
    return () => ctx.revert();
  }, []);

  // Custom Cursor Logic
  useEffect(() => {
    const cursor = cursorRef.current;
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const speed = 0.2;
    
    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const animateCursor = () => {
      mouseX += (targetX - mouseX) * speed;
      mouseY += (targetY - mouseY) * speed;
      if (cursor) {
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      requestAnimationFrame(animateCursor);
    };
    const rafId = requestAnimationFrame(animateCursor);

    const handleMouseEnter = () => cursor?.classList.add('cursor-expanded');
    const handleMouseLeave = () => cursor?.classList.remove('cursor-expanded');
    
    const handleHover = (e) => {
        if (e.target.closest('a, button, .hover-target, input, textarea')) {
            handleMouseEnter();
        } else {
            handleMouseLeave();
        }
    };
    document.addEventListener('mouseover', handleHover);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleHover);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="bg-stone text-ink dark:bg-ink dark:text-stone overflow-x-hidden antialiased min-h-screen font-mono transition-colors duration-300">
          {/* ========== CURSOR ========== */}
          <div id="custom-cursor" ref={cursorRef}></div>

          {/* ========== LOADER ========== */}
          <div id="loader" ref={loaderRef} className="fixed inset-0 bg-stone dark:bg-ink z-[100] flex items-center justify-center">
              <h1 id="loader-logo" ref={loaderLogoRef} className="font-serif text-6xl md:text-8xl font-bold text-ink dark:text-stone">HA</h1>
          </div>

          <Header isDark={isDark} toggleTheme={toggleTheme} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/platform" element={<Platform />} />
          </Routes>

          {/* ========== FOOTER ========== */}
          <footer className="py-16 px-4 bg-stone dark:bg-ink text-ink/70 dark:text-stone/70 text-sm border-t border-ink/40 dark:border-stone/40">
              <div className="container mx-auto max-w-7xl text-center">
                  <div className="flex justify-center gap-6 mb-8">
                      <a href="#" className="hover-target hover:text-orange transition-colors">Privacy</a>
                      <a href="#" className="hover-target hover:text-orange transition-colors">Terms</a>
                      <a href="#" className="hover-target hover:text-orange transition-colors">GitHub</a>
                      <a href="#" className="hover-target hover:text-orange transition-colors">Contact</a>
                  </div>
                  
                  <div className="w-full max-w-md mx-auto border-t border-dashed border-ink-faint dark:border-stone-faint my-8"></div>
                  
                  <p>© <span id="footer-year">{new Date().getFullYear()}</span> HyperAnalyst. All rights reserved.</p>
                  <p className="mt-2">Simulation data. Not financial advice.</p>
              </div>
          </footer>
      </div>
    </Router>
  );
}

export default App;
