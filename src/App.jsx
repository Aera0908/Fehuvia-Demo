import React, { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Product from './components/Product';
import Features from './components/Features';
import Roadmap from './components/Roadmap';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DashboardLayout from './components/dashboard/DashboardLayout';
import ContentReader from './components/ContentReader';
import ArchitectureView from './components/ArchitectureView';
import DemoDisclaimer from './components/DemoDisclaimer';

function App() {
  // Navigation View Coordinator: 'landing', 'dashboard', 'reader', or 'architecture'
  const [view, setView] = useState('landing');
  const [activeDoc, setActiveDoc] = useState('core-concept');
  
  const [modalType, setModalType] = useState('none');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Scroll event tracking for Navbar glassmorphism
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);

  // Viewport intersection states for scrolling animations
  const heroRef = useRef(null);
  const visionRef = useRef(null);
  const productRef = useRef(null);
  const featuresRef = useRef(null);
  const footerRef = useRef(null);

  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isVisionVisible, setIsVisionVisible] = useState(false);
  const [isProductVisible, setIsProductVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    // Only run scroll listener and observers if we are in landing view
    if (view !== 'landing') {
      setIsNavbarScrolled(false);
      setIsHeroVisible(false);
      setIsVisionVisible(false);
      setIsProductVisible(false);
      setIsFeaturesVisible(false);
      setIsFooterVisible(false);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsNavbarScrolled(true);
      } else {
        setIsNavbarScrolled(false);
      }
    };

    const observeSection = (targetRef, setVisible, threshold = 0.15, rootMargin = '0px 0px -10% 0px') => {
      const node = targetRef.current;

      if (!node) {
        return null;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(node);
      return observer;
    };

    const observers = [
      observeSection(heroRef, setIsHeroVisible, 0.2, '0px 0px -15% 0px'),
      observeSection(visionRef, setIsVisionVisible),
      observeSection(productRef, setIsProductVisible),
      observeSection(featuresRef, setIsFeaturesVisible),
      observeSection(footerRef, setIsFooterVisible, 0.1, '0px 0px -5% 0px'),
    ].filter(Boolean);

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      observers.forEach((observer) => observer.disconnect());
      window.removeEventListener('scroll', handleScroll);
    };
  }, [view]);

  // If in dashboard view, render the figma financial dashboard layout
  if (view === 'dashboard') {
    return <DashboardLayout setView={setView} />;
  }

  // If in content reader view, render the full-screen interactive document sheet
  if (view === 'reader') {
    return (
      <ContentReader
        activePage={activeDoc}
        onClose={() => setView('landing')}
        setView={setView}
      />
    );
  }

  // If in architecture view, render the interactive structural topology diagram
  if (view === 'architecture') {
    return (
      <ArchitectureView
        onClose={() => setView('landing')}
        setView={setView}
      />
    );
  }

  // Otherwise render the stark, premium matte-black and gold landing page
  return (
    <div className="min-h-screen text-white font-sans bg-black flex flex-col relative overflow-x-hidden snap-y snap-mandatory select-none">
      
      {/* 1. Navigation Header */}
      <Navbar
        isScrolled={isNavbarScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setModalType={setModalType}
        setView={setView}
      />

      {/* 2. Hero Presentation Section */}
      <Hero
        heroRef={heroRef}
        isVisible={isHeroVisible}
        setModalType={setModalType}
        setView={setView}
      />

      {/* 3. About & Vision Section */}
      <About
        visionRef={visionRef}
        isVisionVisible={isVisionVisible}
      />

      {/* 4. Product Dashboard Preview Section */}
      <Product
        productRef={productRef}
        isVisible={isProductVisible}
      />

      {/* 5. Quantitative Technical Features Section */}
      <Features
        featuresRef={featuresRef}
        isVisible={isFeaturesVisible}
        setModalType={setModalType}
      />

      {/* 6. Roadmap Timeline Section */}
      <Roadmap />

      {/* 6.2. Institutional FAQ Section */}
      <Faq />

      {/* 6.5. Secure Operations Contact Section */}
      <Contact />

      {/* 7. Site Map Footer */}
      <Footer
        footerRef={footerRef}
        isVisible={isFooterVisible}
        onPageSelect={(pageKey) => {
          if (pageKey === 'architecture') {
            setView('architecture');
          } else {
            setActiveDoc(pageKey);
            setView('reader');
          }
        }}
      />

      {/* 8. Frosted Glass Authentication Modal Overlay */}
      <AuthModal
        modalType={modalType}
        setModalType={setModalType}
        setView={setView}
      />

      <DemoDisclaimer />

    </div>
  );
}

export default App;
