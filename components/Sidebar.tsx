
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  X, Package, Tag, Info, Mail, Users, LifeBuoy, Gavel, Home, Smartphone, RefreshCcw
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onQuickAdd: (condition: 'NEW' | 'RESELLER') => void;
  visibility: {
    newArrivals: boolean;
    certifiedPreOwned: boolean;
    liveAuctions: boolean;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentUser, onQuickAdd, visibility }) => {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const handleAction = (type: 'NEW' | 'RESELLER') => {
    if (!isAdmin) {
      onClose();
      navigate('/auth');
      return;
    }
    onQuickAdd(type);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex justify-between items-center bg-indigo-600 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Package size={24} className="text-white" />
              </div>
              <span className="font-black tracking-tight text-xl uppercase">Electro Menu</span>
            </div>
            <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-8 px-4 space-y-10">
            {/* Seller Section */}
            <div className="space-y-3">
              <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Seller Central</p>
              <button 
                onClick={() => handleAction('NEW')}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-indigo-700 bg-indigo-50 font-bold hover:bg-indigo-100 transition-all border border-indigo-100/50 group"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <Smartphone size={18} />
                </div>
                <span>Add New Gadget</span>
              </button>
              <button 
                onClick={() => handleAction('RESELLER')}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-amber-700 bg-amber-50 font-bold hover:bg-amber-100 transition-all border border-amber-100/50 group"
              >
                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <RefreshCcw size={18} />
                </div>
                <span>Reseller Options</span>
              </button>
            </div>

            {/* Marketplace Section */}
            <div className="space-y-1">
              <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Browse Marketplace</p>
              <Link to="/" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-all">
                <Home size={20} className="text-gray-400" /> 
                <span>Home</span>
              </Link>
              
              {visibility.liveAuctions && (
                <Link to="/auctions" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-all">
                  <Gavel size={20} className="text-gray-400" /> 
                  <span>Live Auctions</span>
                </Link>
              )}

              <Link to="/deals" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-all">
                <Tag size={20} className="text-gray-400" /> 
                <span>Deals of the Day</span>
              </Link>
            </div>

            {/* Hub Section */}
            <div className="space-y-1 pt-4 border-t border-gray-100">
              <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Gadget Hub Hub</p>
              <Link to="/about" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all">
                <Info size={20} className="text-gray-400" /> 
                <span>About Us</span>
              </Link>
              <Link to="/contact" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all">
                <Mail size={20} className="text-gray-400" /> 
                <span>Contact Us</span>
              </Link>
              <Link to="/community" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all">
                <Users size={20} className="text-gray-400" /> 
                <span>Join Community</span>
              </Link>
              <Link to="/support" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all">
                <LifeBuoy size={20} className="text-gray-400" /> 
                <span>Direct Support</span>
              </Link>
            </div>
          </div>

          <div className="p-8 border-t border-gray-100 bg-gray-50/50">
            <div className="flex flex-col items-center">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Version 2.4.0</p>
              <p className="text-[8px] text-indigo-400 font-black uppercase tracking-widest mt-1">High-Trust Architecture</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
