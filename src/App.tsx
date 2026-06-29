/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import heroImg from './assets/images/wine_spot_hero_1782757827367.jpg';
import bottlePlaceholderImg from './assets/images/luxury_wine_bottle_1782757842715.jpg';
import tastingImg from './assets/images/wine_tasting_experience_1782757858895.jpg';
// If you added your logo here, import it too:
import logoImg from './assets/images/wine pot logo.jpg';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronRight, 
  Plus, 
  Minus, 
  Trash2, 
  Wine as WineIcon, 
  Sparkles, 
  MapPin, 
  Mail, 
  Calendar, 
  Users, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  Search, 
  SlidersHorizontal, 
  MessageSquare,
  ArrowRight,
  Bookmark,
  Building2,
  Clock,
  Compass,
  FileText,
  GlassWater,
  Layers,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Wine, TastingExperience, CartItem, B2BInquiry } from './types';
import { WINES, TASTINGS, B2B_BENEFITS, IMAGES } from './data';
import InteractiveTastingGlass from './components/InteractiveTastingGlass';
import Logo from './components/Logo';

export default function App() {
  // Application States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Red' | 'White' | 'Blend'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'brand'>('default');
  
  // Interactive Modals / Forms States
  const [bookingExperience, setBookingExperience] = useState<TastingExperience | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('11:00');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  
  const [b2bInquiry, setB2bInquiry] = useState<B2BInquiry>({
    company: '',
    contact: '',
    email: '',
    phone: '',
    interest: 'Bespoke Tour Operators',
    message: ''
  });
  const [b2bSuccess, setB2bSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Auto-dismiss Toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Track scroll position for subtle parallax scroll translations
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show a beautifully animated toast
  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Add Wine to Cart
  const handleAddWineToCart = (wine: Wine) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === wine.id && item.type === 'wine');
      if (existing) {
        showToast(`Increased quantity of ${wine.name} in cart.`);
        return prevCart.map(item => 
          item.id === wine.id && item.type === 'wine' 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      showToast(`Added ${wine.name} to cart.`);
      return [...prevCart, {
        id: wine.id,
        name: wine.name,
        price: wine.price,
        brand: wine.brand,
        quantity: 1,
        type: 'wine'
      }];
    });
  };

  // Booking Experience Submit Handler
  const handleBookExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingExperience) return;

    if (!bookingDate) {
      showToast("Please choose a preferred date for your tasting", "info");
      return;
    }

    const bookingId = `${bookingExperience.id}-${bookingDate}-${bookingTime}`;
    
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === bookingId && item.type === 'experience');
      if (existing) {
        showToast(`Updated reservation details for ${bookingExperience.name}.`);
        return prevCart.map(item => 
          item.id === bookingId && item.type === 'experience'
            ? { ...item, quantity: item.quantity + bookingGuests, guests: item.guests ? item.guests + bookingGuests : bookingGuests }
            : item
        );
      }
      showToast(`Reserved ${bookingExperience.name} for ${bookingGuests} guests.`);
      return [...prevCart, {
        id: bookingId,
        name: `${bookingExperience.name} (Tasting Experience)`,
        price: bookingExperience.price,
        quantity: bookingGuests,
        type: 'experience',
        date: bookingDate,
        time: bookingTime,
        guests: bookingGuests
      }];
    });

    setBookingExperience(null); // Close modal
    setCartOpen(true); // Open cart to show reservation
  };

  // Quantity Modifier
  const updateQuantity = (itemId: string, type: 'wine' | 'experience', delta: number) => {
    setCart((prevCart) => {
      return prevCart.map(item => {
        if (item.id === itemId && item.type === type) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { 
            ...item, 
            quantity: newQty,
            // If experience, match guests to quantity
            guests: item.type === 'experience' ? newQty : undefined
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  // Remove Item from Cart
  const removeItem = (itemId: string, type: 'wine' | 'experience') => {
    setCart((prevCart) => {
      const item = prevCart.find(i => i.id === itemId && i.type === type);
      if (item) {
        showToast(`Removed ${item.name} from cart.`, "info");
      }
      return prevCart.filter(i => !(i.id === itemId && i.type === type));
    });
  };

  // Calculate Cart Totals
  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Generate WhatsApp Manifest and Redirect
  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is currently empty", "info");
      return;
    }

    let manifest = `Hi The Wine Spot SA! I would like to place an order for the following items:\n\n`;
    
    const winesInCart = cart.filter(item => item.type === 'wine');
    const experiencesInCart = cart.filter(item => item.type === 'experience');

    if (winesInCart.length > 0) {
      manifest += `🍷 *PREMIUM WINES:*\n`;
      winesInCart.forEach(item => {
        manifest += `• ${item.quantity} x ${item.name} (${item.brand}) — R${item.price * item.quantity}\n`;
      });
      manifest += `\n`;
    }

    if (experiencesInCart.length > 0) {
      manifest += `🎟️ *TASTING RESERVATIONS:*\n`;
      experiencesInCart.forEach(item => {
        manifest += `• ${item.name}\n  📅 Date: ${item.date} | ⏰ Time: ${item.time}\n  👥 Guests: ${item.guests} — R${item.price * item.quantity}\n`;
      });
      manifest += `\n`;
    }

    manifest += `*Grand Total Value:* R${cartSubtotal}\n\n`;
    manifest += `Please confirm stock availability and door-to-door courier delivery arrangements!`;

    const encodedManifest = encodeURIComponent(manifest);
    const whatsappUrl = `https://wa.me/27716747186?text=${encodedManifest}`;
    
    // Open in a new tab (respecting external link guidelines beautifully)
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Interactive 3D Perspective Tilt Handlers for Wine Card
  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 12; // subtle degree limit
    const rotateY = ((x - centerX) / centerX) * -12; // negative inverse for natural tilt
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Highlight reflection shine effect
    const glow = card.querySelector('.shine-glow') as HTMLElement;
    if (glow) {
      const percentageX = (x / rect.width) * 100;
      const percentageY = (y / rect.height) * 100;
      glow.style.background = `radial-gradient(circle at ${percentageX}% ${percentageY}%, rgba(255,255,255,0.2) 0%, transparent 60%)`;
    }
  };

  // Reset Card Tilt
  const handleMouseLeave3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    const glow = card.querySelector('.shine-glow') as HTMLElement;
    if (glow) {
      glow.style.background = 'transparent';
    }
  };

  // Filter & Sort Wines
  const filteredWines = WINES.filter(wine => {
    const matchesCategory = selectedCategory === 'All' || wine.category === selectedCategory;
    const matchesSearch = wine.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          wine.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wine.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedWines = [...filteredWines].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'brand') return a.brand.localeCompare(b.brand);
    return 0; // default order
  });

  // Handle B2B Inquiry Submit
  const handleB2bSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bInquiry.company || !b2bInquiry.contact || !b2bInquiry.email) {
      showToast("Please fill in all required fields", "info");
      return;
    }
    setB2bSuccess(true);
    showToast("Thank you! Your B2B inquiry has been received. Our concierge team will reach out via email shortly.", "success");
    setTimeout(() => {
      setB2bSuccess(false);
      setB2bInquiry({
        company: '',
        contact: '',
        email: '',
        phone: '',
        interest: 'Bespoke Tour Operators',
        message: ''
      });
    }, 5000);
  };

  // Smooth Scroll Helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1A1A1A] font-sans antialiased selection:bg-[#D4AF37] selection:text-white">
      
      {/* AGE WARNING TOP BANNER */}
      <div className="bg-[#1A1A1A] text-[#FDFBF7] py-1.5 px-4 text-center text-[11px] tracking-[0.15em] uppercase font-semibold border-b border-[#D4AF37]/20 z-50 relative flex items-center justify-center gap-2">
        <ShieldAlert className="w-3 h-3 text-[#D4AF37]" />
        <span>Strictly Not for Sale to Persons Under the Age of 18</span>
      </div>

      {/* FLOATING TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] bg-[#1A1A1A] text-[#FDFBF7] border border-[#D4AF37] px-6 py-3.5 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-3.5 backdrop-blur-md max-w-md w-[90%]"
          >
            <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <p className="text-xs tracking-wider uppercase font-medium flex-1">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-[#FDFBF7]/60 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-[#E5E5E5] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Emblem */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 group text-left">
            <div className="relative w-12 h-12 flex items-center justify-center border border-[#D4AF37] bg-[#1A1A1A] rounded-none group-hover:bg-black transition-colors duration-500 overflow-hidden">
              <div className="absolute inset-0.5 border border-[#D4AF37]/30" />
              <Logo variant="minimal" size="30" className="text-[#D4AF37] group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div>
              <span className="block font-serif text-lg tracking-[0.1em] font-medium uppercase text-[#1A1A1A]">
                The Wine Spot SA
              </span>
              <span className="block text-[8.5px] tracking-[0.25em] text-[#D4AF37] font-semibold uppercase">
                Curated Tasting Gallery
              </span>
            </div>
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('gallery')} className="text-xs font-semibold tracking-[0.2em] uppercase hover:text-[#D4AF37] transition-colors py-2 relative group">
              The Gallery
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full" />
            </button>
            <button onClick={() => scrollToSection('tastings')} className="text-xs font-semibold tracking-[0.2em] uppercase hover:text-[#D4AF37] transition-colors py-2 relative group">
              Tastings
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full" />
            </button>
            <button onClick={() => scrollToSection('shop')} className="text-xs font-semibold tracking-[0.2em] uppercase hover:text-[#D4AF37] transition-colors py-2 relative group">
              Digital Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full" />
            </button>
            <button onClick={() => scrollToSection('club')} className="text-xs font-semibold tracking-[0.2em] uppercase hover:text-[#D4AF37] transition-colors py-2 relative group">
              Wine Club
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full" />
            </button>
            <button onClick={() => scrollToSection('b2b')} className="text-xs font-semibold tracking-[0.2em] uppercase hover:text-[#D4AF37] transition-colors py-2 relative group">
              B2B Hub
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full" />
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-xs font-semibold tracking-[0.2em] uppercase hover:text-[#D4AF37] transition-colors py-2 relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full" />
            </button>
          </nav>

          {/* Cart Icon & Mobile Actions */}
          <div className="flex items-center gap-4">
            
            {/* Dynamic Sliding Side Cart Trigger */}
            <button 
              id="cart-trigger-btn"
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 border border-[#E5E5E5] hover:border-[#D4AF37] bg-[#FDFBF7] transition-all group flex items-center gap-2.5"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors" />
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#1A1A1A] hidden sm:inline">Cart</span>
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#D4AF37] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-md border border-white"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 border border-[#E5E5E5] bg-[#FDFBF7] hover:border-[#D4AF37] transition-all"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-[#E5E5E5] bg-white overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col">
                <button onClick={() => scrollToSection('gallery')} className="text-left text-xs font-semibold tracking-widest uppercase text-[#1A1A1A] py-2 border-b border-[#FDFBF7] hover:text-[#D4AF37] transition-colors">
                  The Gallery
                </button>
                <button onClick={() => scrollToSection('tastings')} className="text-left text-xs font-semibold tracking-widest uppercase text-[#1A1A1A] py-2 border-b border-[#FDFBF7] hover:text-[#D4AF37] transition-colors">
                  Tastings
                </button>
                <button onClick={() => scrollToSection('shop')} className="text-left text-xs font-semibold tracking-widest uppercase text-[#1A1A1A] py-2 border-b border-[#FDFBF7] hover:text-[#D4AF37] transition-colors">
                  Digital Shop
                </button>
                <button onClick={() => scrollToSection('club')} className="text-left text-xs font-semibold tracking-widest uppercase text-[#1A1A1A] py-2 border-b border-[#FDFBF7] hover:text-[#D4AF37] transition-colors">
                  Wine Club
                </button>
                <button onClick={() => scrollToSection('b2b')} className="text-left text-xs font-semibold tracking-widest uppercase text-[#1A1A1A] py-2 border-b border-[#FDFBF7] hover:text-[#D4AF37] transition-colors">
                  B2B Hub
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-left text-xs font-semibold tracking-widest uppercase text-[#1A1A1A] py-2 border-b border-[#FDFBF7] hover:text-[#D4AF37] transition-colors">
                  Contact
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION WITH DYNAMIC GRAPHICS */}
      <section id="gallery" className="relative bg-white pt-10 pb-20 md:py-28 overflow-hidden border-b border-[#E5E5E5]">
        {/* Subtle Luxury Pattern Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Hero Left: Text & Editorial Concept */}
            <div className="lg:col-span-7 space-y-6 md:pr-4">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDFBF7] border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] tracking-[0.2em] font-semibold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Exquisite South African Heritage</span>
              </div>
              
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1A1A1A] tracking-tight font-medium leading-[1.1]">
                Where Heritage <br />
                <span className="italic text-[#D4AF37]">Meets the Glass</span>
              </h1>
              
              <p className="text-sm md:text-base text-gray-700 leading-relaxed font-light">
                Located at the iconic <strong>Long March to Freedom</strong> heritage site in Cape Town, 
                <span className="text-[#1A1A1A] font-medium"> The Wine Spot SA</span> is an exclusive curated tasting center 
                showcasing the finest premium wines from pioneering, black-owned South African producers. 
                We blend world-class oenology with deep cultural storytelling, presenting a stellar flight of historical significance 
                and agricultural excellence in every bottle.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('shop')} 
                  className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-white px-8 py-4 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-3.5 shadow-md"
                >
                  <span>Acquire Masterpieces</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => scrollToSection('tastings')} 
                  className="bg-[#FDFBF7] hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-[#FDFBF7] border border-[#D4AF37] px-8 py-4 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-2.5"
                >
                  <span>Book Heritage Tasting</span>
                </button>
              </div>

              {/* Minimal Stats Bar */}
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-[#E5E5E5]">
                <div>
                  <span className="block font-serif text-2xl md:text-3xl font-medium text-[#D4AF37]">100%</span>
                  <span className="block text-[9px] uppercase tracking-wider text-gray-500 font-semibold mt-1">Black-Owned Producers</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl md:text-3xl font-medium text-[#D4AF37]">10+</span>
                  <span className="block text-[9px] uppercase tracking-wider text-gray-500 font-semibold mt-1">Boutique Brands</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl md:text-3xl font-medium text-[#D4AF37]">R195</span>
                  <span className="block text-[9px] uppercase tracking-wider text-gray-500 font-semibold mt-1">Curated Tasting Flights</span>
                </div>
              </div>

            </div>

            {/* Hero Right: High-End Visual Framed Card */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              
              {/* Back ambient card */}
              <div className="absolute -top-6 -left-6 w-full h-full bg-[#FDFBF7] border border-[#E5E5E5] z-0" />
              
              {/* Actual Image container with luxury framing */}
              <div className="relative editorial-double-border z-10 hover:scale-[1.01] transition-transform duration-500 shadow-sm">
                <div className="editorial-double-border-inner p-2 bg-white">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                    <img 
                      src={heroImg}
                      alt="The Wine Spot SA Luxury Tasting Gallery" 
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-[#FDFBF7]">
                      <span className="text-[10px] tracking-[0.25em] text-[#D4AF37] font-bold uppercase block mb-1">Interactive Showcase</span>
                      <h3 className="font-serif text-xl font-medium leading-snug">The Gallery at Long March to Freedom</h3>
                      <p className="text-[11px] font-light text-[#FDFBF7]/80 mt-1 flex items-center gap-1.5 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Century Boulevard, Cape Town
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delicate Gold Seal floating element with the authentic brand logo */}
              <div className="absolute -bottom-10 -right-10 z-20 w-32 h-32 hidden sm:block hover:rotate-12 transition-transform duration-700 cursor-pointer">
                <Logo variant="circle" size="100%" className="shadow-2xl drop-shadow-xl" />
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3D SENSORY CHAMBER SECTION */}
      <section className="py-16 md:py-24 bg-white border-b border-[#E5E5E5] relative">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.02]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDFBF7] border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] tracking-[0.2em] font-semibold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Virtual Sommelier</span>
              </div>
              
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight font-medium leading-[1.2]">
                Sensory Laboratory <br />
                <span className="italic text-[#D4AF37]">Virtual 3D Vessel</span>
              </h2>
              
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light">
                Calibrate your sensory expectation prior to your tasting gallery reservation. Interact directly with our digital 3D tasting vessel to simulate light refractivity, liquid slosh, and viscosity levels characteristic of our premier boutique reserves.
              </p>

              <div className="border-l-2 border-[#D4AF37] pl-4 py-1.5 space-y-2">
                <span className="block text-[8px] font-mono tracking-widest uppercase text-gray-400 font-bold">Recommended ritual</span>
                <p className="text-[11px] text-gray-500 italic font-light">
                  "Choose Pinotage, toggle the Backlight, click the glass to Swirl, then press Sip & Analyze to witness elegant flavor dissipation."
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <InteractiveTastingGlass />
            </div>
          </div>
        </div>
      </section>

      {/* CURATED EXPERIENCES (TASTING MENU GRID) */}
      <section id="tastings" className="py-20 bg-[#FDFBF7] border-b border-[#E5E5E5] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[10px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase block">
              Sensory Exploration
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#1A1A1A]">
              The Tasting Gallery Experiences
            </h2>
            <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto my-3" />
            <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
              All tasting flights are masterfully structured, flat-priced at <strong className="text-[#1A1A1A]">R195 per guest</strong>, 
              include a guided <strong className="text-[#1A1A1A]">30-minute heritage walkthrough</strong> of the Long March to Freedom site, 
              and feature 5 exquisite artisanal pours.
            </p>
          </div>

          {/* Tasting Flight Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TASTINGS.map((experience) => (
              <div 
                key={experience.id}
                className="bg-white border border-[#E5E5E5] hover:border-[#D4AF37]/80 transition-all duration-300 flex flex-col group justify-between hover:shadow-lg"
              >
                <div>
                  {/* Decorative Header Banner */}
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative border-b border-[#E5E5E5]">
                    <img 
                      src={tastingImg}
                      alt={experience.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 text-[9px] tracking-widest uppercase font-semibold text-[#1A1A1A] border border-[#E5E5E5] font-mono">
                      {experience.pours}
                    </div>
                    <div className="absolute top-4 right-4 bg-[#1A1A1A]/95 text-white px-3 py-1 text-[9px] tracking-widest uppercase font-semibold border border-[#D4AF37] font-mono">
                      {experience.duration}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="font-serif text-xl font-medium text-[#1A1A1A] group-hover:text-[#D4AF37] transition-colors">
                      {experience.name}
                    </h3>
                    <p className="text-[12px] text-gray-600 font-light leading-relaxed h-16 overflow-hidden line-clamp-3">
                      {experience.desc}
                    </p>
                    
                    {/* Tasting Highlights list */}
                    <div className="space-y-2 pt-3 border-t border-[#FDFBF7]">
                      <span className="text-[9px] tracking-widest uppercase text-gray-500 font-semibold block">Experience Highlights:</span>
                      <ul className="space-y-1.5">
                        {experience.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[11px] text-gray-700">
                            <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer and CTA */}
                <div className="p-6 pt-0 mt-auto">
                  <div className="flex items-center justify-between py-3 border-t border-[#E5E5E5]/50 mb-4">
                    <div>
                      <span className="block text-[8px] uppercase tracking-widest text-gray-400">FLAT VALUE PRICE</span>
                      <span className="font-serif text-lg font-semibold text-[#D4AF37]">R195 <span className="text-[11px] font-sans font-light text-gray-500">/ person</span></span>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest font-semibold bg-[#FDFBF7] px-2.5 py-1 text-[#D4AF37] border border-[#D4AF37]/20">
                      Tour Included
                    </span>
                  </div>

                  <button 
                    onClick={() => setBookingExperience(experience)}
                    className="w-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-white py-3 text-[10.5px] tracking-[0.2em] uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                  >
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span>Reserve Tasting Slot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* THE DIGITAL SHOP & DYNAMIC CART ENGINE */}
      <section id="shop" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase block">
                Exclusive Curation
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#1A1A1A]">
                Acquire Exceptional Pours
              </h2>
              <div className="w-16 h-[1px] bg-[#D4AF37]" />
            </div>

            {/* Live Search Bar */}
            <div className="w-full md:w-80 relative">
              <input 
                type="text" 
                placeholder="Search by estate, style, character..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full editorial-input pl-8"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filtering Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-[#E5E5E5]">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {(['All', 'Red', 'White', 'Blend'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 text-[10px] tracking-widest uppercase font-semibold transition-all duration-200 border ${
                    selectedCategory === cat 
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                      : 'bg-white text-gray-700 hover:border-gray-400 border-[#E5E5E5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="editorial-select text-[10.5px] uppercase py-1.5"
              >
                <option value="default">Premium Selection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="brand">Brand Estate</option>
              </select>
            </div>

          </div>

          {/* Product Grid */}
          {sortedWines.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-[#E5E5E5] bg-[#FDFBF7]">
              <WineIcon className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <p className="text-sm font-serif italic text-gray-500">No wines matched your current selection.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} 
                className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#D4AF37] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedWines.map((wine) => {
                const inCartCount = cart.find(item => item.id === wine.id && item.type === 'wine')?.quantity || 0;

                return (
                  <div 
                    key={wine.id}
                    className="group bg-white border border-[#E5E5E5] flex flex-col justify-between transition-all duration-300 overflow-hidden relative"
                  >
                    
                    {/* Custom 3D Tilt Wrapper Container */}
                    <div 
                      className="p-3 bg-[#FDFBF7] border-b border-[#E5E5E5] relative transition-transform duration-300 ease-out cursor-pointer overflow-hidden aspect-[3/4]"
                      onMouseMove={handleMouseMove3D}
                      onMouseLeave={handleMouseLeave3D}
                      onClick={() => setSelectedWine(wine)}
                    >
                      {/* Shine Glow Effect */}
                      <div className="shine-glow absolute inset-0 pointer-events-none z-10 transition-opacity duration-300" />
                      
                      {/* Interactive Gold Foil Accented Studio Bottle */}
                      <div className="w-full h-full relative flex items-center justify-center p-4">
                        <img 
                          ssrc={bottlePlaceholderImg}
                          alt={wine.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.12)] transform group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Elegant floating overlay details */}
                        <div className="absolute top-3 left-3 bg-white/95 text-[#1A1A1A] border border-[#E5E5E5] py-0.5 px-2 text-[8px] tracking-[0.2em] uppercase font-bold font-mono">
                          {wine.category}
                        </div>

                        {/* Gold-foil Accent Indicator */}
                        <div className="absolute bottom-3 right-3 bg-[#1A1A1A]/95 text-[#D4AF37] border border-[#D4AF37]/50 py-1 px-2 text-[7.5px] tracking-[0.15em] uppercase font-semibold font-mono">
                          ✦ Gold Foil Reserve
                        </div>
                      </div>
                    </div>

                    {/* Wine Metadata */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <span className="block text-[10px] tracking-[0.15em] font-bold text-[#D4AF37] uppercase">
                          {wine.brand}
                        </span>
                        <h3 className="font-serif text-base font-semibold tracking-wide text-[#1A1A1A] hover:text-[#D4AF37] cursor-pointer transition-colors" onClick={() => setSelectedWine(wine)}>
                          {wine.name}
                        </h3>
                        <p className="text-[11.5px] text-gray-500 leading-relaxed font-light line-clamp-3 pt-1">
                          {wine.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#FDFBF7] space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-widest text-gray-400">PRICE / BOTTLE</span>
                          <span className="font-serif text-lg font-bold text-[#1A1A1A]">R {wine.price}</span>
                        </div>

                        {/* Cart Actions */}
                        {inCartCount > 0 ? (
                          <div className="flex items-center gap-1.5 w-full">
                            <button 
                              onClick={() => updateQuantity(wine.id, 'wine', -1)}
                              className="p-2 border border-[#E5E5E5] bg-gray-50 hover:bg-white text-gray-800 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="flex-1 text-center font-mono text-xs font-semibold border-y border-[#E5E5E5] py-1.5 bg-white">
                              {inCartCount}
                            </span>
                            <button 
                              onClick={() => updateQuantity(wine.id, 'wine', 1)}
                              className="p-2 border border-[#E5E5E5] bg-gray-50 hover:bg-white text-gray-800 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => removeItem(wine.id, 'wine')}
                              className="p-2.5 border border-red-200 text-red-500 hover:bg-red-50 transition-colors ml-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAddWineToCart(wine)}
                            className="w-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-white py-2.5 text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Collection</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* CONNOISSEUR'S WINE CLUB & B2B HUB */}
      <section id="club" className="py-20 bg-[#FDFBF7] border-y border-[#E5E5E5] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Wine Club subscription */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase block">
                  Exclusivity Promised
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#1A1A1A]">
                  The Connoisseur’s Circle
                </h2>
                <div className="w-12 h-[1px] bg-[#D4AF37]" />
              </div>

              <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
                Join our elite monthly subscription program. Receive a hand-curated discovery parcel featuring 
                three ultra-exclusive boutique bottles sourced from emerging black-owned estates. Many of these 
                small-lot releases are bottled exclusively for club members and are never sold to the public.
              </p>

              {/* Premium Light themed club card */}
              <div className="bg-white border border-[#D4AF37]/40 p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#D4AF37] text-white text-[7.5px] tracking-widest uppercase font-bold py-1 px-4 transform rotate-45 translate-x-4 translate-y-3" />
                
                <span className="text-[9px] tracking-[0.2em] font-bold text-[#D4AF37] uppercase block mb-1">MEMBERSHIP PACKAGE</span>
                <h3 className="font-serif text-2xl font-medium text-[#1A1A1A] mb-1">Curated Discovery</h3>
                <p className="text-[11.5px] text-gray-500 font-light mb-6">Shipped directly to your door monthly across South Africa.</p>

                <div className="space-y-3.5 mb-6">
                  <div className="flex items-center gap-2 text-[12px] text-gray-700">
                    <Check className="w-4 h-4 text-[#D4AF37]" />
                    <span>3 Bottles of extremely limited boutique reserve wines</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-700">
                    <Check className="w-4 h-4 text-[#D4AF37]" />
                    <span>In-depth winemaker technical sheets & cellaring guides</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-700">
                    <Check className="w-4 h-4 text-[#D4AF37]" />
                    <span>Complimentary VIP tasting entry at Cape Town center for 2 guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-700">
                    <Check className="w-4 h-4 text-[#D4AF37]" />
                    <span>Exclusive priority allocation for new release boutique reserves</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E5E5] flex items-end justify-between mb-4">
                  <div>
                    <span className="block text-[8px] uppercase tracking-widest text-gray-400">MONTHLY DUES</span>
                    <span className="font-serif text-2xl font-bold text-[#1A1A1A]">R 980 <span className="text-[11px] font-sans font-light text-gray-500">/ month</span></span>
                  </div>
                  <span className="text-[9px] tracking-widest uppercase font-semibold text-[#D4AF37] bg-[#FDFBF7] border border-[#D4AF37]/30 px-3 py-1">
                    Free Courier
                  </span>
                </div>

                <a 
                  href="https://wa.me/27716747186?text=Hi%20The%20Wine%20Spot%20SA!%20I%20am%20interested%20in%20joining%20The%20Connoisseur%E2%80%99s%20Circle%20Wine%20Club%20subscription.%20Please%20provide%20the%20onboarding%20details."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-white py-3.5 text-center text-[10px] tracking-[0.25em] uppercase font-bold transition-all duration-300 block"
                >
                  Apply for Membership
                </a>
              </div>
            </div>

            {/* Right: B2B Hub for operators & planners */}
            <div id="b2b" className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase block">
                  Collaborative Partnership
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#1A1A1A]">
                  B2B Hub & Travel Planners
                </h2>
                <div className="w-12 h-[1px] bg-[#D4AF37]" />
              </div>

              <p className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
                We design premium customized oenological itineraries for international tour groups, luxury concierge agencies, 
                and corporate planners. Elevate your itineraries with real historical context, black-owned boutique wines, 
                and private masterclasses.
              </p>

              {/* B2B Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {B2B_BENEFITS.map((benefit, idx) => (
                  <div key={idx} className="bg-white border border-[#E5E5E5] p-5 space-y-3.5 shadow-sm hover:border-[#D4AF37]/50 transition-colors">
                    <div className="w-9 h-9 bg-[#FDFBF7] border border-[#D4AF37]/40 flex items-center justify-center">
                      {idx === 0 ? <Compass className="w-4.5 h-4.5 text-[#D4AF37]" /> : 
                       idx === 1 ? <Building2 className="w-4.5 h-4.5 text-[#D4AF37]" /> : 
                       <Layers className="w-4.5 h-4.5 text-[#D4AF37]" />}
                    </div>
                    <h4 className="font-serif text-sm font-semibold text-[#1A1A1A]">{benefit.title}</h4>
                    <p className="text-[11px] text-gray-500 font-light leading-relaxed">{benefit.desc}</p>
                    
                    <ul className="space-y-1 pt-2 border-t border-[#FDFBF7]">
                      {benefit.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="text-[9.5px] text-[#1A1A1A] font-medium flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* B2B Contact Form */}
              <div className="bg-white border border-[#E5E5E5] p-6">
                <span className="text-[9px] tracking-[0.2em] font-bold text-[#D4AF37] uppercase block mb-4">CONNECT WITH OUR CONCIERGE TEAM</span>
                
                {b2bSuccess ? (
                  <div className="bg-[#FDFBF7] border border-[#D4AF37]/30 p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <h4 className="font-serif text-lg font-medium">Inquiry Submitted Successfully</h4>
                    <p className="text-[12px] text-gray-500 font-light">
                      Thank you for contacting The Wine Spot SA concierge. A senior hospitality manager will compile your requested proposal within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleB2bSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8.5px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">Company Name *</label>
                        <input 
                          type="text" 
                          required
                          value={b2bInquiry.company}
                          onChange={(e) => setB2bInquiry({...b2bInquiry, company: e.target.value})}
                          placeholder="e.g. Cape Journeys Luxury Travel"
                          className="w-full editorial-input"
                        />
                      </div>
                      <div>
                        <label className="block text-[8.5px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">Lead Contact Name *</label>
                        <input 
                          type="text" 
                          required
                          value={b2bInquiry.contact}
                          onChange={(e) => setB2bInquiry({...b2bInquiry, contact: e.target.value})}
                          placeholder="e.g. Sindi Ndlovu"
                          className="w-full editorial-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-[8.5px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">Email Address *</label>
                        <input 
                          type="email" 
                          required
                          value={b2bInquiry.email}
                          onChange={(e) => setB2bInquiry({...b2bInquiry, email: e.target.value})}
                          placeholder="e.g. agency@domain.com"
                          className="w-full editorial-input"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[8.5px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">Contact Phone</label>
                        <input 
                          type="tel" 
                          value={b2bInquiry.phone}
                          onChange={(e) => setB2bInquiry({...b2bInquiry, phone: e.target.value})}
                          placeholder="e.g. +27 71 674 7186"
                          className="w-full editorial-input"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[8.5px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">Primary Interest</label>
                        <select 
                          value={b2bInquiry.interest}
                          onChange={(e) => setB2bInquiry({...b2bInquiry, interest: e.target.value})}
                          className="w-full editorial-select"
                        >
                          <option>Bespoke Tour Operators</option>
                          <option>MICE & Corporate Galas</option>
                          <option>Curated International Exports</option>
                          <option>Private Venue Buy-out</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8.5px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">Describe Tour Profile / Event Schedule</label>
                      <textarea 
                        rows={3}
                        value={b2bInquiry.message}
                        onChange={(e) => setB2bInquiry({...b2bInquiry, message: e.target.value})}
                        placeholder="Detail your group size, travel dates, or technical tasting requirements..."
                        className="w-full editorial-input"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-white px-6 py-3 text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-300"
                    >
                      Submit Concierge Request
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER & ADDRESS & DISCLAIMER */}
      <footer id="contact" className="bg-[#1A1A1A] text-[#FDFBF7] pt-16 pb-6 relative overflow-hidden border-t border-[#D4AF37]/30">
        
        {/* Subtle geometric framing */}
        <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-[#D4AF37]/10" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-[#D4AF37]/10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-gray-800">
            
            {/* Footer Left: Brand info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center border border-[#D4AF37] bg-[#111111] rounded-none">
                  <Logo variant="minimal" size="24" className="text-[#D4AF37]" />
                </div>
                <div>
                  <span className="block font-serif text-base tracking-[0.1em] font-medium uppercase text-white">
                    The Wine Spot SA
                  </span>
                  <span className="block text-[8px] tracking-[0.25em] text-[#D4AF37] font-semibold uppercase">
                    Exquisite Tasting Center
                  </span>
                </div>
              </div>
              <p className="text-[12px] text-gray-400 font-light leading-relaxed max-w-sm">
                Showcasing pioneer viticultural crafts from black-owned, generational South African wineries at the historic Long March to Freedom monument.
              </p>
              <div className="pt-2">
                <span className="block text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-1">PROUDLY ASSOCIATED WITH</span>
                <span className="font-serif italic text-sm text-[#D4AF37]">The Long March to Freedom Heritage Foundation</span>
              </div>
            </div>

            {/* Footer Middle: Address & Direct Links */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-serif text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">The Tasting Site</h4>
              <ul className="space-y-3.5 text-[12px] text-gray-400 font-light">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>
                    Century Boulevard, Canal Walk Mall, <br />
                    Cape Town, South Africa, 7441 <br />
                    <span className="text-[10px] text-gray-500 italic">(Located inside the Long March to Freedom heritage site)</span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Mon - Sun: 10:00 — 18:00</span>
                </li>
              </ul>
            </div>

            {/* Footer Right: Direct Contact channels */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-serif text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Direct Channels</h4>
              <ul className="space-y-3.5 text-[12px] text-gray-400 font-light">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                  <a href="mailto:info@thewinespotsa.com" className="hover:text-white transition-colors">
                    info@thewinespotsa.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                  <a 
                    href="https://wa.me/27716747186" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>WhatsApp Concierge: 0716747186</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                </li>
                <li className="pt-2">
                  <a 
                    href="https://wa.me/27716747186?text=Hi%20The%20Wine%20Spot%20SA!%20I%20would%20like%20to%20request%20information%20about%20your%20tastings%20and%20availabilities."
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-[#D4AF37]/40 px-4 py-2 text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                  >
                    <span>Instant Chat</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Legal and Disclaimer Block */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <p>© 2026 The Wine Spot SA (Pty) Ltd. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#gallery" className="hover:text-[#D4AF37]">Terms of Service</a>
              <span>•</span>
              <a href="#gallery" className="hover:text-[#D4AF37]">Privacy Protocol</a>
              <span>•</span>
              <a href="#gallery" className="hover:text-[#D4AF37]">Heritage Licensing</a>
            </div>
          </div>

        </div>
      </footer>


      {/* SIDE CART SLIDING DRAWER CONTAINER */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop shadow overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-xs"
            />

            {/* Sliding Drawer Body */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between bg-[#FDFBF7]">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-serif text-lg font-semibold tracking-wider text-[#1A1A1A]">Your Curated Selection</h3>
                  <span className="bg-[#1A1A1A] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                    {cartItemCount}
                  </span>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 hover:bg-gray-100 text-[#1A1A1A] transition-colors border border-transparent hover:border-[#E5E5E5]"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Items Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                    <div className="w-16 h-16 rounded-full bg-[#FDFBF7] border border-[#D4AF37]/30 flex items-center justify-center">
                      <WineIcon className="w-7 h-7 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-semibold">Your Vault is Empty</h4>
                      <p className="text-[12px] text-gray-500 font-light mt-1 max-w-xs mx-auto">
                        Browse our curated catalog of black-owned wineries or schedule a tasting to fill your cart.
                      </p>
                    </div>
                    <button 
                      onClick={() => { setCartOpen(false); scrollToSection('shop'); }}
                      className="border border-[#1A1A1A] hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white px-6 py-2.5 text-[10px] tracking-widest uppercase font-bold transition-all"
                    >
                      Start Exploring
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div 
                        key={`${item.id}-${item.type}`}
                        className="flex items-start gap-4 p-4 border border-[#E5E5E5] bg-[#FDFBF7] relative group"
                      >
                        {/* Custom visual thumbnail representing red or white based on item details */}
                        <div className="w-16 h-20 bg-white border border-[#E5E5E5] flex items-center justify-center p-2 shrink-0">
                          {item.type === 'wine' ? (
                            <img 
                              src={bottlePlaceholderImg}
                              alt={item.name} 
                              className="max-h-full max-w-full object-contain filter drop-shadow-md"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Calendar className="w-6 h-6 text-[#D4AF37]" />
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          {item.brand && (
                            <span className="block text-[8px] tracking-widest font-bold text-[#D4AF37] uppercase">
                              {item.brand}
                            </span>
                          )}
                          <h4 className="font-serif text-xs font-semibold text-[#1A1A1A] leading-tight truncate">
                            {item.name}
                          </h4>
                          
                          {/* If experience, show reservation parameters */}
                          {item.type === 'experience' && (
                            <div className="text-[9.5px] text-gray-500 space-y-0.5">
                              <span className="block">📅 Date: <strong className="text-gray-700">{item.date}</strong></span>
                              <span className="block">⏰ Time: <strong className="text-gray-700">{item.time}</strong></span>
                              <span className="block">👥 Guests: <strong className="text-gray-700">{item.guests}</strong></span>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            {/* Quantity Adjusters */}
                            <div className="flex items-center border border-[#E5E5E5] bg-white">
                              <button 
                                onClick={() => updateQuantity(item.id, item.type, -1)}
                                className="px-2 py-0.5 text-gray-500 hover:bg-gray-100"
                                aria-label="Decrease"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="px-3 py-0.5 font-mono text-[11px] text-gray-800 font-semibold border-x border-[#E5E5E5]">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.type, 1)}
                                className="px-2 py-0.5 text-gray-500 hover:bg-gray-100"
                                aria-label="Increase"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            {/* Item total value */}
                            <span className="font-serif text-[12.5px] font-semibold text-[#1A1A1A]">
                              R {item.price * item.quantity}
                            </span>
                          </div>

                        </div>

                        {/* Top corner remove button */}
                        <button 
                          onClick={() => removeItem(item.id, item.type)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Checkout Block */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-[#E5E5E5] bg-[#FDFBF7] space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>Curated Selection Subtotal</span>
                      <span className="font-mono">R {cartSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-500">
                      <span>Secure Site Delivery courier</span>
                      <span className="text-[#D4AF37] uppercase tracking-widest font-semibold">TBD on chat</span>
                    </div>
                    <div className="flex justify-between text-base font-serif font-bold text-[#1A1A1A] pt-1.5 border-t border-gray-200">
                      <span>Grand Manifest Total</span>
                      <span>R {cartSubtotal}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleWhatsAppCheckout}
                    className="w-full bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-white py-4 text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-md"
                  >
                    <span>Proceed to Checkout via WhatsApp</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>

                  <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                    Once clicked, a fully structured WhatsApp order manifest will load automatically. 
                    Our concierge team will verify cellar allocations and coordinate secure door-to-door courier delivery.
                  </p>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* MODAL: TASTING EXPERIENCE BOOKING SCHEDULER */}
      <AnimatePresence>
        {bookingExperience && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingExperience(null)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] md:top-[15%] md:left-1/2 md:-translate-x-1/2 md:max-w-lg bg-white border border-[#D4AF37]/50 z-50 p-6 md:p-8 shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[#E5E5E5] mb-6">
                <div>
                  <span className="text-[9px] tracking-widest uppercase text-[#D4AF37] font-bold block mb-1">RESERVATION PORTAL</span>
                  <h3 className="font-serif text-2xl font-medium text-[#1A1A1A] leading-tight">
                    {bookingExperience.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setBookingExperience(null)}
                  className="p-1 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleBookExperience} className="space-y-5">
                
                {/* Experience Specs Summary banner */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-[#FDFBF7] border border-[#E5E5E5] text-center">
                  <div>
                    <span className="block text-[8px] uppercase tracking-widest text-gray-400">DURATION</span>
                    <span className="text-[11px] font-semibold text-gray-800">{bookingExperience.duration}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-widest text-gray-400">FLIGHT SIZE</span>
                    <span className="text-[11px] font-semibold text-gray-800">{bookingExperience.pours}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase tracking-widest text-gray-400">RATE PER GUEST</span>
                    <span className="text-[11px] font-semibold text-[#D4AF37]">R195</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Select Date */}
                  <div>
                    <label className="block text-[8.5px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">
                      Select Preferred Date *
                    </label>
                    <div className="relative">
                      <input 
                        type="date" 
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full editorial-input"
                      />
                    </div>
                  </div>

                  {/* Select Time & Guests */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8.5px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">
                        Preferred Time *
                      </label>
                      <select 
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full editorial-select"
                      >
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">01:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="17:00">05:00 PM</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[8.5px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">
                        Number of Guests *
                      </label>
                      <div className="flex items-center border border-[#E5E5E5] bg-[#FDFBF7]">
                        <button 
                          type="button"
                          onClick={() => setBookingGuests(Math.max(1, bookingGuests - 1))}
                          className="px-3 py-3 hover:bg-gray-100 text-gray-500"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="flex-1 text-center font-mono text-xs font-semibold py-3">
                          {bookingGuests}
                        </span>
                        <button 
                          type="button"
                          onClick={() => setBookingGuests(bookingGuests + 1)}
                          className="px-3 py-3 hover:bg-gray-100 text-gray-500"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total Calculations */}
                  <div className="py-3 border-t border-dashed border-[#E5E5E5] flex items-center justify-between">
                    <div>
                      <span className="block text-[8.5px] uppercase tracking-widest text-gray-400">TOTAL RESERVATION DEPOSIT</span>
                      <span className="text-[10px] text-gray-500 italic">R195 x {bookingGuests} guests</span>
                    </div>
                    <span className="font-serif text-xl font-bold text-[#1A1A1A]">
                      R {195 * bookingGuests}
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-500 leading-relaxed font-light">
                    Note: Reservation includes full entry and a 30-minute historical walk of the Long March to Freedom heritage center prior to wine flight service.
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#E5E5E5]">
                  <button 
                    type="button"
                    onClick={() => setBookingExperience(null)}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 py-3 text-xs tracking-widest uppercase font-bold transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-white py-3 text-xs tracking-widest uppercase font-bold transition-all text-center"
                  >
                    Confirm Booking
                  </button>
                </div>

              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* MODAL: WINE QUICK VIEW DETAIL SCREEN */}
      <AnimatePresence>
        {selectedWine && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWine(null)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[8%] bottom-[8%] md:left-1/2 md:-translate-x-1/2 md:max-w-2xl bg-white border border-[#D4AF37]/50 z-50 p-6 md:p-8 shadow-2xl overflow-y-auto flex flex-col justify-between"
            >
              
              <div>
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-4 border-b border-[#E5E5E5] mb-6">
                  <div>
                    <span className="text-[9px] tracking-widest uppercase text-[#D4AF37] font-bold block mb-1">
                      {selectedWine.brand}
                    </span>
                    <h3 className="font-serif text-2xl font-medium text-[#1A1A1A] leading-tight">
                      {selectedWine.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedWine(null)}
                    className="p-1 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Wine Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  
                  {/* Left Column: Wine bottle render */}
                  <div className="md:col-span-5 bg-[#FDFBF7] border border-[#E5E5E5] p-4 flex items-center justify-center relative min-h-[250px]">
                    <img 
                      src={bottlePlaceholderImg}
                      alt={selectedWine.name} 
                      className="max-h-60 object-contain filter drop-shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-white px-2 py-0.5 text-[8px] tracking-widest uppercase font-bold border border-gray-200 font-mono">
                      {selectedWine.category}
                    </div>
                  </div>

                  {/* Right Column: Sommelier Notes */}
                  <div className="md:col-span-7 space-y-4">
                    
                    <div>
                      <h4 className="text-[10px] tracking-widest uppercase font-bold text-gray-400 mb-1.5">WINERY STORY & HERITAGE</h4>
                      <p className="text-xs text-gray-700 leading-relaxed font-light">
                        {selectedWine.desc}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                      <div>
                        <h5 className="text-[9px] tracking-widest uppercase font-bold text-[#D4AF37] mb-1">AROMATIC PROFILE</h5>
                        <p className="text-xs text-gray-600 font-light">{selectedWine.aroma}</p>
                      </div>
                      <div>
                        <h5 className="text-[9px] tracking-widest uppercase font-bold text-[#D4AF37] mb-1">PALATE EXPECTATIONS</h5>
                        <p className="text-xs text-gray-600 font-light">{selectedWine.palate}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="block text-[8px] tracking-widest uppercase text-gray-400 font-bold">CELLAR RELEASE PRICE</span>
                        <span className="font-serif text-2xl font-bold text-[#1A1A1A] font-mono">R {selectedWine.price}</span>
                      </div>
                      
                      <span className="text-[9px] uppercase tracking-widest font-semibold bg-[#FDFBF7] text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1">
                        Limited Reserve Flight
                      </span>
                    </div>

                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#E5E5E5] flex gap-3 mt-8">
                <button 
                  onClick={() => setSelectedWine(null)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 py-3 text-xs tracking-widest uppercase font-bold transition-all text-center"
                >
                  Close Notes
                </button>
                <button 
                  onClick={() => {
                    handleAddWineToCart(selectedWine);
                    setSelectedWine(null);
                  }}
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#D4AF37] text-white hover:text-white py-3 text-xs tracking-widest uppercase font-bold transition-all text-center flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>Add to Vault Cart</span>
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
