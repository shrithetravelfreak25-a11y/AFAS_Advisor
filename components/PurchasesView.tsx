
import React from 'react';
import { Purchase } from '../types';
import { useTranslation } from '../services/i18n';

interface PurchasesViewProps {
  purchases: Purchase[];
  language: string;
}

const PurchasesView: React.FC<PurchasesViewProps> = ({ purchases, language }) => {
  const { t } = useTranslation(language);

  if (purchases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-stone-300 text-4xl mb-6">
          <i className="fas fa-history"></i>
        </div>
        <h2 className="text-2xl font-black text-stone-800 mb-2 tracking-tight">{t('no_purchases')}</h2>
        <p className="text-stone-500 font-medium">Your purchase history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn space-y-8">
      <header>
        <h2 className="text-3xl font-black text-stone-800 tracking-tight">{t('purchases_nav')}</h2>
        <p className="text-stone-500 font-medium">History of your orders</p>
      </header>

      <div className="space-y-4">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                <i className="fas fa-box-open"></i>
              </div>
              <div>
                <h3 className="font-black text-stone-800">{purchase.productName}</h3>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Order ID: #{purchase.id} • {purchase.date}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-10">
              <div className="text-right">
                <p className="font-black text-stone-900">₹{purchase.amount}</p>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Qty: {purchase.quantity}</p>
              </div>
              <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${purchase.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {purchase.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasesView;
