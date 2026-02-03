
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { mockUsers, mockProducts, mockAuctions, mockReviews, mockNotifications } from './mockData.ts';
import { User, Product, Auction, VerificationStatus, UserRole, CartItem, Review, Notification, NotificationType } from './types.ts';
import Navbar from './components/Navbar.tsx';
import Sidebar from './components/Sidebar.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import AuctionCard from './components/AuctionCard.tsx';
import Auth from './components/Auth.tsx';
import { getGadgetAdvice } from './services/geminiService.ts';
import { 
  Send, MessageSquare, ShoppingBag, ArrowRight, ShieldCheck, Heart, Trash2, Plus, Minus, 
  Info, Gavel, TrendingUp, AlertTriangle, Cpu, Star, Layers, PackageCheck, Tag, ChevronLeft,
  LifeBuoy, Mail, Users as UsersIcon, Eye, EyeOff, User as UserIcon, CheckCircle, Globe, Shield, Zap,
  MessageCircle, HelpCircle, FileQuestion, ChevronRight, Share2, Award, Phone, MapPin, Lock,
  Save, XCircle
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

  // ... (Rest of components: AboutPage, ContactPage, CommunityView, etc.)
  
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
          {/* ... more routes */}
        </Routes>
      </main>
      {/* ... Footer and Advisor */}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
