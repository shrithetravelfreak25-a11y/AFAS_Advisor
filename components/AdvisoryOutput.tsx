
import React, { useState } from 'react';
import { FertilizerAdvice, UserContext, WeatherData } from '../types';
import { useTranslation } from '../services/i18n';
import { speakText } from '../services/audio';
import { downloadReport } from '../services/pdf';

interface AdvisoryOutputProps {
  advice: FertilizerAdvice;
  context: UserContext;
  weather: WeatherData | null;
  onReset: () => void;
}

const AdvisoryOutput: React.FC<AdvisoryOutputProps> = ({ advice, context, weather, onReset }) => {
  const { t } = useTranslation(context.language);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const localizedSchedule = context.language === 'English' ? advice.schedule : [
    t('basal_dose'),
    t('top_dressing_1'),
    t('top_dressing_2')
  ];

  const handleListen = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    const fullText = `${advice.explanation}. ${advice.diseaseFindings || ''}. ${localizedSchedule.join('. ')}`;
    await speakText(fullText, 'Kore');
    setIsSpeaking(false);
  };

  const handleDownload = () => {
    downloadReport(context, advice, weather);
  };

  const renderBulletedText = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    return (
      <ul className="space-y-2">
        {lines.map((line, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="text-emerald-500 mt-1">•</span>
            <span className="flex-1">{line.replace(/^[•\-\*]\s*/, '')}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-slideUp">
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-stone-100">
        <div className="flex justify-between items-start mb-10">
          <div>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{t('fertilizer').toUpperCase()} {t('advisory').toUpperCase()}</span>
            <h2 className="text-3xl font-black text-stone-800 mt-4 tracking-tight">{context.crop || t('which_crop')} {t('nutrient_plan')}</h2>
            <p className="text-stone-500 text-sm font-medium">{t('target_area')} {context.area} {t('acres_of')} {context.soilType} {t('soil')}</p>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <button 
              onClick={handleListen}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                isSpeaking ? 'bg-emerald-600 text-white animate-pulse' : 'bg-stone-100 text-stone-500 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <i className={`fas ${isSpeaking ? 'fa-volume-high' : 'fa-volume-low'}`}></i>
              {isSpeaking ? 'Speaking...' : 'Listen'}
            </button>
            <div>
              <span className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">{t('confidence')}</span>
              <span className={`inline-flex items-center gap-1.5 font-black text-sm uppercase ${advice.confidence === 'High' ? 'text-emerald-600' : 'text-amber-600'}`}>
                <i className="fas fa-certificate"></i>
                {advice.confidence}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <NutrientCard label="UREA" value={advice.urea} unit="kg" color="emerald" />
          <NutrientCard label="DAP" value={advice.dap} unit="kg" color="blue" />
          <NutrientCard label="MOP" value={advice.mop} unit="kg" color="orange" />
        </div>

        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 mb-10">
          <h3 className="font-black text-emerald-800 text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
            <i className="fas fa-wand-magic-sparkles"></i> {t('expert_explanation')}
          </h3>
          <div className="text-emerald-900 leading-relaxed font-medium">
            {renderBulletedText(advice.explanation || t('offline_mode_msg'))}
          </div>
        </div>

        {advice.diseaseFindings && (
          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 mb-10">
            <h3 className="font-black text-amber-800 text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
              <i className="fas fa-microscope"></i> Image Analysis Findings
            </h3>
            <div className="text-amber-900 leading-relaxed font-medium">
              {renderBulletedText(advice.diseaseFindings)}
            </div>
            {context.images && context.images.length > 0 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {context.images.map((img, i) => (
                  <img key={i} src={img} className="w-16 h-16 rounded-lg object-cover border border-amber-200" />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          <h3 className="font-black text-stone-800 uppercase tracking-widest text-xs flex items-center gap-2">
            <i className="fas fa-calendar-days text-emerald-600"></i> {t('application_schedule')}
          </h3>
          <div className="space-y-4">
            {localizedSchedule.map((step, idx) => (
              <div key={idx} className="flex gap-6 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center font-black text-stone-400 text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 pb-4 border-b border-stone-50 last:border-0">
                  <p className="text-stone-700 text-sm font-bold leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-stone-900 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-2xl hover:bg-stone-800 transition-all uppercase text-xs tracking-widest">
          <i className="fab fa-whatsapp text-xl"></i>
          {t('share_whatsapp')}
        </button>
        <button 
          onClick={handleDownload}
          className="bg-emerald-700 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-2xl hover:bg-emerald-800 transition-all uppercase text-xs tracking-widest"
        >
          <i className="fas fa-file-pdf text-xl"></i>
          Download PDF Report
        </button>
        <button 
          onClick={onReset}
          className="bg-white border-2 border-stone-100 text-stone-400 font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:bg-stone-50 transition-all uppercase text-xs tracking-widest"
        >
          <i className="fas fa-rotate"></i>
          {t('new_query')}
        </button>
      </div>
    </div>
  );
};

const NutrientCard: React.FC<{ label: string; value: number; unit: string; color: string }> = ({ label, value, unit, color }) => {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    blue: 'bg-blue-50 border-blue-100 text-blue-700',
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
  };

  return (
    <div className={`p-6 rounded-3xl border ${colorClasses[color]} text-center shadow-sm`}>
      <span className="block text-[10px] font-black opacity-60 mb-2 tracking-widest">{label}</span>
      <div className="flex flex-col">
        <span className="text-3xl font-black tracking-tight">{value}</span>
        <span className="text-[10px] font-black opacity-60 uppercase">{unit}</span>
      </div>
    </div>
  );
};

export default AdvisoryOutput;
