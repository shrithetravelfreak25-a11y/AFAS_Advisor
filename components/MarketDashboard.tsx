
import React, { useState } from 'react';
import { MarketPrice } from '../types';
import { useTranslation } from '../services/i18n';

interface MarketDashboardProps {
  prices: MarketPrice[];
  language: string;
}

const MarketDashboard: React.FC<MarketDashboardProps> = ({ prices, language }) => {
  const { t } = useTranslation(language);

  const generateWhatsAppMessage = (item: MarketPrice) => {
    const text = `🌾 *Crop Sale Inquiry*%0A---%0A*Crop:* ${item.crop}%0A*Market:* ${item.mandi}%0A*Rate:* ₹${item.price} / ${item.unit}%0A*Date:* ${new Date().toLocaleDateString()}%0A---%0A_Generated via AFAS_`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-stone-800 tracking-tight">{t('mandi_live')}</h2>
          <p className="text-stone-500 font-medium">Regional arrivals in {new Date().toLocaleDateString()}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prices.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 rounded-[40px] shadow-sm border border-stone-50 hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-black text-xl text-stone-800 tracking-tight">{item.crop}</h3>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">{item.mandi}</p>
              </div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.trend === 'up' ? 'bg-green-50 text-green-600' : item.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-stone-50 text-stone-400'}`}>
                <i className={`fas ${item.trend === 'up' ? 'fa-arrow-trend-up' : item.trend === 'down' ? 'fa-arrow-trend-down' : 'fa-minus'}`}></i>
              </div>
            </div>
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-stone-900">₹{item.price}</span>
              <span className="text-stone-400 text-sm font-black uppercase">/ {item.unit}</span>
            </div>

            <button 
              onClick={() => generateWhatsAppMessage(item)}
              className="w-full py-4 bg-stone-50 text-stone-500 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-stone-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            >
              List to Sell Inquiry
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketDashboard;
