
import React, { useState } from 'react';
import { ShoppingCart, User as UserIcon, ShieldCheck, Search, Gavel, Cpu, Bell, Menu, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole, Notification } from '../types';

interface NavbarProps {
  currentUser: any;
  cartCount: number;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onToggleSidebar: () => void;
  onLogout: () => void;
  visibility: {
    newArrivals: boolean;
    certifiedPreOwned: boolean;
    liveAuctions: boolean;
  };
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, cartCount, notifications, onMarkRead, onToggleSidebar, onLogout, visibility }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read && (n.userId === currentUser?.id || (currentUser?.role === UserRole.ADMIN && n.userId === 'ADMIN'))).length;

  const relevantNotifications = notifications
    .filter(n => n.userId === currentUser?.id || (currentUser?.role === UserRole.ADMIN && n.userId === 'ADMIN'))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                <Cpu className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 block">
                ELECTRO<span className="text-indigo-600">HUB</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search premium gadgets..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/deals" className="text-gray-600 hover:text-indigo-600 font-bold transition-colors hidden sm:block">
              Shop
            </Link>
            
            {visibility.liveAuctions && (
              <Link to="/auctions" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1 font-bold transition-colors hidden sm:flex">
                Auctions
              </Link>
            )}
            
            {currentUser?.role === UserRole.ADMIN && (
              <Link to="/admin" className="text-gray-600 hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors hidden sm:flex">
                <ShieldCheck className="h-4 w-4" /> Admin
              </Link>
            )}

            {currentUser && (
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-gray-600 hover:text-indigo-600 transition-colors p-1"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Notifications</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {relevantNotifications.length > 0 ? (
                        relevantNotifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => { onMarkRead(n.id); setShowNotifications(false); }}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-indigo-50/50' : ''}`}
                          >
                            <p className="text-sm font-bold text-gray-900">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-400">No notifications yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                  <UserIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">{currentUser.name}</span>
                </Link>
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
