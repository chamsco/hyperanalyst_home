import { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import logoImage from '../assets/logo.svg';

const Header = memo(({ isDark, toggleTheme }) => {
  const menuOverlayRef = useRef(null);
  const menuTl = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      menuTl.current = gsap.timeline({ paused: true });
      menuTl.current.to(menuOverlayRef.current, {
          y: "0%",
          duration: 0.8,
          ease: "power3.inOut"
      })
      .fromTo('.menu-link', {
          y: 50,
          opacity: 0
      }, {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "power3.out"
      }, "-=0.3");
    });
    return () => ctx.revert();
  }, []);

  const openMenu = () => menuTl.current?.play();
  const closeMenu = () => menuTl.current?.reverse();

  return (
    <>
      <nav className="fixed top-0 left-0 w-full p-4 md:p-6 z-50 bg-stone/80 dark:bg-ink/80 backdrop-blur-sm border-b border-ink/40 dark:border-stone/40">
          <div className="container mx-auto max-w-7xl flex justify-between items-center">
              <Link to="/" className="hover-target font-mono text-lg font-bold flex items-center gap-3">
                  <img 
                    src={logoImage} 
                    alt="HyperAnalyst Logo" 
                    className="h-10 w-10 md:h-12 md:w-12 object-contain invert dark:invert-0"
                  />
                  <span className="hidden sm:block font-serif text-xl md:text-2xl font-bold text-ink dark:text-stone">
                    HyperAnalyst
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-orange/10 border border-orange/20 rounded text-[10px] text-orange">
                    <div className="w-1.5 h-1.5 bg-orange rounded-full animate-pulse"></div>
                    LIVE
                  </div>
              </Link>
              
              <div className="hidden md:flex items-center gap-8 text-sm font-mono">
                  <Link to="/" className="hover-target hover:text-orange transition-colors">Terminal</Link>
                  <Link to="/platform" className="hover-target hover:text-orange transition-colors">Intelligence</Link>
              </div>
              
              <div className="flex items-center gap-6">
                  <button onClick={toggleTheme} className="hover-target hover:text-orange transition-colors">
                       <i className={`ph-thin ph-moon text-xl ${isDark ? 'hidden' : ''}`}></i>
                       <i className={`ph-thin ph-sun text-xl ${isDark ? '' : 'hidden'}`}></i>
                  </button>
                  <button onClick={openMenu} className="text-sm hover-target hover:text-orange transition-colors font-mono">Menu</button>
              </div>
          </div>
      </nav>

      {/* Full Screen Menu */}
      <div id="menu-overlay" ref={menuOverlayRef} className="fixed inset-0 bg-stone dark:bg-ink z-40 flex flex-col items-center justify-center transform translate-y-full">
          <button onClick={closeMenu} className="fixed top-6 right-6 md:top-8 md:right-8 text-sm hover-target hover:text-orange transition-colors font-mono">Close</button>
          <ul className="flex flex-col items-center gap-8 md:gap-12">
              <li><Link to="/" onClick={closeMenu} className="menu-link font-serif text-5xl md:text-8xl font-bold uppercase hover-target hover:text-orange transition-colors">Terminal</Link></li>
              <li><Link to="/platform" onClick={closeMenu} className="menu-link font-serif text-5xl md:text-8xl font-bold uppercase hover-target hover:text-orange transition-colors">Intelligence</Link></li>
          </ul>
      </div>
    </>
  );
});

Header.displayName = 'Header';

export default Header;



