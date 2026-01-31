
import React from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { useTranslation } from '../services/i18n';

interface ProductsViewProps {
  language: string;
  onAddToCart: (product: Product) => void;
}

const ProductsView: React.FC<ProductsViewProps> = ({ language, onAddToCart }) => {
  const { t } = useTranslation(language);

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-stone-800 tracking-tight">{t('products_nav')}</h2>
          <p className="text-stone-500 font-medium">Quality agricultural inputs for your farm</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PRODUCTS.map((product) => (
          <div key={product.id} className="bg-white rounded-[40px] shadow-sm border border-stone-50 overflow-hidden flex flex-col group hover:shadow-xl transition-all">
            <div className="aspect-video w-full overflow-hidden relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-stone-600 tracking-widest shadow-sm">
                  {product.category}
                </span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-black text-xl text-stone-800 tracking-tight mb-2 line-clamp-1">{product.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-emerald-700">₹{product.price}</span>
                <span className="text-stone-400 text-xs font-black uppercase tracking-widest">/ {product.unit}</span>
              </div>
              <div className="mt-auto grid grid-cols-1 gap-2">
                <button 
                  onClick={() => onAddToCart(product)}
                  className="w-full py-4 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-stone-800 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <i className="fas fa-cart-plus"></i> {t('add_to_cart')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsView;
