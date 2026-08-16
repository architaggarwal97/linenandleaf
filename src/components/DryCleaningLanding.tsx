import React, { useState } from 'react';
import { 
  Droplet, 
  Zap, 
  Eye, 
  Cpu, 
  MapPin, 
  MessageCircle, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Leaf,
  CheckCircle2,
  Camera,
  CalendarDays,
  Shield,
  Phone,
  Menu,
  X,
  Package,
  Truck,
  Sparkles,
  Search,
  Wallet,
  Gift,
  Plus,
  Minus
} from 'lucide-react';
import { site } from '@/lib/site';

// Pricing Data Model
const PRICING_DATA = {
  shirt: { name: "Premium Men's Shirt", price: 149 },
  suit: { name: "2-Piece Suit Care", price: 699 },
  kurta: { name: "Women's Designer Kurta", price: 249 },
  lehenga: { name: "Heavy Bridal/Lehenga", price: 999 }
};

type CartKey = keyof typeof PRICING_DATA;
type TrackingResult = { id: string; status: number; estimatedDelivery: string; items: string };

export function DryCleaningLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [portalTab, setPortalTab] = useState<'book' | 'track'>('book'); // 'book' or 'track'
  
  // Forms & Calculator State
  const [bookDetails, setBookDetails] = useState({ name: '', phone: '', address: '' });
  const [cart, setCart] = useState({ shirt: 0, suit: 0, kurta: 0, lehenga: 0 });
  const [trackId, setTrackId] = useState('');
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);

  // Derived Calculator Values
  const totalEstimate = (Object.keys(cart) as CartKey[]).reduce((sum, key) => sum + cart[key] * PRICING_DATA[key].price, 0);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const updateCart = (item: CartKey, delta: number) => {
    setCart(prev => ({ ...prev, [item]: Math.max(0, prev[item] + delta) }));
  };

  const handleWhatsAppClick = (customMessage = "Hi Linen & Leaf! I'd like to schedule a pickup.") => {
    window.open(`${site.whatsappUrl}?text=${encodeURIComponent(customMessage)}`, "_blank", "noopener");
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Handlers
  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Linen & Leaf! I'd like to schedule a pickup.\n\n*Name:* ${bookDetails.name}\n*Phone:* ${bookDetails.phone}\n*Address:* ${bookDetails.address}\n\nPlease confirm the pickup time.`;
    handleWhatsAppClick(text);
  };

  const handleEstimateBook = () => {
    if (totalItems === 0) {
      handleWhatsAppClick("Hi Linen & Leaf! I'd like to get a custom quote for my garments.");
      return;
    }
    const itemsList = (Object.keys(cart) as CartKey[])
      .filter((k) => cart[k] > 0)
      .map(k => `${cart[k]}x ${PRICING_DATA[k].name}`)
      .join("\n- ");
    
    const msg = `Hi Linen & Leaf! I'd like to book a pickup based on this estimate:\n\n*My Order:*\n- ${itemsList}\n\n*Estimated Total:* ₹${totalEstimate}\n\nPlease let me know the next steps!`;
    handleWhatsAppClick(msg);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(trackId.trim() !== '') {
      setTrackingResult({
        id: trackId.toUpperCase(),
        status: 2, 
        estimatedDelivery: "Tomorrow, 6:00 PM",
        items: "3 (2 Shirts, 1 Suit)"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-teal-200">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Lockup */}
            <div className="flex items-center gap-3 group cursor-pointer relative z-50">
              <div className="relative flex h-10 w-10 items-center justify-center shrink-0">
                <div className="absolute inset-0 bg-teal-100 rounded-tr-[1.25rem] rounded-bl-[1.25rem] rounded-tl-md rounded-br-md -rotate-12 group-hover:rotate-45 transition-transform duration-700 ease-in-out"></div>
                <div className="absolute inset-0.5 bg-gradient-to-br from-teal-600 to-teal-400 rounded-tr-[1.25rem] rounded-bl-[1.25rem] rounded-tl-md rounded-br-md flex items-center justify-center shadow-md shadow-teal-600/30 group-hover:scale-105 transition-transform duration-500">
                  <Leaf className="h-4 w-4 text-white drop-shadow-sm" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col mt-0.5">
                <span className="font-extrabold text-xl sm:text-[1.35rem] tracking-tight text-slate-800 leading-none">
                  Linen<span className="text-teal-600 font-light italic mx-0.5">{"&"}</span>Leaf
                </span>
                <span className="text-[0.5rem] sm:text-[0.55rem] uppercase tracking-[0.25em] text-slate-400 leading-none mt-1 font-bold ml-0.5">
                  Garment Care
                </span>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex space-x-8 items-center">
              <a href="#usps" className="text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">Why Us</a>
              <a href="#services" className="text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">Pricing</a>
              <a href="#plans" className="text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">{"Wallet & Plans"}</a>
              <a href="#portal" className="text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors">Track</a>
              <button 
                onClick={() => handleWhatsAppClick()}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center relative z-50">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-teal-600 p-2 focus:outline-none">
                {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <div className={`lg:hidden fixed inset-x-0 top-20 bg-white border-b border-slate-100 shadow-2xl transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}`}>
          <div className="flex flex-col px-6 py-8 space-y-6 bg-white/95 backdrop-blur-3xl">
            <a href="#usps" onClick={closeMenu} className="text-lg font-medium text-slate-700 hover:text-teal-600">Why Us</a>
            <a href="#services" onClick={closeMenu} className="text-lg font-medium text-slate-700 hover:text-teal-600">Pricing Estimator</a>
            <a href="#plans" onClick={closeMenu} className="text-lg font-medium text-slate-700 hover:text-teal-600">{"Wallet & Plans"}</a>
            <a href="#portal" onClick={closeMenu} className="text-lg font-medium text-slate-700 hover:text-teal-600">Track Order</a>
            <button 
              onClick={() => { handleWhatsAppClick(); closeMenu(); }}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-green-500/20 mt-4"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 md:pt-28 md:pb-40 overflow-hidden bg-[#fdfefd]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-100/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-amber-50/60 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-teal-50 border border-teal-100/60 text-teal-700 text-xs sm:text-sm font-medium mb-8 sm:mb-10 shadow-sm backdrop-blur-sm">
              <Zap className="h-4 w-4 fill-current text-amber-400 shrink-0" />
              <span>South Delhi's Fastest Premium Garment Care</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-slate-800 mb-6 sm:mb-8 leading-[1.15] md:leading-[1.1]">
              <span className="font-extrabold text-teal-900 bg-teal-100/80 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl sm:rounded-2xl inline-block transform -rotate-1 mb-3 sm:mb-4 shadow-sm border border-teal-200/50">99% Less Water.</span> <br />
              Cleaner clothes, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-400 block sm:inline">tracked live.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-500 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-2 sm:px-0">
              Experience modern, eco-friendly garment care right here in Sarojini Nagar. Fast delivery, precision Italian technology, and total transparency—minus the guesswork.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center w-full px-4 sm:px-0">
              <a href="#services" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-700 text-white px-8 py-4 rounded-full text-base sm:text-lg font-medium transition-all duration-300 shadow-xl shadow-teal-900/10 hover:-translate-y-1">
                <Plus className="h-5 w-5 text-teal-200" />
                Calculate Estimate
              </a>
              <a href="#plans" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-8 py-4 rounded-full text-base sm:text-lg font-medium transition-all duration-300 shadow-sm border border-slate-100 hover:-translate-y-1">
                {"View Plans & Pricing"} <ArrowRight className="h-5 w-5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Client Portal (Booking & Tracking) */}
      <section id="portal" className="py-20 bg-slate-50 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setPortalTab('book')}
                className={`flex-1 py-6 text-center font-semibold text-lg transition-colors ${portalTab === 'book' ? 'text-teal-700 bg-white border-t-4 border-t-teal-500' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Quick Booking
              </button>
              <button 
                onClick={() => setPortalTab('track')}
                className={`flex-1 py-6 text-center font-semibold text-lg transition-colors ${portalTab === 'track' ? 'text-teal-700 bg-white border-t-4 border-t-teal-500' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Track Order
              </button>
            </div>

            <div className="p-8 sm:p-12">
              {portalTab === 'book' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800">Schedule Your Free Pickup</h3>
                    <p className="text-slate-500 font-light mt-2">Enter your details below. We'll confirm your slot instantly via WhatsApp.</p>
                  </div>
                  <form onSubmit={handleBookSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                        <input type="text" required value={bookDetails.name} onChange={(e)=>setBookDetails({...bookDetails, name: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700" placeholder="Rahul Sharma" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp Number</label>
                        <input type="tel" required value={bookDetails.phone} onChange={(e)=>setBookDetails({...bookDetails, phone: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700" placeholder="+91 99999 99999" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Pickup Address / GPRA Flat Number</label>
                      <textarea required value={bookDetails.address} onChange={(e)=>setBookDetails({...bookDetails, address: e.target.value})} rows={3} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700 resize-none" placeholder="e.g., Flat 402, Block B, Sarojini Nagar..."></textarea>
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-300 shadow-lg shadow-green-500/20 hover:-translate-y-1 mt-4">
                      <MessageCircle className="h-5 w-5" /> Continue on WhatsApp
                    </button>
                  </form>
                </div>
              )}

              {portalTab === 'track' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800">Track Your Garments</h3>
                    <p className="text-slate-500 font-light mt-2">Enter your Order ID to see live photo checkpoints and status updates.</p>
                  </div>
                  
                  <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3 mb-10">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input type="text" required value={trackId} onChange={(e) => setTrackId(e.target.value)} className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-slate-700 uppercase" placeholder="e.g. LL-8402" />
                    </div>
                    <button type="submit" className="bg-teal-700 hover:bg-teal-600 text-white px-8 py-4 rounded-2xl font-medium transition-colors shadow-md shadow-teal-700/20">
                      Track Now
                    </button>
                  </form>

                  {trackingResult && (
                    <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Order #{trackingResult.id}</p>
                          <p className="text-slate-700 font-medium">{trackingResult.items}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Delivery</p>
                          <p className="text-teal-700 font-bold">{trackingResult.estimatedDelivery}</p>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute left-[1.15rem] top-2 bottom-2 w-0.5 bg-slate-200 z-0"></div>
                        <div className="space-y-6 relative z-10">
                          {[
                            { step: 0, title: "Order Booked", icon: <Package className="h-4 w-4" /> },
                            { step: 1, title: "Picked Up & Tagged", icon: <MapPin className="h-4 w-4" /> },
                            { step: 2, title: "Processing (Eco-Wash)", icon: <Sparkles className="h-4 w-4" />, active: true },
                            { step: 3, title: "Ready for Delivery", icon: <CheckCircle2 className="h-4 w-4" /> },
                          ].map((stage) => {
                            const isCompleted = trackingResult.status > stage.step;
                            const isCurrent = trackingResult.status === stage.step;
                            return (
                              <div key={stage.step} className={`flex items-start gap-4 ${isCompleted || isCurrent ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-4 border-slate-50 shadow-sm transition-colors duration-500
                                  ${isCompleted ? 'bg-teal-500 text-white' : isCurrent ? 'bg-amber-400 text-white animate-pulse' : 'bg-slate-200 text-slate-400'}`}
                                >
                                  {stage.icon}
                                </div>
                                <div className="pt-2">
                                  <h4 className={`font-semibold ${isCurrent ? 'text-amber-600' : 'text-slate-700'}`}>{stage.title}</h4>
                                  {isCurrent && stage.step === 2 && (
                                    <p className="text-sm text-slate-500 mt-1 font-light flex items-center gap-2">
                                      <Camera className="h-3 w-3" /> View Tagged Garment Photos
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core USPs Section */}
      <section id="usps" className="py-20 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 sm:mb-5 tracking-tight">The Standard Has Changed</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed">We rebuilt dry cleaning from the ground up to solve the inefficiencies of traditional neighborhood pressers.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="bg-white rounded-3xl sm:rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group hover:-translate-y-2">
              <div className="h-14 w-14 sm:h-16 sm:w-16 bg-teal-50 rounded-full flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500">
                <Droplet className="h-6 w-6 sm:h-7 sm:w-7 text-teal-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Eco-Smart Cleaning</h3>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-light">Uses <strong className="font-semibold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">99% less water</strong> than a conventional wash cycle. Solvent-based dry cleaning that protects both your fabrics and the planet.</p>
            </div>
            
            <div className="bg-white rounded-3xl sm:rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group hover:-translate-y-2">
              <div className="h-14 w-14 sm:h-16 sm:w-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500">
                <Eye className="h-6 w-6 sm:h-7 sm:w-7 text-blue-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Live Tracking</h3>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-light">Know exactly where your order is. We send tagged photo checkpoints at pickup and after cleaning directly to your WhatsApp.</p>
            </div>

            <div className="bg-white rounded-3xl sm:rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group hover:-translate-y-2">
              <div className="h-14 w-14 sm:h-16 sm:w-16 bg-amber-50 rounded-full flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500">
                <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-amber-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Fast Delivery</h3>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-light">Skip the standard 3-day wait. We offer a standard 24-hour turnaround, with exclusive 2-hour express options for local retailers.</p>
            </div>

            <div className="bg-white rounded-3xl sm:rounded-[2rem] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group hover:-translate-y-2">
              <div className="h-14 w-14 sm:h-16 sm:w-16 bg-purple-50 rounded-full flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500">
                <Cpu className="h-6 w-6 sm:h-7 sm:w-7 text-purple-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">Best-in-Class Tech</h3>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-light">Modern LG commercial soft-mount stackers and Italian finishing equipment. Precision care, not just a neighborhood press.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Live Estimator Section */}
      <section id="services" className="py-20 md:py-32 bg-teal-950 text-white relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-800/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
            
            {/* Left: USPs */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight leading-[1.15]">Engineered for Retailers &amp; Residents.</h2>
              <p className="text-teal-100/70 text-base sm:text-lg mb-10 md:mb-12 leading-relaxed font-light">
                Whether you're a Sarojini Nagar boutique needing display garments refreshed instantly, or a resident wanting premium doorstep care, we have a specialized vertical for you.
              </p>
              
              <div className="space-y-6 sm:space-y-8">
                <div className="flex gap-4 sm:gap-5 group">
                  <div className="mt-1 bg-teal-800/50 p-2.5 sm:p-3 rounded-2xl h-fit group-hover:bg-teal-700/50 transition-colors shrink-0">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-teal-300" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-medium mb-1 sm:mb-2 text-white">Garment Care Guarantee</h4>
                    <p className="text-sm sm:text-base text-teal-100/60 font-light leading-relaxed">Zero shrinkage and zero color-bleed promise. Backed by our photo-checkpoint system for total peace of mind.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 sm:gap-5 group">
                  <div className="mt-1 bg-amber-900/30 p-2.5 sm:p-3 rounded-2xl h-fit group-hover:bg-amber-900/50 transition-colors shrink-0">
                    <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-medium mb-1 sm:mb-2 text-white">Hygiene-First Processing</h4>
                    <p className="text-sm sm:text-base text-teal-100/60 font-light leading-relaxed">Steam sanitization and allergen removal standard with every order. Perfect for households with kids or sensitive skin.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Dynamic Pricing Estimator */}
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-cyan-400/20 rounded-[2rem] sm:rounded-[3rem] transform rotate-3 scale-105 opacity-50 blur-2xl"></div>
              <div className="bg-teal-900/40 backdrop-blur-xl border border-teal-800/50 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 relative z-10 shadow-2xl">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-center tracking-wide">Live Price Estimator</h3>
                <p className="text-center text-teal-200/60 text-sm font-light mb-8">Build your basket to get an instant quote.</p>
                
                <div className="space-y-4">
                  {(Object.keys(PRICING_DATA) as CartKey[]).map((key) => (
                    <div key={key} className="flex justify-between items-center pb-4 border-b border-teal-800/50">
                      <div>
                        <p className="text-base sm:text-lg text-teal-100/90 font-light">{PRICING_DATA[key].name}</p>
                        <p className="text-sm text-teal-400 font-semibold">₹{PRICING_DATA[key].price}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-teal-950/60 rounded-full p-1 border border-teal-800/50 shadow-inner">
                        <button 
                          onClick={() => updateCart(key, -1)} 
                          className="p-1.5 rounded-full hover:bg-teal-800 text-teal-200 transition-colors focus:outline-none"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-5 text-center text-white font-medium">{cart[key]}</span>
                        <button 
                          onClick={() => updateCart(key, 1)} 
                          className="p-1.5 rounded-full hover:bg-teal-800 text-teal-200 transition-colors focus:outline-none"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-between items-end bg-teal-950/40 p-5 rounded-2xl border border-teal-800/30">
                  <div className="flex flex-col">
                    <span className="text-teal-100/60 font-light text-sm">Estimated Total</span>
                    <span className="text-xs text-teal-400/80 mt-0.5">{totalItems} items selected</span>
                  </div>
                  <span className="text-4xl font-bold text-white tracking-tight">₹{totalEstimate}</span>
                </div>

                <button 
                  onClick={handleEstimateBook}
                  className="w-full mt-6 bg-white hover:bg-teal-50 text-teal-950 py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 flex justify-center items-center gap-2 hover:-translate-y-1 shadow-lg shadow-white/5"
                >
                  <MessageCircle className="h-5 w-5 text-green-500" /> 
                  {totalItems > 0 ? "Book this Estimate" : "Get a Custom Quote"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Wallet & Subscription Plans */}
      <section id="plans" className="py-20 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 sm:mb-5 tracking-tight">Put Your Laundry on Autopilot.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed">Stop paying per piece. Unlock massive savings and zero-friction pickups by choosing a smart plan that fits your household.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Prepaid Wallet Card */}
            <div className="bg-gradient-to-br from-teal-50 to-white rounded-[2rem] p-8 sm:p-10 border border-teal-100 shadow-[0_8px_30px_rgb(13,148,136,0.08)] relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">Most Flexible</div>
              <div className="h-14 w-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <Wallet className="h-7 w-7 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">L{"&"}L Prepaid Wallet</h3>
              <p className="text-teal-700 font-medium mb-6 flex items-center gap-2">
                <Gift className="h-5 w-5" /> Get a Flat 10% Off Every Order
              </p>
              <p className="text-slate-500 leading-relaxed font-light mb-8">
                Load funds into your digital wallet once, and skip the payment hassle at the door. Your balance never expires, and every single order receives an automatic 10% discount from our standard rate card.
              </p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-3 text-sm text-slate-600 font-light"><CheckCircle2 className="h-4 w-4 text-teal-500" /> Minimum ₹2,000 top-up required</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-light"><CheckCircle2 className="h-4 w-4 text-teal-500" /> Seamless auto-deductions per order</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-light"><CheckCircle2 className="h-4 w-4 text-teal-500" /> Valid on all dry cleaning &amp; steam ironing</li>
              </ul>
              <button 
                onClick={() => handleWhatsAppClick("Hi! I'd like to load my L&L Wallet to get 10% off.")}
                className="w-full bg-teal-700 hover:bg-teal-600 text-white py-4 rounded-2xl font-medium transition-colors shadow-md shadow-teal-700/20"
              >
                Top Up Wallet via WhatsApp
              </button>
            </div>

            {/* Monthly Subscription Card */}
            <div className="bg-slate-50 rounded-[2rem] p-8 sm:p-10 border border-slate-200 hover:border-amber-200 shadow-sm hover:shadow-[0_8px_30px_rgb(245,158,11,0.08)] relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
              <div className="h-14 w-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                <CalendarDays className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Monthly Wardrobe Plan</h3>
              <p className="text-slate-600 mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-800">₹2,499</span>
                <span className="text-sm font-medium">/month</span>
              </p>
              <p className="text-slate-500 leading-relaxed font-light mb-8">
                Perfect for PGs, busy professionals, and GPRA families. We pick up your daily wear, crisp it to perfection with eco-chemistry, and deliver it back weekly.
              </p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-3 text-sm text-slate-600 font-light"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Up to 30 standard garments per month</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-light"><CheckCircle2 className="h-4 w-4 text-amber-500" /> Scheduled weekly free pickups</li>
                <li className="flex items-center gap-3 text-sm text-slate-600 font-light"><CheckCircle2 className="h-4 w-4 text-amber-500" /> 15% discount on add-on heavy items (suits/lehengas)</li>
              </ul>
              <button 
                onClick={() => handleWhatsAppClick("Hi! I'm interested in subscribing to the Monthly Wardrobe Plan.")}
                className="w-full bg-white border-2 border-slate-200 hover:border-amber-500 hover:text-amber-600 text-slate-700 py-4 rounded-2xl font-medium transition-colors"
              >
                Subscribe via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="process" className="py-20 md:py-32 bg-[#f8faf9] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 sm:mb-5 tracking-tight">Conversational Commerce.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed">Skip the complicated apps. We process everything through a seamless WhatsApp integration.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 lg:gap-10 relative">
            <div className="hidden lg:block absolute top-14 left-[12%] right-[12%] h-0 border-t-2 border-dashed border-teal-200/60 z-0"></div>
            {[
              { step: "01", icon: <Phone className="h-6 w-6 text-teal-600" />, title: "Book a Pickup", desc: "WhatsApp, call, or use the form. We confirm your location instantly." },
              { step: "02", icon: <Camera className="h-6 w-6 text-teal-600" />, title: "Collect & Tag", desc: "We collect, tag, and photograph your garments to ensure accountability." },
              { step: "03", icon: <Zap className="h-6 w-6 text-teal-600" />, title: "Clean & Track", desc: "Processed on modern, low-water equipment. Track it live as it moves." },
              { step: "04", icon: <MapPin className="h-6 w-6 text-teal-600" />, title: "Rapid Return", desc: "Delivered back to your door or shop, crisply pressed and on time." }
            ].map((item, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                <div className="h-24 w-24 sm:h-28 sm:w-28 bg-white rounded-full flex flex-col items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 sm:mb-8 group-hover:-translate-y-2 transition-transform duration-500">
                  <span className="text-[0.65rem] sm:text-xs font-bold text-teal-200 mb-1 uppercase tracking-wider">{item.step}</span>
                  {item.icon}
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-light px-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & Service Area */}
      <section id="faq" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-20">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-6 tracking-tight">Check Service Area</h2>
              <p className="text-slate-500 mb-8 sm:mb-10 font-light leading-relaxed text-base sm:text-lg">Currently serving the GPRA flats, Sarojini Nagar market, and select South Delhi pin codes with free hyper-local delivery.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Enter your PIN Code (e.g. 110070)" 
                  className="flex-1 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 shadow-inner text-slate-700 placeholder-slate-400"
                />
                <button className="w-full sm:w-auto bg-teal-700 hover:bg-teal-600 text-white px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-medium transition-colors shadow-md shadow-teal-700/20">
                  Verify
                </button>
              </div>
              <div className="mt-10 sm:mt-12 p-6 sm:p-8 bg-amber-50/50 rounded-2xl sm:rounded-3xl border border-amber-100/50">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="bg-amber-100 p-2.5 rounded-xl shrink-0 self-start">
                    <ShieldCheck className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">{"Independent & Authentic"}</h4>
                    <p className="text-amber-800/70 text-sm leading-relaxed font-light">We are a proudly independent, founder-led business in Sarojini Nagar—not a distant corporate franchise. Your clothes never leave our local facility.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 sm:mb-8 tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-4 sm:space-y-5">
                {[
                  {
                    q: "What is your damage policy?",
                    a: "We offer a zero-shrinkage, zero-color-bleed guarantee. Our photo checkpoint system ensures total accountability from pickup to delivery."
                  },
                  {
                    q: "How fast is your turnaround?",
                    a: "Standard delivery is 24 hours. We also offer an exclusive 2-hour 'Retail-Ready Refresh' for Sarojini Nagar shops."
                  },
                  {
                    q: "Are there any hidden fees?",
                    a: "Never. Our pricing is completely itemized and transparent. You'll always approve the final quote on WhatsApp before we begin processing."
                  }
                ].map((faq, i) => (
                  <div key={i} className="p-5 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-3xl border border-transparent hover:border-teal-100 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                    <h4 className="font-semibold text-slate-800 mb-2 sm:mb-3">{faq.q}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-light">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-teal-800 py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 tracking-tight">Ready to upgrade your garment care?</h2>
          <p className="text-teal-100/80 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto font-light leading-relaxed px-4">
            Join the hundreds of Sarojini Nagar retailers and South Delhi residents who have switched to a faster, greener, and more transparent dry cleaning experience.
          </p>
          <button 
            onClick={() => handleWhatsAppClick()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg font-medium transition-all duration-300 shadow-xl shadow-green-900/20 hover:-translate-y-1"
          >
            <MessageCircle className="h-6 w-6 shrink-0" />
            Start a WhatsApp Chat Now
          </button>
        </div>
      </section>

      {/* Footer with SEO Block */}
      <footer className="bg-teal-950 text-teal-200/60 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 pb-12">
            <div>
              <div className="flex items-center gap-3 group cursor-pointer mb-6 sm:mb-8">
                <div className="relative flex h-10 w-10 items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-teal-800/80 rounded-tr-[1.25rem] rounded-bl-[1.25rem] rounded-tl-md rounded-br-md -rotate-12 group-hover:rotate-45 transition-transform duration-700 ease-in-out"></div>
                  <div className="absolute inset-0.5 bg-gradient-to-br from-teal-500 to-cyan-400 rounded-tr-[1.25rem] rounded-bl-[1.25rem] rounded-tl-md rounded-br-md flex items-center justify-center shadow-lg shadow-teal-900/50 group-hover:scale-105 transition-transform duration-500">
                    <Leaf className="h-4 w-4 text-teal-950 drop-shadow-sm" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex flex-col mt-0.5">
                  <span className="font-extrabold text-xl sm:text-[1.35rem] tracking-tight text-white leading-none">
                    Linen<span className="text-teal-500 font-light italic mx-0.5">{"&"}</span>Leaf
                  </span>
                  <span className="text-[0.5rem] sm:text-[0.55rem] uppercase tracking-[0.25em] text-teal-500 leading-none mt-1 font-bold ml-0.5">
                    Garment Care
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed font-light md:pr-8">Premium, eco-friendly garment care powered by Italian technology and digital-first logistics.</p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-5 sm:mb-6 tracking-wide">{"Location & Contact"}</h4>
              <ul className="space-y-3 sm:space-y-4 text-sm font-light">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-0.5 text-teal-500 shrink-0" />
                  <span className="leading-relaxed">1st Floor, Shop No. 108, Sarojini Nagar Market,<br />New Delhi, 110070</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-teal-500 shrink-0" />
                  <span>Open Daily: 9:00 AM - 9:00 PM</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-5 sm:mb-6 tracking-wide">Technology Partners</h4>
              <ul className="space-y-3 text-sm font-light">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" /> <span>LG Commercial Soft-Mounts</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" /> <span>Stirmatic Vacuum Irons</span></li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" /> <span>BÜFA Eco-Chemistry</span></li>
              </ul>
            </div>
          </div>

          {/* SEO "Cities We Serve" Block */}
          <div className="border-t border-teal-900/50 pt-10 pb-6">
            <h4 className="text-white font-medium mb-5 tracking-wide text-sm">Cities We Serve</h4>
            <div className="space-y-4 text-xs font-light leading-relaxed">
              <p>
                <strong className="text-teal-400 font-medium">Dry Clean:</strong>{' '}
                <a href="#seo" className="hover:text-white transition-colors">Dry Clean in South Delhi</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Dry Clean in Delhi</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Dry Clean in Gurgaon</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Dry Clean in Noida</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Dry Clean in Faridabad</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Dry Clean in Ghaziabad</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Dry Clean in Greater Noida</a>
              </p>
              <p>
                <strong className="text-teal-400 font-medium">Shoe Clean:</strong>{' '}
                <a href="#seo" className="hover:text-white transition-colors">Shoe Clean in South Delhi</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Shoe Clean in Delhi</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Shoe Clean in Gurgaon</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Shoe Clean in Noida</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Shoe Clean in Faridabad</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Shoe Clean in Ghaziabad</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Shoe Clean in Greater Noida</a>
              </p>
              <p>
                <strong className="text-teal-400 font-medium">Designer Wear:</strong>{' '}
                <a href="#seo" className="hover:text-white transition-colors">Designer Wear Clean in South Delhi</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Designer Wear Clean in Delhi</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Designer Wear Clean in Gurgaon</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Designer Wear Clean in Noida</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Designer Wear Clean in Faridabad</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Designer Wear Clean in Ghaziabad</a> <span className="text-teal-800/80 mx-1.5">|</span>
                <a href="#seo" className="hover:text-white transition-colors">Designer Wear Clean in Greater Noida</a>
              </p>
            </div>
          </div>

          <div className="border-t border-teal-900/50 pt-8 mt-4 text-xs sm:text-sm text-center font-light flex flex-col md:flex-row justify-between items-center gap-4">
            <p>{"\u00A9"} {new Date().getFullYear()} Linen and Leaf Dry Cleaners. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#seo" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#seo" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}