
import React, { useState, useEffect } from 'react';
import { Auction, Product } from '../types';
import { Timer, Gavel, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuctionCardProps {
  auction: Auction;
  product: Product;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, product }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(auction.endTime).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('ENDED');
        clearInterval(timer);
      } else {
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Gavel size={14} /> LIVE AUCTION
        </div>
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl flex justify-between items-center shadow-sm border border-white/20">
          <div className="flex items-center gap-2 text-gray-900 font-bold">
            <Timer size={16} className="text-indigo-600" />
            <span className="text-sm">{timeLeft}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-600 font-bold uppercase tracking-wider">
            <TrendingUp size={14} /> {auction.bids.length} Bids
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-xs text-indigo-600 font-bold mb-1 uppercase tracking-widest">{product.brand}</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.title}</h3>
        
        <div className="flex items-end justify-between mt-6">
          <div>
            <p className="text-xs text-gray-500 font-medium">Current Bid</p>
            <p className="text-2xl font-extrabold text-indigo-600">₹{auction.currentHighestBid.toLocaleString('en-IN')}</p>
          </div>
          <Link 
            to={`/auction/${auction.id}`}
            className="bg-gray-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-gray-200"
          >
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
