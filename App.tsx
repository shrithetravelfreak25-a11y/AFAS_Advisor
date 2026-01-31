
import React, { useState, useEffect } from 'react';
import { AppStep, ProblemType, UserContext, FertilizerAdvice, WeatherData, Product, Purchase } from './types';
import { MOCK_PRICES } from './constants';
import { classifyProblem, getExplanation } from './services/gemini';
import { calculateFertilizer } from './services/ruleEngine';
import { useTranslation } from './services/i18n';
import { fetchWeatherAndCalculateRisk } from './services/weather';

// Components
import Navbar from './components/Navbar';
import HomeQuery from './components/HomeQuery';
import ContextGathering from './components/ContextGathering';
import AdvisoryOutput from './components/AdvisoryOutput';
import MarketDashboard from './components/MarketDashboard';
import ProfileSettings from './components/ProfileSettings';
import ProductsView from './components/ProductsView';
import CartView from './components/CartView';
import PurchasesView from './components/PurchasesView';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.QUERY);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  
  // New States for Market/Products
  const [cart, setCart] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([
    { id: 'ORD001', productId: 'p1', productName: 'Neem Coated Urea', date: '2023-10-15', amount: 532, quantity: 2, status: 'Delivered' },
    { id: 'ORD002', productId: 'p4', productName: 'Electric Sprayer 16L', date: '2023-11-02', amount: 2499, quantity: 1, status: 'Delivered' }
  ]);

  const [context, setContext] = useState<UserContext>({
    region: 'Andhra Pradesh',
    crop: '',
    area: 1,
    soilType: 'Alluvial',
    season: 'Rabi',
    language: 'English',
    images: []
  });
  const [advice, setAdvice] = useState<FertilizerAdvice | null>(null);

  const { t } = useTranslation(context.language);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // Fetch location and weather on mount
  useEffect(() => {
    if ("geolocation" in navigator && isOnline) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const data = await fetchWeatherAndCalculateRisk(
            position.coords.latitude,
            position.coords.longitude,
            context.language
          );
          if (data) setWeather(data);
        },
        () => {
          // Geolocation denied or unavailable - ignore silently
        },
        { timeout: 10000 }
      );
    }
  }, [context.language, isOnline]);

  const handleQuerySubmit = async (q: string) => {
    setLoading(true);
    const type = await classifyProblem(q);
    setLoading(false);
    
    if (type === 'market') {
      setCurrentStep(AppStep.MARKET);
    } else {
      setCurrentStep(AppStep.CONTEXT);
    }
  };

  const handleContextSubmit = async (newContext: UserContext) => {
    setContext(newContext);
    setLoading(true);
    const calculatedAdvice = calculateFertilizer(newContext);
    const { explanation, diseaseFindings } = await getExplanation(newContext, calculatedAdvice);
    setAdvice({ ...calculatedAdvice, explanation, diseaseFindings });
    setLoading(false);
    setCurrentStep(AppStep.RESULT);
  };

  // Cart Functions
  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    // Optional: Auto-switch to cart or show notification
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const checkout = () => {
    const newPurchases: Purchase[] = cart.map((item, idx) => ({
      id: `ORD${Math.floor(Math.random() * 9000) + 1000}`,
      productId: item.id,
      productName: item.name,
      date: new Date().toISOString().split('T')[0],
      amount: item.price,
      quantity: 1,
      status: 'In Transit'
    }));
    setPurchases(prev => [...newPurchases, ...prev]);
    setCart([]);
    setCurrentStep(AppStep.PURCHASES);
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-0 lg:pl-64 bg-stone-50">
      <Navbar 
        currentStep={currentStep} 
        setCurrentStep={setCurrentStep} 
        isOnline={isOnline} 
        language={context.language} 
        region={context.region}
        cartCount={cart.length}
      />
      
      <main className="max-w-5xl mx-auto p-4 md:p-8">
        {loading && (
          <div className="fixed inset-0 bg-[#0a0c0a]/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-6 font-black text-emerald-400 uppercase tracking-widest text-xs">{t('ai_syncing')}</p>
            </div>
          </div>
        )}

        {currentStep === AppStep.QUERY && (
          <HomeQuery 
            onSubmit={handleQuerySubmit} 
            isOnline={isOnline} 
            language={context.language} 
            weather={weather}
          />
        )}

        {currentStep === AppStep.CONTEXT && (
          <ContextGathering context={context} onSubmit={handleContextSubmit} />
        )}

        {currentStep === AppStep.RESULT && advice && (
          <AdvisoryOutput 
            advice={advice} 
            context={context} 
            weather={weather}
            onReset={() => {
              setContext(prev => ({ ...prev, images: [] })); // Clear images for new query
              setCurrentStep(AppStep.QUERY);
            }} 
          />
        )}

        {currentStep === AppStep.MARKET && (
          <MarketDashboard prices={MOCK_PRICES} language={context.language} />
        )}

        {currentStep === AppStep.PRODUCTS && (
          <ProductsView language={context.language} onAddToCart={addToCart} />
        )}

        {currentStep === AppStep.CART && (
          <CartView cart={cart} language={context.language} onRemoveFromCart={removeFromCart} onCheckout={checkout} />
        )}

        {currentStep === AppStep.PURCHASES && (
          <PurchasesView purchases={purchases} language={context.language} />
        )}

        {currentStep === AppStep.SETTINGS && (
          <ProfileSettings context={context} setContext={setContext} />
        )}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-4 lg:hidden z-40 shadow-2xl overflow-x-auto gap-4">
        <button onClick={() => setCurrentStep(AppStep.QUERY)} className={`flex-shrink-0 flex flex-col items-center ${[AppStep.QUERY, AppStep.CONTEXT, AppStep.RESULT].includes(currentStep) ? 'text-emerald-600' : 'text-stone-400'}`}>
          <i className="fas fa-house-user text-xl"></i>
          <span className="text-[8px] mt-1 font-black uppercase tracking-tighter">{t('home_nav')}</span>
        </button>
        <button onClick={() => setCurrentStep(AppStep.MARKET)} className={`flex-shrink-0 flex flex-col items-center ${currentStep === AppStep.MARKET ? 'text-emerald-600' : 'text-stone-400'}`}>
          <i className="fas fa-chart-line text-xl"></i>
          <span className="text-[8px] mt-1 font-black uppercase tracking-tighter">{t('market_nav')}</span>
        </button>
        <button onClick={() => setCurrentStep(AppStep.PRODUCTS)} className={`flex-shrink-0 flex flex-col items-center ${currentStep === AppStep.PRODUCTS ? 'text-emerald-600' : 'text-stone-400'}`}>
          <i className="fas fa-store text-xl"></i>
          <span className="text-[8px] mt-1 font-black uppercase tracking-tighter">{t('products_nav')}</span>
        </button>
        <button onClick={() => setCurrentStep(AppStep.PURCHASES)} className={`flex-shrink-0 flex flex-col items-center ${currentStep === AppStep.PURCHASES ? 'text-emerald-600' : 'text-stone-400'}`}>
          <i className="fas fa-history text-xl"></i>
          <span className="text-[8px] mt-1 font-black uppercase tracking-tighter">{t('purchases_nav')}</span>
        </button>
        <button onClick={() => setCurrentStep(AppStep.SETTINGS)} className={`flex-shrink-0 flex flex-col items-center ${currentStep === AppStep.SETTINGS ? 'text-emerald-600' : 'text-stone-400'}`}>
          <i className="fas fa-id-card text-xl"></i>
          <span className="text-[8px] mt-1 font-black uppercase tracking-tighter">{t('profile_nav')}</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
