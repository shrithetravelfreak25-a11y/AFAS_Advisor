
import React from 'react';
import { AppStep } from '../types';
import { useTranslation } from '../services/i18n';

interface NavbarProps {
  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;
  isOnline: boolean;
  language: string;
  region: string;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentStep, setCurrentStep, isOnline, language, region, cartCount }) => {
  const { t } = useTranslation(language);

  return (
    <>
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-[#043e32] text-white p-6 shadow-xl z-50">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-white p-2 rounded-lg">
            <i className="fas fa-leaf text-[#043e32] text-xl"></i>
          </div>
          <h1 className="font-bold text-xl tracking-tight">AFAS Advisor</h1>
        </div>

        <nav className="flex flex-col gap-1">
          <NavItem 
            active={currentStep === AppStep.QUERY || currentStep === AppStep.CONTEXT || currentStep === AppStep.RESULT} 
            icon="fa-wand-magic-sparkles" 
            label={t('advisory')} 
            onClick={() => setCurrentStep(AppStep.QUERY)} 
          />
          <NavItem 
            active={currentStep === AppStep.MARKET} 
            icon="fa-chart-line" 
            label={t('market_dashboard')} 
            onClick={() => setCurrentStep(AppStep.MARKET)} 
          />
          <NavItem 
            active={currentStep === AppStep.PRODUCTS} 
            icon="fa-store" 
            label={t('products_nav')} 
            onClick={() => setCurrentStep(AppStep.PRODUCTS)} 
          />
          <NavItem 
            active={currentStep === AppStep.CART} 
            icon="fa-shopping-cart" 
            label={`${t('cart_nav')} ${cartCount > 0 ? `(${cartCount})` : ''}`} 
            onClick={() => setCurrentStep(AppStep.CART)} 
          />
          <NavItem 
            active={currentStep === AppStep.PURCHASES} 
            icon="fa-bag-shopping" 
            label={t('purchases_nav')} 
            onClick={() => setCurrentStep(AppStep.PURCHASES)} 
          />
          <NavItem 
            active={currentStep === AppStep.SETTINGS} 
            icon="fa-gear" 
            label={t('settings')} 
            onClick={() => setCurrentStep(AppStep.SETTINGS)} 
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-emerald-900/30">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-xs font-medium opacity-90">{isOnline ? t('sync_active') : t('offline_mode')}</span>
          </div>
          <p className="text-[10px] opacity-60 font-medium">Version 1.0.4 - Region: {region}</p>
        </div>
      </aside>

      <header className="lg:hidden bg-white border-b sticky top-0 px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <i className="fas fa-leaf text-[#059669] text-xl"></i>
          <span className="font-bold text-lg">AFAS Advisor</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentStep(AppStep.CART)} className="relative p-2">
            <i className="fas fa-shopping-cart text-[#059669]"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isOnline ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </header>
    </>
  );
};

const NavItem: React.FC<{ active: boolean; icon: string; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-[#065f46] text-white' : 'text-stone-300/70 hover:bg-emerald-800/20 hover:text-white'}`}
  >
    <i className={`fas ${icon} w-5 text-sm`}></i>
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export default Navbar;
