
import React from 'react';
import { Product } from '../types';
import { useTranslation } from '../services/i18n';

interface CartViewProps {
  cart: Product[];
  language: string;
  onRemoveFromCart: (id: string) => void;
  onCheckout: () => void;
}

const CartView: React.FC<CartViewProps> = ({ cart, language, onRemoveFromCart, onCheckout }) => {
  const { t } = useTranslation(language);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center text-stone-300 text-4xl mb-6">
          <i className="fas fa-shopping-basket"></i>
        </div>
        <h2 className="text-2xl font-black text-stone-800 mb-2 tracking-tight">{t('cart_empty')}</h2>
        <p className="text-stone-500 font-medium">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn space-y-8">
      <header>
        <h2 className="text-3xl font-black text-stone-800 tracking-tight">{t('cart_nav')}</h2>
        <p className="text-stone-500 font-medium">{cart.length} items in your basket</p>
      </header>

      <div className="bg-white rounded-[40px] shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-8 space-y-6">
          {cart.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center gap-6 pb-6 border-b border-stone-50 last:border-0 last:pb-0">
              <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
              <div className="flex-1">
                <h3 className="font-black text-stone-800">{item.name}</h3>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{item.category} • {item.unit}</p>
                <p className="text-emerald-700 font-black mt-1">₹{item.price}</p>
              </div>
              <button 
                onClick={() => onRemoveFromCart(item.id)}
                className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <i className="fas fa-trash-can text-sm"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-stone-50 p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-stone-500 font-bold uppercase text-xs tracking-widest">Total Amount</span>
            <span className="text-4xl font-black text-stone-900 tracking-tighter">₹{total}</span>
          </div>
          <button 
            onClick={onCheckout}
            className="w-full py-5 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
          >
            <i className="fas fa-check-double"></i> {t('checkout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
