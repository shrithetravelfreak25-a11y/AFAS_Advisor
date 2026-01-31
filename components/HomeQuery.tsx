
import React, { useState } from 'react';
import { useTranslation } from '../services/i18n';
import { WeatherData } from '../types';
import { startVoiceRecognition } from '../services/audio';

interface HomeQueryProps {
  onSubmit: (query: string) => void;
  isOnline: boolean;
  language: string;
  weather: WeatherData | null;
}

const HomeQuery: React.FC<HomeQueryProps> = ({ onSubmit, isOnline, language, weather }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { t } = useTranslation(language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) onSubmit(text);
  };

  const toggleVoice = () => {
    if (isListening) return;
    setIsListening(true);
    startVoiceRecognition(
      language,
      (result) => {
        setText((prev) => prev + (prev ? ' ' : '') + result);
      },
      () => setIsListening(false)
    );
  };

  return (
    <div className="space-y-8 py-8 animate-fadeIn flex flex-col items-center">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-stone-800 tracking-tight">{t('welcome')}</h2>
        <p className="text-stone-500 font-medium">{t('assist')}</p>
      </header>

      {/* Weather Alert Component */}
      {weather && (
        <div className={`w-full max-w-4xl rounded-3xl p-6 border flex flex-col md:flex-row items-center gap-6 shadow-sm transition-all animate-slideDown ${
          weather.riskLevel === 'High' ? 'bg-red-50 border-red-100' : 
          weather.riskLevel === 'Medium' ? 'bg-amber-50 border-amber-100' : 
          'bg-emerald-50 border-emerald-100'
        }`}>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
            weather.riskLevel === 'High' ? 'bg-red-200 text-red-700' : 
            weather.riskLevel === 'Medium' ? 'bg-amber-200 text-amber-700' : 
            'bg-emerald-200 text-emerald-700'
          }`}>
            <i className={`fas ${
              weather.condition.includes('Rain') ? 'fa-cloud-showers-heavy' : 
              weather.condition.includes('Clear') ? 'fa-sun' : 
              'fa-cloud'
            }`}></i>
          </div>
          
          <div className="flex-1 space-y-1">
            <h3 className={`font-black uppercase text-[10px] tracking-widest ${
              weather.riskLevel === 'High' ? 'text-red-800' : 
              weather.riskLevel === 'Medium' ? 'text-amber-800' : 
              'text-emerald-800'
            }`}>
              {t('weather_alert')}
            </h3>
            <p className="text-stone-800 font-bold text-sm leading-relaxed">{weather.riskMessage}</p>
            <div className="flex gap-4 pt-1">
              <span className="text-[10px] font-black text-stone-500 uppercase">{t('temperature')}: {weather.temp}°C</span>
              <span className="text-[10px] font-black text-stone-500 uppercase">{t('humidity')}: {weather.humidity}%</span>
              <span className={`text-[10px] font-black uppercase ${
                weather.riskLevel === 'High' ? 'text-red-600' : 
                weather.riskLevel === 'Medium' ? 'text-amber-600' : 
                'text-emerald-600'
              }`}>{t('risk')}: {weather.riskLevel}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Advisory Card (Emerald Theme) */}
      <div className="w-full max-w-4xl bg-[#059669] rounded-3xl p-8 text-white shadow-2xl shadow-emerald-200/50 border border-emerald-400/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="block font-bold text-white text-lg">{t('problem_label')}</label>
            <button
              type="button"
              onClick={toggleVoice}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isListening ? 'bg-red-500 animate-pulse' : 'bg-white/20 hover:bg-white/30'
              }`}
              title="Voice Input"
            >
              <i className={`fas ${isListening ? 'fa-microphone' : 'fa-microphone-lines'} text-sm`}></i>
            </button>
          </div>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isListening ? "Listening..." : t('placeholder_query')}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-emerald-100/50 focus:outline-none focus:border-white/50 h-32 resize-none transition-all font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full bg-[#a7f3d0]/80 hover:bg-[#a7f3d0] text-[#065f46] font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {t('start_analysis')} <i className="fas fa-arrow-right text-sm"></i>
          </button>
        </form>
      </div>

      {/* Original Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <QuickAction 
          icon="fa-droplet" 
          label={t('fertilizer')} 
          bgColor="bg-blue-50"
          textColor="text-blue-600"
          onClick={() => onSubmit("I need a fertilizer schedule")}
        />
        <QuickAction 
          icon="fa-bug" 
          label={t('pests_disease')} 
          bgColor="bg-red-50"
          textColor="text-red-700"
          onClick={() => onSubmit("Disease management advice")}
        />
        <QuickAction 
          icon="fa-indian-rupee-sign" 
          label={t('market_price')} 
          bgColor="bg-amber-50"
          textColor="text-amber-700"
          onClick={() => onSubmit("What are current market prices?")}
        />
      </div>

      {!isOnline && (
        <div className="bg-stone-100 border border-stone-200 rounded-2xl p-4 flex items-center gap-3 w-full max-w-md">
          <i className="fas fa-cloud-slash text-stone-400"></i>
          <p className="text-sm text-stone-600 font-medium">
            {t('offline_mode_msg')}
          </p>
        </div>
      )}
    </div>
  );
};

const QuickAction: React.FC<{ icon: string; label: string; bgColor: string; textColor: string; onClick: () => void }> = ({ icon, label, bgColor, textColor, onClick }) => (
  <button 
    onClick={onClick}
    className={`${bgColor} p-8 rounded-2xl flex flex-col items-center justify-center gap-4 border border-stone-100 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-[0.98] shadow-sm group h-32`}
  >
    <i className={`fas ${icon} text-xl ${textColor} group-hover:scale-110 transition-transform`}></i>
    <span className={`font-bold text-xs uppercase tracking-tight ${textColor}`}>{label}</span>
  </button>
);

export default HomeQuery;
