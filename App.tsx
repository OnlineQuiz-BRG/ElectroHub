
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { mockUsers, mockProducts, mockAuctions, mockReviews, mockNotifications } from './mockData';
import { User, Product, Auction, VerificationStatus, UserRole, CartItem, Review, Notification, NotificationType } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/AdminDashboard';
import AuctionCard from './components/AuctionCard';
import Auth from './components/Auth';
import { getGadgetAdvice } from './services/geminiService';
import { 
  Send, MessageSquare, ShoppingBag, ArrowRight, ShieldCheck, Heart, Trash2, Plus, Minus, 
  Info, Gavel, TrendingUp, AlertTriangle, Cpu, Star, Layers, PackageCheck, Tag, ChevronLeft,
  LifeBuoy, Mail, Users as UsersIcon, Eye, EyeOff, User as UserIcon, CheckCircle, Globe, Shield, Zap,
  MessageCircle, HelpCircle, FileQuestion, ChevronRight, Share2, Award, Phone, MapPin, Lock,
  Save
} from 'lucide-react';

const ProductCard: React.FC<{ p: Product, addToCart: (id: string) => void, isReseller?: boolean }> = ({ p, addToCart, isReseller = false }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all flex flex-col group h-full">
    <div className="relative overflow-hidden">
      <img src={p.images[0]} alt={p.title} className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500" />
      {isReseller && (
        <div className="absolute top-2 left-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-amber-200">
          Certified Pre-Owned
        </div>
      )}
      {p.discountPercentage > 0 && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg animate-pulse z-10">
          {p.discountPercentage}% OFF
        </div>
      )}
    </div>
    <div className="p-4 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-2 gap-2">
         <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors flex-1 text-sm">{p.title}</h3>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-indigo-600">₹{p.basePrice.toLocaleString('en-IN')}</span>
          {p.discountPercentage > 0 && (
            <span className="text-[10px] text-gray-400 line-through">₹{(Math.round(p.basePrice / (1 - p.discountPercentage/100))).toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>

      <button 
        onClick={() => addToCart(p.id)}
        className="mt-auto w-full bg-indigo-50 text-indigo-600 py-2 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingBag size={14} /> Add to Cart
      </button>
    </div>
  </div>
);

const BackButton = () => (
  <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all mb-8 group">
    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
  </Link>
);

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [auctions, setAuctions] = useState<Auction[]>(mockAuctions);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [adviceHistory, setAdviceHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [adviceInput, setAdviceInput] = useState('');
  const [quickAddTrigger, setQuickAddTrigger] = useState<'NEW' | 'RESELLER' | null>(null);

  const [visibility, setVisibility] = useState({
    newArrivals: true,
    certifiedPreOwned: true,
    liveAuctions: true
  });

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };
  const handleSignup = (newUser: User) => setUsers(prev => [...prev, newUser]);
  
  const handleCreateUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUserInHub = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
  };

  const addToCart = (productId: string) => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.productId === productId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleUpdateUserStatus = (userId: string, status: VerificationStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verificationStatus: status } : u));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleAddProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const handleUpdateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const askAdvisor = async () => {
    if (!adviceInput.trim()) return;
    const userMsg = adviceInput;
    setAdviceHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setAdviceInput('');
    const aiResponse = await getGadgetAdvice(userMsg);
    setAdviceHistory(prev => [...prev, { role: 'ai', text: aiResponse || "Sorry, I couldn't process that." }]);
  };

  const handlePlaceBid = (auctionId: string, amount: number) => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    setAuctions(prev => prev.map(a => {
      if (a.id === auctionId) {
        const newBid = {
          id: `b${Date.now()}`,
          auctionId,
          userId: currentUser?.id || 'anon',
          userName: currentUser?.name || 'Anonymous',
          amount,
          timestamp: new Date().toISOString()
        };
        return { ...a, currentHighestBid: amount, bids: [newBid, ...a.bids] };
      }
      return a;
    }));
  };

  const handleQuickAdd = (condition: 'NEW' | 'RESELLER') => {
    setQuickAddTrigger(condition);
    navigate('/admin');
  };

  const Home = () => {
    const newItems = products.filter(p => !p.isBiddable && p.condition === 'NEW');
    const resellerItems = products.filter(p => !p.isBiddable && p.condition === 'RESELLER');
    
    const visibleCount = [visibility.newArrivals, visibility.certifiedPreOwned, visibility.liveAuctions].filter(Boolean).length;
    const gridColsClass = visibleCount === 3 ? 'lg:grid-cols-3' : visibleCount === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-1';

    return (
      <div className="space-y-12 pb-20 animate-in fade-in duration-500">
        <section className="relative h-[450px] overflow-hidden rounded-[40px] mx-4 sm:mx-8 mt-4 shadow-2xl text-white">
          <img 
            src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=1600" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.5]" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center px-8 text-center">
            <h1 className="text-4xl sm:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
              PREMIUM TECH HUB
            </h1>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl font-medium drop-shadow">
              Verified sellers, authentic electronics, and real-time live auctions.
            </p>
            <div className="flex gap-4">
              <Link to="/deals" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl hover:-translate-y-1">
                Shop Deals
              </Link>
              {/* FIXED: Respect Live Auctions visibility in Hero section */}
              {visibility.liveAuctions && (
                <Link to="/auctions" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-black hover:bg-white/20 transition-all hover:-translate-y-1">
                  Live Auctions
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4">
          <div className={`grid grid-cols-1 ${gridColsClass} gap-8 items-start`}>
            {visibility.newArrivals && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <PackageCheck className="text-green-600" size={24} /> New Arrivals
                  </h2>
                  <Link to="/deals" className="text-xs font-bold text-indigo-600 hover:underline">View All</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {newItems.slice(0, 4).map(p => <ProductCard key={p.id} p={p} addToCart={addToCart} />)}
                </div>
              </div>
            )}

            {visibility.certifiedPreOwned && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="text-amber-600" size={24} /> Pre-Owned
                  </h2>
                  <Link to="/deals" className="text-xs font-bold text-indigo-600 hover:underline">View All</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {resellerItems.length > 0 ? (
                    resellerItems.slice(0, 4).map(p => <ProductCard key={p.id} p={p} addToCart={addToCart} isReseller />)
                  ) : (
                    <div className="col-span-2 py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                      More arriving soon
                    </div>
                  )}
                </div>
              </div>
            )}

            {visibility.liveAuctions && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Gavel className="text-indigo-600" size={24} /> Live Auctions
                  </h2>
                  <Link to="/auctions" className="text-xs font-bold text-indigo-600 hover:underline">View All</Link>
                </div>
                <div className="space-y-4">
                  {auctions.map(a => {
                    const prod = products.find(p => p.id === a.productId);
                    if (!prod) return null;
                    return <AuctionCard key={a.id} auction={a} product={prod} />;
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  };

  const AboutPage = () => (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <BackButton />
      <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 p-16 text-white text-center">
          <h1 className="text-5xl font-black mb-6 tracking-tight">The ElectroHub Standard</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto font-medium">Building the world's most trusted marketplace for premium electronics, powered by verification and integrity.</p>
        </div>
        <div className="p-16 space-y-16">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-10 rounded-[32px] space-y-6 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner"><ShieldCheck size={32} /></div>
              <h3 className="text-2xl font-black text-gray-900">Verified Marketplace</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">We don't just list items; we verify people. Our mandatory ID-verification ensures that every bidder and seller is a real, high-trust entity.</p>
            </div>
            <div className="bg-gray-50 p-10 rounded-[32px] space-y-6 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner"><Gavel size={32} /></div>
              <h3 className="text-2xl font-black text-gray-900">Live Tech Auctions</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">Experience true market discovery with our real-time auction engine. Transparent, fair, and exclusively for high-value gadgets.</p>
            </div>
            <div className="bg-gray-50 p-10 rounded-[32px] space-y-6 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="bg-amber-100 text-amber-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner"><Award size={32} /></div>
              <h3 className="text-2xl font-black text-gray-900">Quality Certified</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">Our Certified Pre-Owned (CPO) tier is reserved for devices that pass a rigorous 50-point technical hub inspection.</p>
            </div>
          </section>

          <section className="space-y-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Our Core Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-6 p-8 border border-gray-100 rounded-[32px] hover:border-indigo-600 transition-all bg-white shadow-sm">
                <div className="bg-indigo-50 p-4 rounded-2xl shrink-0 h-min"><Zap className="text-indigo-600" size={24} /></div>
                <div>
                  <h4 className="font-black text-xl mb-2">Instant Liquidity for Sellers</h4>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">Sellers can choose between direct listings for stable pricing or auctions for rapid market-clearing liquidity. Our hub handles the heavy lifting.</p>
                </div>
              </div>
              <div className="flex gap-6 p-8 border border-gray-100 rounded-[32px] hover:border-indigo-600 transition-all bg-white shadow-sm">
                <div className="bg-amber-50 p-4 rounded-2xl shrink-0 h-min"><Shield size={24} className="text-amber-600" /></div>
                <div>
                  <h4 className="font-black text-xl mb-2">Secure Hub Escrow</h4>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">Funds are held by ElectroHub until the buyer verifies the device condition. We act as the ultimate guarantor of gadget transactions.</p>
                </div>
              </div>
              <div className="flex gap-6 p-8 border border-gray-100 rounded-[32px] hover:border-indigo-600 transition-all bg-white shadow-sm">
                {/* FIXED: Changed i-min to h-min */}
                <div className="bg-blue-50 p-4 rounded-2xl shrink-0 h-min"><MessageCircle size={24} className="text-blue-600" /></div>
                <div>
                  <h4 className="font-black text-xl mb-2">Smart AI Advisory</h4>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">Leverage Gemini AI to understand technical specs, compare fair market values, and get unbiased advice on your next high-ticket purchase.</p>
                </div>
              </div>
              <div className="flex gap-6 p-8 border border-gray-100 rounded-[32px] hover:border-indigo-600 transition-all bg-white shadow-sm">
                <div className="bg-green-50 p-4 rounded-2xl shrink-0 h-min"><Globe size={24} className="text-green-600" /></div>
                <div>
                  <h4 className="font-black text-xl mb-2">Pan-India Hub Logistics</h4>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">We provide white-glove shipping with full insurance for high-value items, ensuring your gadget arrives exactly as it left the seller.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => {
    const [submitted, setSubmitted] = useState(false);
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <BackButton />
        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="bg-indigo-600 p-16 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-5xl font-black mb-8">Reach Out to the Hub</h2>
              <p className="text-indigo-100 mb-10 leading-relaxed font-bold text-lg">Have technical queries or need assistance with a high-value bid? Our specialized support team is online 24/7.</p>
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20"><Mail size={24} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Official Support</span>
                    <span className="font-black text-xl">hub-support@electrohub.com</span>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20"><Globe size={24} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Web Portal</span>
                    <span className="font-black text-xl">www.electrohub.com/help</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-12 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3">Innovation Hub HQ</p>
              <p className="text-sm font-bold opacity-80 leading-relaxed">Tech Precinct 7, Electronic City, phase 2, Bangalore, KA 560100</p>
            </div>
            <Cpu className="absolute -bottom-20 -right-20 w-80 h-80 opacity-5 rotate-12" />
          </div>
          <div className="p-16">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in">
                <div className="bg-green-100 text-green-600 p-8 rounded-[40px] shadow-inner"><CheckCircle size={80} /></div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900 mb-2">Inquiry Received</h3>
                  <p className="text-gray-500 font-medium">A hub specialist will contact you shortly.</p>
                </div>
                <button onClick={() => setSubmitted(false)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100">Send another</button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                  <input required type="text" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold transition-all" placeholder="Johnathan Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Verified Email</label>
                  <input required type="email" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold transition-all" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Message for the Hub</label>
                  <textarea required rows={5} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold resize-none transition-all" placeholder="How can our tech experts assist you today?" />
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 group">
                  Submit Inquiry <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CommunityView = () => (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <BackButton />
      <div className="flex flex-col gap-10">
        <div className="bg-gray-900 p-16 rounded-[50px] text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-5xl font-black mb-6 flex items-center gap-4 tracking-tight">The Tech Circle <Award className="text-amber-500" /></h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">Our exclusive circle of gadget reviewers, auction winners, and tech pioneers. Share your workspace, drop leaks, and build reputation.</p>
            <div className="flex gap-4 mt-10">
              <button className="bg-indigo-600 px-8 py-3 rounded-2xl font-black shadow-xl shadow-indigo-600/20">Create Post</button>
              <button className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-2xl font-black border border-white/10">Browse Circles</button>
            </div>
          </div>
          <UsersIcon className="absolute -bottom-20 -right-20 w-96 h-96 text-white opacity-5" />
          <div className="absolute top-10 right-10 flex -space-x-4">
            {[1,2,3,4].map(i => (
              <img key={i} src={`https://picsum.photos/seed/user${i}/100`} className="w-14 h-14 rounded-full border-4 border-gray-900 shadow-xl" alt="Member" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6 hover:shadow-2xl transition-all hover:-translate-y-2 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/face${i+20}/100`} className="w-12 h-12 rounded-2xl" alt="User" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Alpha_Tech_{i}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Verified Collector</p>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-indigo-600 transition-colors"><Share2 size={18} /></button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">Finally completed the custom build from components won at the Hub Auctions! The M3 Max integrated with this external GPU enclosure is a productivity beast. 🔌💻✨</p>
              <div className="relative group/img overflow-hidden rounded-[32px]">
                <img src={`https://picsum.photos/seed/gadget${i+50}/600/400`} className="w-full h-56 object-cover group-hover/img:scale-110 transition-transform duration-700" alt="Setup" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-6">
                  <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-indigo-600 transition-all"><Heart size={20} className="fill-current" /> {120 + i*42}</button>
                  <button className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-indigo-600 transition-all"><MessageSquare size={20} /> {8 + i}</button>
                </div>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">4h ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SupportView = () => (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <BackButton />
      <div className="flex flex-col gap-10">
        <div className="bg-white rounded-[50px] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="p-12 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50/50 gap-8">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="bg-indigo-600 p-5 rounded-[24px] text-white shadow-xl shadow-indigo-100"><LifeBuoy size={40} /></div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Support Innovation Hub</h2>
                <p className="text-sm text-green-600 font-bold flex items-center justify-center md:justify-start gap-2 mt-1"><span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-green-500 shadow-lg" /> Dedicated Hub Specialists Online</p>
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none text-xs font-black text-gray-500 uppercase tracking-[0.2em] bg-white border border-gray-200 px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all">My Tickets</button>
              <button className="flex-1 md:flex-none text-xs font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-8 py-4 rounded-2xl hover:bg-indigo-100 transition-all">Knowledge Base</button>
            </div>
          </div>
          <div className="p-16 space-y-12">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="p-10 border-4 border-indigo-600 bg-indigo-50/20 rounded-[40px] space-y-6 relative group overflow-hidden">
                 <div className="relative z-10 space-y-6">
                   <h3 className="text-2xl font-black text-gray-900">Live Agent Chat</h3>
                   <p className="text-gray-500 font-medium leading-relaxed">Instant connection with a human tech specialist for high-priority auction or escrow disputes.</p>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-white w-max px-3 py-1 rounded-full shadow-sm">Response Time: &lt; 2 Minutes</div>
                   <button onClick={() => setAdvisorOpen(true)} className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-100 hover:scale-[1.02] transition-all">Initiate Live Session</button>
                 </div>
                 <MessageCircle className="absolute -bottom-10 -right-10 w-48 h-48 text-indigo-600 opacity-5 group-hover:rotate-12 transition-transform duration-500" />
               </div>
               <div className="p-10 border-4 border-gray-100 bg-white rounded-[40px] space-y-6 relative group overflow-hidden">
                 <div className="relative z-10 space-y-6">
                   <h3 className="text-2xl font-black text-gray-900">Hub Ticket System</h3>
                   <p className="text-gray-500 font-medium leading-relaxed">For bulk procurement queries, corporate verification, or official returns. Full tracking guaranteed.</p>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 w-max px-3 py-1 rounded-full border border-gray-100">Response Time: ~ 24 Hours</div>
                   <button className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-gray-200 hover:scale-[1.02] transition-all">Open Formal Ticket</button>
                 </div>
                 <FileQuestion className="absolute -bottom-10 -right-10 w-48 h-48 text-gray-900 opacity-5 group-hover:rotate-12 transition-transform duration-500" />
               </div>
             </div>

             <div className="space-y-6">
               <h4 className="text-xs font-black uppercase text-gray-400 tracking-[0.3em] px-4">Automated Hub Solutions</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   'How does the Hub Escrow process work?', 
                   'Return policy for Certified Pre-Owned items', 
                   'Auction bidding rules and bid retraction penalties',
                   'Seller verification levels and commission tiers',
                   'International shipping for enterprise gadgets',
                   'Reporting a suspicious listing or bidder'
                 ].map(q => (
                   <button key={q} className="group w-full text-left p-6 flex justify-between items-center font-bold text-gray-700 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-indigo-600 rounded-[28px] transition-all">
                     <span className="text-sm pr-4">{q}</span>
                     <ChevronRight size={20} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                   </button>
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileView = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<User | null>(currentUser);

    if (!currentUser) return <Navigate to="/auth" />;

    const handleSave = () => {
      if (editData) {
        handleUpdateUserInHub(editData);
        setIsEditing(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <BackButton />
        <div className="bg-white rounded-[50px] shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-indigo-600 p-12 text-white relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="bg-white/20 p-6 rounded-[32px] backdrop-blur-md border border-white/20 shadow-2xl">
                <UserIcon size={64} className="text-white" />
              </div>
              <div className="text-center md:text-left flex-1">
                {isEditing ? (
                  <input type="text" value={editData?.name} onChange={e => setEditData({...editData!, name: e.target.value})} className="text-4xl font-black bg-white/10 border-none rounded-xl px-4 py-2 w-full outline-none focus:ring-4 focus:ring-white/20" />
                ) : (
                  <h1 className="text-4xl font-black mb-2 tracking-tight">{currentUser.name}</h1>
                )}
                {isEditing ? (
                  <input type="email" value={editData?.email} onChange={e => setEditData({...editData!, email: e.target.value})} className="text-lg font-bold bg-white/10 border-none rounded-xl px-4 py-2 w-full mt-2 outline-none focus:ring-4 focus:ring-white/20" />
                ) : (
                  <p className="text-indigo-100 font-bold text-lg opacity-80">{currentUser.email}</p>
                )}
                <div className="flex gap-4 mt-6 justify-center md:justify-start">
                   <span className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Member since {currentUser.createdAt}</span>
                </div>
              </div>
              <div className="ml-auto text-center md:text-right shrink-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Trust Level</p>
                <div className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl inline-block ${
                  currentUser.verificationStatus === VerificationStatus.APPROVED ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {currentUser.verificationStatus}
                </div>
              </div>
            </div>
            <Cpu className="absolute -top-10 -left-10 w-64 h-64 text-white opacity-5 rotate-45" />
          </div>
          <div className="p-16 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Contact Node</label>
              {isEditing ? (
                <input type="tel" value={editData?.mobile} onChange={e => setEditData({...editData!, mobile: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-black text-lg" />
              ) : (
                <p className="text-2xl font-black text-gray-900">{currentUser.mobile}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Platform Role</label>
              <p className="text-2xl font-black text-gray-900">{currentUser.role === UserRole.ADMIN ? 'System Administrator' : 'Verified Member'}</p>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Primary Delivery Hub</label>
              {isEditing ? (
                <textarea value={editData?.address} onChange={e => setEditData({...editData!, address: e.target.value})} rows={2} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-black text-lg resize-none" />
              ) : (
                <p className="text-2xl font-black text-gray-900 leading-relaxed">{currentUser.address}</p>
              )}
            </div>
            {isEditing && (
               <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Update Security Key (Password)</label>
                <input type="password" value={editData?.password} onChange={e => setEditData({...editData!, password: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-black text-lg" placeholder="••••••••" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Auth Provider</label>
              <p className="text-2xl font-black text-gray-900">Email/OAuth Verified</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Identity Document</label>
              <p className="text-2xl font-black text-gray-900">{currentUser.idType || 'Aadhar (Masked)'}</p>
            </div>
          </div>
          <div className="p-12 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
             <button className="text-gray-400 font-black text-xs uppercase tracking-widest hover:text-red-500 transition-colors">Request Account Deletion</button>
             {isEditing ? (
               <div className="flex gap-4">
                 <button onClick={() => setIsEditing(false)} className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 bg-white border border-gray-200">Cancel</button>
                 <button onClick={handleSave} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2"><Save size={16} /> Save Hub Profile</button>
               </div>
             ) : (
               <button onClick={() => setIsEditing(true)} className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl border border-indigo-50 hover:bg-indigo-50 transition-all">Edit Hub Profile</button>
             )}
          </div>
        </div>
      </div>
    );
  };

  const CartView = () => {
    if (!currentUser) return <Navigate to="/auth" />;
    const cartProducts = cart.map(item => {
      const prod = products.find(p => p.id === item.productId);
      return { ...prod, quantity: item.quantity };
    });
    const subtotal = cartProducts.reduce((acc, curr) => acc + (curr.basePrice || 0) * curr.quantity, 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <BackButton />
        <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Your Gadget Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[50px] border border-gray-100 shadow-sm animate-in fade-in">
            <div className="bg-indigo-50 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8"><ShoppingBag size={48} className="text-indigo-200" /></div>
            <h2 className="text-2xl font-black text-gray-400">Cart is empty</h2>
            <Link to="/" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest mt-8 inline-block shadow-2xl shadow-indigo-100 hover:-translate-y-1 transition-all">Return to Hub</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartProducts.map(p => (
                <div key={p.id} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-8 hover:shadow-xl transition-all">
                  <div className="w-32 h-32 bg-gray-50 rounded-[24px] overflow-hidden shrink-0"><img src={p.images?.[0]} className="w-full h-full object-cover" alt={p.title} /></div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-black text-gray-900">{p.title}</h3>
                    <p className="text-sm text-indigo-600 font-black uppercase tracking-widest mt-1">{p.brand}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-6 mt-6">
                      <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                        <button onClick={() => updateCartQuantity(p.id!, -1)} className="p-3 text-gray-400 hover:text-indigo-600 transition-colors"><Minus size={18} /></button>
                        <span className="w-12 text-center font-black text-lg">{p.quantity}</span>
                        <button onClick={() => updateCartQuantity(p.id!, 1)} className="p-3 text-gray-400 hover:text-indigo-600 transition-colors"><Plus size={18} /></button>
                      </div>
                      <button onClick={() => removeFromCart(p.id!)} className="text-gray-300 hover:text-red-500 transition-all p-2"><Trash2 size={22} /></button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-gray-900 tracking-tight">₹{((p.basePrice || 0) * p.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Hub Summary</h2>
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]"><span>Subtotal</span><span className="text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]"><span>Hub GST (12%)</span><span className="text-gray-900">₹{tax.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]"><span>Insured Delivery</span><span className="text-green-600">FREE</span></div>
                  <div className="h-px bg-gray-50 my-6" />
                  <div className="flex justify-between items-end"><span className="text-lg font-black text-gray-400 uppercase tracking-widest">Total</span><span className="text-4xl font-black text-indigo-600 tracking-tight">₹{total.toLocaleString('en-IN')}</span></div>
                </div>
                <button onClick={() => alert('Order Placed Successfully via Hub Escrow!')} className="w-full bg-indigo-600 text-white py-6 rounded-[28px] font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95">COMPLETE HUB CHECKOUT</button>
                <Cpu className="absolute -bottom-10 -right-10 w-40 h-40 text-indigo-600 opacity-5 -rotate-12" />
              </div>
              <div className="bg-gray-900 p-8 rounded-[40px] text-white space-y-4">
                 <div className="flex items-center gap-3"><ShieldCheck className="text-indigo-400" /> <span className="font-black text-sm uppercase tracking-widest">Buyer Protection Hub</span></div>
                 <p className="text-xs text-gray-400 font-medium leading-relaxed">Your payment is held in Hub Escrow and only released to the seller after your confirmation of gadget condition.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const AuctionDetail = () => {
    const { id } = useParams();
    const auction = auctions.find(a => a.id === id);
    const product = products.find(p => p.id === auction?.productId);
    const [activeImg, setActiveImg] = useState(0);
    const [bidAmount, setBidAmount] = useState<number>(0);
    if (!auction || !product) return <div className="p-20 text-center font-black text-2xl text-gray-400">Hub Auction Not Found</div>;
    const minBid = auction.currentHighestBid + 1000;
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <BackButton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="rounded-[50px] overflow-hidden shadow-2xl bg-white aspect-square flex items-center justify-center border border-gray-100 p-10 group">
                <img src={product.images[activeImg]} alt={product.title} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImg(idx)} className={`flex-shrink-0 w-24 h-24 rounded-3xl overflow-hidden border-4 transition-all ${activeImg === idx ? 'border-indigo-600 scale-105 shadow-xl' : 'border-transparent opacity-50 grayscale hover:grayscale-0'}`}>
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-10">
            <div className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8">
                 <div className="flex items-center gap-2 text-indigo-600 font-black bg-indigo-50 px-5 py-2 rounded-2xl text-[10px] uppercase tracking-widest shadow-sm animate-pulse">
                   <Gavel size={16} /> LIVE BIDDING
                 </div>
               </div>
               <div className="mb-10 pt-4">
                 <div className="flex items-center gap-3 mb-4">
                   <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs">{product.brand}</span>
                   <span className="text-gray-200">|</span>
                   <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${product.condition === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{product.condition}</span>
                 </div>
                 <h1 className="text-5xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">{product.title}</h1>
                 <p className="text-gray-500 leading-relaxed text-lg font-medium">{product.description}</p>
               </div>
               <div className="grid grid-cols-2 gap-6 mb-12">
                 <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-inner">
                   <p className="text-[10px] text-gray-400 font-black uppercase mb-3 tracking-widest">Current Bid</p>
                   <p className="text-4xl font-black text-indigo-600 tracking-tight">₹{auction.currentHighestBid.toLocaleString('en-IN')}</p>
                 </div>
                 <div className="bg-indigo-600 p-8 rounded-[32px] shadow-2xl shadow-indigo-100 text-white">
                   <p className="text-[10px] text-indigo-200 font-black uppercase mb-3 tracking-widest">Time Remaining</p>
                   <p className="text-4xl font-black tracking-tight">18h 42m</p>
                 </div>
               </div>
               <div className="space-y-6">
                 <div className="flex flex-col gap-3">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Your Strategic Bid (Minimum: ₹{minBid.toLocaleString('en-IN')})</label>
                   <div className="relative group">
                     <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-300 text-3xl group-focus-within:text-indigo-600 transition-colors">₹</span>
                     <input 
                       type="number" 
                       placeholder={minBid.toString()} 
                       className="w-full pl-16 pr-8 py-7 bg-gray-50 border-4 border-gray-50 rounded-[32px] focus:border-indigo-600 focus:bg-white focus:ring-0 font-black text-4xl outline-none transition-all shadow-inner" 
                       value={bidAmount || ''} 
                       onChange={(e) => setBidAmount(Number(e.target.value))} 
                     />
                   </div>
                 </div>
                 <button onClick={() => { if(bidAmount >= minBid) handlePlaceBid(auction.id, bidAmount); else alert(`Minimum bid is ₹${minBid}`); }} className="w-full bg-gray-900 text-white py-7 rounded-[32px] font-black text-2xl hover:bg-indigo-600 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4 group">
                   <Gavel size={32} className="group-hover:rotate-12 transition-transform" /> CONFIRM BID
                 </button>
                 <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">Bidding constitutes a legally binding purchase contract</p>
               </div>
               <Cpu className="absolute -bottom-20 -left-20 w-80 h-80 text-gray-900 opacity-5 rotate-45" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      <Navbar 
        currentUser={currentUser} cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
        notifications={notifications} onMarkRead={markNotificationRead} 
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onLogout={handleLogout}
        visibility={visibility}
      />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentUser={currentUser} 
        onQuickAdd={handleQuickAdd} 
        visibility={visibility}
      />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth users={users} onLogin={handleLogin} onSignup={handleSignup} />} />
          <Route path="/auctions" element={<div className="p-12 max-w-7xl mx-auto"><BackButton /><h1 className="text-5xl font-black mb-12 tracking-tight">Live Hub Auctions</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-10">{auctions.map(a => <AuctionCard key={a.id} auction={a} product={products.find(p => p.id === a.productId)!} />)}</div></div>} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/admin" element={
            currentUser?.role === UserRole.ADMIN ? (
              <div className="p-4 sm:p-8">
                <BackButton />
                <AdminDashboard 
                  users={users} products={products} 
                  onUpdateUser={handleUpdateUserStatus} onDeleteUser={handleDeleteUser} 
                  onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} 
                  onCreateUser={handleCreateUser}
                  quickAdd={quickAddTrigger} resetQuickAdd={() => setQuickAddTrigger(null)} 
                  visibility={visibility} onUpdateVisibility={(v) => setVisibility(v)}
                />
              </div>
            ) : <Navigate to="/auth" />
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/community" element={<CommunityView />} />
          <Route path="/support" element={<SupportView />} />
          <Route path="/deals" element={
            <div className="p-12 max-w-7xl mx-auto">
              <BackButton />
              <div className="flex items-center gap-6 mb-16"><div className="bg-red-100 p-6 rounded-[32px] shadow-lg shadow-red-100"><Tag size={40} className="text-red-600" /></div><h1 className="text-5xl font-black text-gray-900 tracking-tight">Hot Hub Deals</h1></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">{products.filter(p => !p.isBiddable && p.discountPercentage > 0).map(p => <ProductCard key={p.id} p={p} addToCart={addToCart} />)}</div>
            </div>
          } />
        </Routes>
      </main>
      <footer className="bg-gray-900 text-white py-20 px-4 mt-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
          <div className="space-y-8">
            <div className="flex items-center gap-3"><div className="bg-indigo-600 p-2 rounded-xl"><Cpu className="h-10 w-10 text-white" /></div><span className="text-3xl font-black tracking-tighter uppercase">ELECTRO<span className="text-indigo-500">HUB</span></span></div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">The next generation marketplace for high-end electronics. Redefining trust through verified commerce.</p>
          </div>
          <div><h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-indigo-500">Marketplace</h4><ul className="space-y-4 text-gray-400 text-sm font-bold">
            {visibility.liveAuctions && <li><Link to="/auctions" className="hover:text-white transition-colors">Live Auctions</Link></li>}
            <li><Link to="/deals" className="hover:text-white transition-colors">Market Deals</Link></li>
            <li><Link to="/community" className="hover:text-white transition-colors">Tech Community</Link></li>
          </ul></div>
          <div><h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-indigo-500">Support Hub</h4><ul className="space-y-4 text-gray-400 text-sm font-bold"><li><Link to="/contact" className="hover:text-white transition-colors">Inquiry Desk</Link></li><li><Link to="/support" className="hover:text-white transition-colors">Help Center</Link></li><li><Link to="/about" className="hover:text-white transition-colors">Verification Process</Link></li></ul></div>
          <div><h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-indigo-500">Legal</h4><ul className="space-y-4 text-gray-400 text-sm font-bold"><li><span className="hover:text-white cursor-pointer transition-colors">Privacy Charter</span></li><li><span className="hover:text-white cursor-pointer transition-colors">Escrow Terms</span></li><li><span className="hover:text-white cursor-pointer transition-colors">Bidding Policy</span></li></ul></div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] relative z-10">
          &copy; 2024 ElectroHub Innovations Hub. All Rights Reserved.
        </div>
        <Cpu className="absolute -bottom-20 -left-20 w-80 h-80 text-white opacity-5 rotate-12" />
      </footer>
      {advisorOpen && (
        <div className="fixed bottom-24 right-8 w-96 max-w-[calc(100vw-2rem)] h-[550px] bg-white rounded-[40px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] z-[100] flex flex-col animate-in slide-in-from-bottom-8 duration-500 overflow-hidden border border-gray-100">
          <div className="bg-indigo-600 p-6 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
               <div className="bg-white/20 p-2 rounded-xl"><MessageSquare size={20} /></div>
               <span className="font-black uppercase text-xs tracking-widest">Hub Smart Advisor</span>
            </div>
            <button onClick={() => setAdvisorOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition-all"><XCircle size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            <div className="bg-indigo-50 p-4 rounded-3xl text-xs font-medium text-indigo-700 leading-relaxed border border-indigo-100 shadow-sm">Welcome to the Hub Advisory! I can compare specs, explain auction strategies, or help you find the best value for your budget.</div>
            {adviceHistory.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-${m.role === 'user' ? 'right' : 'left'}-4`}>
                <div className={`p-4 rounded-[24px] text-xs font-bold leading-relaxed shadow-sm max-w-[85%] ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-white border-t border-gray-50 flex gap-3 items-center">
            <input 
              type="text" 
              value={adviceInput} 
              onChange={e => setAdviceInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && askAdvisor()} 
              placeholder="Query tech specs..." 
              className="flex-1 bg-gray-50 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-indigo-100 font-bold text-sm transition-all" 
            />
            <button onClick={askAdvisor} className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-indigo-100 hover:scale-110 active:scale-95 transition-all"><Send size={20} /></button>
          </div>
        </div>
      )}
      {!advisorOpen && (<button onClick={() => setAdvisorOpen(true)} className="fixed bottom-10 right-10 bg-indigo-600 text-white p-5 rounded-[24px] shadow-2xl z-50 hover:scale-110 active:scale-95 transition-all animate-bounce"><MessageSquare size={28} /></button>)}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

const XCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
);

const RefreshCcw = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
);

export default App;
