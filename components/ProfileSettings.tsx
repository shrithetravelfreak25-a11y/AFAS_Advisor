
import React, { useState } from 'react';
import { UserContext } from '../types';
import { REGIONS } from '../constants';
import { useTranslation } from '../services/i18n';

interface ProfileSettingsProps {
  context: UserContext;
  setContext: (context: UserContext) => void;
}

const LANGUAGES = [
  { id: 'English', label: 'English', flag: 'GB', native: 'English' },
  { id: 'Hindi', label: 'हिंदी', flag: 'IN', native: 'हिंदी' },
  { id: 'Tamil', label: 'தமிழ்', flag: 'IN', native: 'தமிழ்' },
  { id: 'Telugu', label: 'తెలుగు', flag: 'IN', native: 'తెలుగు' },
];

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ context, setContext }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t } = useTranslation(context.language);

  const selectedLang = LANGUAGES.find(l => l.id === context.language) || LANGUAGES[0];

  return (
    <div className="max-w-xl mx-auto py-4 space-y-8 animate-fadeIn">
      <header className="text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto flex items-center justify-center text-emerald-600 text-3xl mb-4 shadow-inner">
          <i className="fas fa-user-gear"></i>
        </div>
        <h2 className="text-2xl font-bold text-stone-800">{t('profile')}</h2>
        <p className="text-stone-500 text-sm">Manage your localization and offline data</p>
      </header>

      {/* Advanced Language Selector (Matching Image) */}
      <section className="bg-[#0a0c0a] rounded-[32px] p-6 shadow-2xl border border-emerald-900/30">
        <label className="block text-stone-300 text-xs font-black uppercase tracking-widest mb-4">
          {t('lang_header')}
        </label>
        
        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="w-full bg-[#121512] border border-emerald-900/50 rounded-xl p-4 flex items-center justify-between text-stone-200 hover:border-emerald-600/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">{selectedLang.flag}</span>
              <span className="font-bold">{selectedLang.native}</span>
            </div>
            <i className={`fas fa-chevron-down text-emerald-900 text-xs transition-transform ${isLangOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {isLangOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#121512] border border-emerald-900/50 rounded-xl overflow-hidden z-50 shadow-2xl animate-fadeIn">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setContext({ ...context, language: lang.id });
                    setIsLangOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-emerald-900/20 text-stone-300 transition-colors border-b border-emerald-900/10 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">{lang.flag}</span>
                    <span className="font-bold">{lang.native}</span>
                  </div>
                  {context.language === lang.id && (
                    <i className="fas fa-check text-emerald-500 text-xs"></i>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 space-y-6">
        <div>
          <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">{t('region')}</label>
          <div className="grid grid-cols-2 gap-2">
            {REGIONS.map(r => (
              <button
                key={r}
                onClick={() => setContext({ ...context, region: r })}
                className={`py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${context.region === r ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-50 bg-stone-50 text-stone-500'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-stone-800">Offline Intelligence</h3>
            <p className="text-stone-500 text-xs">{context.region} {t('local_data_pack')} v2.4</p>
          </div>
          <button className="bg-emerald-600 text-white p-2 rounded-xl text-sm font-bold px-4 shadow-lg shadow-emerald-100">
            {t('synchronized')}
          </button>
        </div>
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-[100%]"></div>
        </div>
        <p className="text-[10px] text-stone-400 mt-2 font-bold uppercase tracking-wider">Storage Used: 2.4 MB / 10 MB</p>
      </section>
    </div>
  );
};

export default ProfileSettings;
