
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
  Info, Gavel, TrendingUp, AlertTriangle, AlertCircle, Cpu, Star, Layers, PackageCheck, Tag, ChevronLeft,
  LifeBuoy, Mail, Users as UsersIcon, Eye, EyeOff, User as UserIcon, CheckCircle, Globe, Shield, Zap,
  MessageCircle, HelpCircle, FileQuestion, ChevronRight, Share2, Award, Phone, MapPin, Lock,
  Save, XCircle, Github, Twitter, Linkedin, Headphones, Search
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

const AboutUs = () => (
  <div className="page-enter p-8 max-w-5xl mx-auto space-y-16 pb-24">
    <BackButton />
    <section className="text-center space-y-6">
      <div className="inline-block bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">The Future of Commerce</div>
      <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">Revolutionizing Tech <br/><span className="text-indigo-600">Trust Since 2024.</span></h1>
      <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">ElectroHub is more than a marketplace. We are a high-trust ecosystem built for enthusiasts who demand authenticity and transparency in the electronics market.</p>
    </section>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { icon: <ShieldCheck size={32} />, title: 'Verified Only', desc: 'Every seller undergoes a rigorous identity and product quality verification process.' },
        { icon: <Globe size={32} />, title: 'Global Sourcing', desc: 'Access exclusive tech from around the world, handled with white-glove logistics.' },
        { icon: <Award size={32} />, title: 'Expert Advice', desc: 'Our AI-driven Gemini advisors help you compare specs and make the best buying decisions.' }
      ].map((item, idx) => (
        <div key={idx} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
          <div className="text-indigo-600 mb-6 bg-indigo-50 w-16 h-16 flex items-center justify-center rounded-2xl">{item.icon}</div>
          <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
          <p className="text-gray-500 font-medium text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>

    <section className="bg-gray-900 rounded-[50px] p-12 text-white overflow-hidden relative">
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl font-black tracking-tight">Our High-Trust Architecture</h2>
          <p className="text-gray-400 font-medium leading-relaxed">We leverage a decentralized verification protocol to ensure that refurbished items are accurately graded and new items are 100% authentic. No more guessing, no more fake reviews.</p>
          <div className="flex gap-4">
            <div className="bg-white/10 px-6 py-3 rounded-2xl">
              <span className="block text-2xl font-black">50k+</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Verified Users</span>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-2xl">
              <span className="block text-2xl font-black">₹500Cr+</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Trade</span>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" className="rounded-[32px] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500" alt="Cybersecurity" />
        </div>
      </div>
    </section>
  </div>
);

const ContactUs = () => (
  <div className="page-enter p-8 max-w-6xl mx-auto space-y-12 pb-24">
    <BackButton />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">Get in Touch</h1>
          <p className="text-gray-500 font-medium mt-4">Our specialized tech support team is ready to assist you with any inquiries regarding orders, verification, or technical specs.</p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-6 items-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-indigo-600 text-white p-4 rounded-2xl"><Mail size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Us</p>
              <p className="text-lg font-bold text-gray-900">support@electrohub.tech</p>
            </div>
          </div>
          <div className="flex gap-6 items-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-indigo-600 text-white p-4 rounded-2xl"><Phone size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call Us</p>
              <p className="text-lg font-bold text-gray-900">+91 (800) 123-4567</p>
            </div>
          </div>
          <div className="flex gap-6 items-center p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-indigo-600 text-white p-4 rounded-2xl"><MapPin size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visit Hub HQ</p>
              <p className="text-lg font-bold text-gray-900">Silicon Square, Block 4, Bangalore, KA</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all"><Twitter size={24} /></button>
          <button className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all"><Linkedin size={24} /></button>
          <button className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all"><Github size={24} /></button>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-xl space-y-6">
        <h3 className="text-2xl font-black text-gray-900">Send a Message</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Your Name</label>
            <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-100 outline-none font-bold" placeholder="Alex Rivera" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Email Address</label>
            <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-100 outline-none font-bold" placeholder="alex@example.com" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Message Subject</label>
            <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-100 outline-none font-bold appearance-none">
              <option>Technical Support</option>
              <option>Order Verification</option>
              <option>Seller Partnership</option>
              <option>Other Inquiry</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Message</label>
            <textarea rows={4} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-100 outline-none font-bold resize-none" placeholder="How can we help you today?"></textarea>
          </div>
          <button className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
            <Send size={24} /> Send Message
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Community = () => (
  <div className="page-enter p-8 max-w-6xl mx-auto space-y-16 pb-24">
    <BackButton />
    <section className="text-center space-y-8">
      <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">
        <UsersIcon size={16} /> 52,491 Members Online
      </div>
      <h1 className="text-6xl font-black text-gray-900 tracking-tighter">The World's Largest <br/><span className="text-indigo-600">Enthusiast Network.</span></h1>
      <p className="text-gray-500 text-lg max-w-3xl mx-auto font-medium leading-relaxed">Join the inner circle of tech collectors, verified resellers, and extreme enthusiasts. Get early access to auctions and exclusive hub deals.</p>
    </section>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-12 rounded-[50px] border border-gray-100 shadow-sm space-y-6 flex flex-col justify-between hover:shadow-2xl transition-all">
        <div className="space-y-4">
          <div className="bg-indigo-600 text-white w-20 h-20 rounded-[28px] flex items-center justify-center shadow-xl shadow-indigo-100"><MessageCircle size={40} /></div>
          <h3 className="text-3xl font-black text-gray-900">Join the Hub Discord</h3>
          <p className="text-gray-500 font-medium leading-relaxed">Real-time alerts for rare gadget drops, live auction strategy rooms, and peer-to-peer tech support.</p>
        </div>
        <button className="bg-indigo-600 text-white w-full py-5 rounded-3xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-50 flex items-center justify-center gap-3">
          <Share2 size={24} /> Connect Discord
        </button>
      </div>

      <div className="bg-gray-900 p-12 rounded-[50px] text-white space-y-6 flex flex-col justify-between hover:shadow-2xl transition-all">
        <div className="space-y-4">
          <div className="bg-white text-indigo-600 w-20 h-20 rounded-[28px] flex items-center justify-center shadow-xl shadow-black/20"><Star size={40} /></div>
          <h3 className="text-3xl font-black">Elite Hub Rewards</h3>
          <p className="text-gray-400 font-medium leading-relaxed">Earn Hub Points for every verified transaction. Redeem points for zero-commission bidding vouchers.</p>
        </div>
        <button className="bg-white text-indigo-600 w-full py-5 rounded-3xl font-black text-lg hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center gap-3">
          <Award size={24} /> Explore Rewards
        </button>
      </div>
    </div>

    <section className="bg-indigo-600 rounded-[50px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="space-y-4 max-w-md">
        <h2 className="text-4xl font-black tracking-tight">Weekly Hub Digest</h2>
        <p className="text-indigo-100 font-medium">Get a curated list of upcoming high-value auctions and price trends directly in your inbox.</p>
      </div>
      <div className="flex-1 w-full max-w-lg">
        <div className="relative">
          <input type="email" placeholder="Enter your email" className="w-full bg-white/10 border-2 border-white/20 rounded-3xl px-8 py-6 text-lg font-black text-white placeholder:text-indigo-200 focus:bg-white/20 outline-none transition-all" />
          <button className="absolute right-4 top-4 bottom-4 bg-white text-indigo-600 px-8 rounded-2xl font-black hover:bg-indigo-50 transition-all">Subscribe</button>
        </div>
      </div>
    </section>
  </div>
);

const Support = () => {
  const [search, setSearch] = useState('');
  const faqs = [
    { q: "How does the verification process work?", a: "Every user must upload government-issued ID. For sellers, we additionally verify product serial numbers against global databases to ensure authenticity." },
    { q: "What is the reserve price in an auction?", a: "The reserve price is the minimum amount a seller is willing to accept. If the bidding doesn't reach this price, the item isn't sold." },
    { q: "How are shipping costs calculated?", a: "Shipping is handled by our white-glove logistics partners. Costs depend on weight, fragility, and destination, shown clearly before you bid." },
    { q: "Can I return a certified pre-owned item?", a: "Yes, all reseller items come with a 48-hour 'Trust Guarantee'. If the item doesn't match the description, we issue a full refund." }
  ];

  return (
    <div className="page-enter p-8 max-w-5xl mx-auto space-y-12 pb-24">
      <BackButton />
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-black text-gray-900 tracking-tighter">Support Hub</h1>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for answers..." 
            className="w-full pl-16 pr-8 py-6 bg-white border border-gray-100 rounded-[32px] text-lg font-bold shadow-xl shadow-gray-100 outline-none focus:ring-4 focus:ring-indigo-100" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-gray-900 px-2 flex items-center gap-2">
            <HelpCircle className="text-indigo-600" /> Frequently Asked
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:border-indigo-600 transition-all cursor-pointer group">
                <h4 className="font-black text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{faq.q}</h4>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-gray-900 rounded-[50px] p-10 text-white space-y-8">
             <div className="flex items-center gap-4">
               <div className="bg-indigo-600 p-4 rounded-2xl"><Headphones size={32} /></div>
               <h3 className="text-3xl font-black">24/7 Live Support</h3>
             </div>
             <p className="text-gray-400 font-medium leading-relaxed">Verified members get instant access to our priority support line for high-value transaction assistance.</p>
             <button className="w-full bg-white text-indigo-600 py-5 rounded-[24px] font-black text-lg hover:bg-gray-100 transition-all">Start Live Chat</button>
           </div>

           <div className="bg-indigo-50 rounded-[40px] p-10 border border-indigo-100 space-y-6">
             <h3 className="text-2xl font-black text-indigo-700">Safety Center</h3>
             <ul className="space-y-4">
               {[
                 { icon: <Shield size={20} />, text: 'Reporting Fraudulent Listings' },
                 { icon: <Lock size={20} />, text: 'Securing Your Hub Account' },
                 { icon: <AlertCircle size={20} />, text: 'Payment Protection Policy' }
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-indigo-600 font-bold hover:translate-x-2 transition-transform cursor-pointer">
                   {item.icon} <span>{item.text}</span> <ChevronRight size={16} className="ml-auto" />
                 </li>
               ))}
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

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

  const handleQuickAdd = (condition: 'NEW' | 'RESELLER') => {
    setQuickAddTrigger(condition);
    navigate('/admin');
  };

  const askAdvisor = async () => {
    if (!adviceInput.trim()) return;
    const userMsg = adviceInput;
    setAdviceHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setAdviceInput('');
    const aiResponse = await getGadgetAdvice(userMsg);
    setAdviceHistory(prev => [...prev, { role: 'ai', text: aiResponse || "I'm sorry, I'm having trouble thinking right now." }]);
  };

  const Home = () => {
    const newItems = products.filter(p => !p.isBiddable && p.condition === 'NEW');
    const resellerItems = products.filter(p => !p.isBiddable && p.condition === 'RESELLER');
    
    const visibleCount = [visibility.newArrivals, visibility.certifiedPreOwned, visibility.liveAuctions].filter(Boolean).length;
    const gridColsClass = visibleCount === 3 ? 'lg:grid-cols-3' : visibleCount === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-1';

    return (
      <div className="page-enter space-y-12 pb-20">
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

  const ProfileView = () => {
    if (!currentUser) return <Navigate to="/auth" />;
    return (
      <div className="page-enter p-8 max-w-4xl mx-auto space-y-8">
        <BackButton />
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16" />
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            <div className="w-40 h-40 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white text-6xl font-black shadow-2xl shadow-indigo-200 shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{currentUser.name}</h1>
                <p className="text-indigo-600 font-bold mt-1">{currentUser.email}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Status</p>
                  <p className="font-bold flex items-center gap-2">
                    {currentUser.verificationStatus === VerificationStatus.APPROVED ? 
                      <><CheckCircle size={16} className="text-green-600" /> Verified</> : 
                      <><AlertTriangle size={16} className="text-amber-500" /> Pending Verification</>}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Account Role</p>
                  <p className="font-bold text-gray-700 capitalize">{currentUser.role.toLowerCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CartView = () => {
    const cartProducts = cart.map(item => ({
      ...products.find(p => p.id === item.productId)!,
      quantity: item.quantity
    })).filter(p => !!p.id);

    const total = cartProducts.reduce((acc, p) => acc + (p.basePrice * p.quantity), 0);

    return (
      <div className="page-enter p-8 max-w-4xl mx-auto space-y-8">
        <BackButton />
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shopping Bag</h1>
        {cartProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
            <p className="text-gray-500 font-bold text-lg">Your bag is empty.</p>
            <Link to="/" className="text-indigo-600 font-black mt-4 inline-block hover:underline">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              {cartProducts.map(p => (
                <div key={p.id} className="p-6 flex items-center gap-6 border-b border-gray-50 last:border-0 group hover:bg-gray-50/50 transition-colors">
                  <img src={p.images[0]} className="w-20 h-20 object-cover rounded-2xl group-hover:scale-105 transition-transform" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{p.title}</h3>
                    <p className="text-indigo-600 font-black">₹{p.basePrice.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-100 rounded-xl p-1">
                    <button onClick={() => updateCartQuantity(p.id, -1)} className="p-2 hover:bg-white rounded-lg transition-colors"><Minus size={14} /></button>
                    <span className="font-black text-sm w-4 text-center">{p.quantity}</span>
                    <button onClick={() => updateCartQuantity(p.id, 1)} className="p-2 hover:bg-white rounded-lg transition-colors"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(p.id)} className="p-3 text-red-100 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
            <div className="bg-indigo-600 p-8 rounded-[40px] text-white flex justify-between items-center shadow-xl shadow-indigo-100">
              <div>
                <p className="text-indigo-200 font-bold text-xs uppercase tracking-widest">Total Amount</p>
                <p className="text-3xl font-black">₹{total.toLocaleString('en-IN')}</p>
              </div>
              <button className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-1">
                Checkout Now
              </button>
            </div>
          </div>
        )}
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
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/community" element={<Community />} />
          <Route path="/support" element={<Support />} />
          <Route path="/auctions" element={<div className="page-enter p-12 max-w-7xl mx-auto"><BackButton /><h1 className="text-5xl font-black mb-12 tracking-tight">Live Hub Auctions</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-10">{auctions.map(a => <AuctionCard key={a.id} auction={a} product={products.find(p => p.id === a.productId)!} />)}</div></div>} />
          <Route path="/deals" element={<div className="page-enter p-12 max-w-7xl mx-auto"><BackButton /><h1 className="text-5xl font-black mb-12 tracking-tight">Gadget Deals</h1><div className="grid grid-cols-2 md:grid-cols-4 gap-8">{products.filter(p => !p.isBiddable).map(p => <ProductCard key={p.id} p={p} addToCart={addToCart} />)}</div></div>} />
          <Route path="/admin" element={
            currentUser?.role === UserRole.ADMIN ? (
              <AdminDashboard 
                users={users} products={products} onUpdateUser={handleUpdateUserStatus} 
                onDeleteUser={handleDeleteUser} onAddProduct={handleAddProduct} 
                onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct}
                onCreateUser={handleCreateUser} quickAdd={quickAddTrigger} resetQuickAdd={() => setQuickAddTrigger(null)}
                visibility={visibility} onUpdateVisibility={setVisibility}
              />
            ) : <Navigate to="/" />
          } />
        </Routes>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <span className="text-2xl font-black tracking-tighter text-gray-900 block">ELECTRO<span className="text-indigo-600">HUB</span></span>
            <p className="text-gray-400 text-sm font-medium">The world's first high-trust electronics marketplace powered by decentralized verification.</p>
          </div>
          <div className="space-y-4">
             <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Platform</h4>
             <ul className="text-gray-500 text-sm font-bold space-y-2">
               <li><Link to="/auctions" className="hover:text-indigo-600">Live Auctions</Link></li>
               <li><Link to="/deals" className="hover:text-indigo-600">Verified Deals</Link></li>
             </ul>
          </div>
          <div className="space-y-4">
             <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Trust & Safety</h4>
             <ul className="text-gray-500 text-sm font-bold space-y-2">
               <li><Link to="/support" className="hover:text-indigo-600">Verification</Link></li>
               <li><Link to="/about" className="hover:text-indigo-600">Escrow Services</Link></li>
             </ul>
          </div>
          <div className="bg-indigo-50 p-6 rounded-[32px] space-y-4">
             <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest">Newsletter</h4>
             <div className="relative">
               <input type="email" placeholder="Email address" className="w-full bg-white border-none rounded-2xl py-3 px-4 text-sm font-bold shadow-sm" />
               <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-4 rounded-xl text-xs font-black"><ArrowRight size={16} /></button>
             </div>
          </div>
        </div>
      </footer>

      {/* AI Advisor Bubble */}
      <button 
        onClick={() => setAdvisorOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-5 rounded-[24px] shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white/20 backdrop-blur-sm"
      >
        <MessageSquare size={28} />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          Ask Gemini Gadget Expert
        </span>
      </button>

      {/* AI Advisor Modal */}
      {advisorOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border border-white/20 animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-indigo-600 p-8 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl"><Cpu size={28} className="text-white" /></div>
                <div>
                  <h3 className="text-white font-black text-xl tracking-tight">Gadget Expert</h3>
                  <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Powered by Gemini AI</p>
                </div>
              </div>
              <button onClick={() => setAdvisorOpen(false)} className="text-white hover:bg-white/10 p-3 rounded-2xl transition-colors"><XCircle size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-gray-50/50">
              {adviceHistory.length === 0 && (
                <div className="text-center py-10">
                  <div className="bg-indigo-100 w-16 h-16 rounded-[24px] flex items-center justify-center mx-auto mb-4"><Zap className="text-indigo-600" /></div>
                  <p className="text-gray-900 font-black text-lg">Compare specs or get buying advice instantly.</p>
                  <p className="text-gray-400 font-bold text-sm mt-2">Example: "Should I get the S24 Ultra or wait for the iPhone 16?"</p>
                </div>
              )}
              {adviceHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-[28px] text-sm font-medium shadow-sm border ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none border-indigo-700 shadow-indigo-100' : 'bg-white text-gray-900 rounded-bl-none border-gray-100'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-white border-t border-gray-100 shrink-0">
              <div className="relative">
                <input 
                  type="text" 
                  value={adviceInput}
                  onChange={(e) => setAdviceInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && askAdvisor()}
                  placeholder="Ask anything about tech..."
                  className="w-full pl-6 pr-14 py-5 bg-gray-50 border border-gray-100 rounded-[28px] focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-gray-900 transition-all"
                />
                <button 
                  onClick={askAdvisor}
                  className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-[20px] font-black hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
