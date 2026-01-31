
import React, { useState, useRef } from 'react';
import { UserContext } from '../types';
import { CROPS, SOIL_TYPES, SEASONS } from '../constants';
import { useTranslation } from '../services/i18n';

interface ContextGatheringProps {
  context: UserContext;
  onSubmit: (context: UserContext) => void;
}

const ContextGathering: React.FC<ContextGatheringProps> = ({ context: initialContext, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserContext>(initialContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation(initialContext.language);

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Explicitly type file as File to avoid 'unknown' error when passing to readAsDataURL
    const promises = Array.from(files).map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(base64Images => {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...base64Images].slice(0, 5) // Limit to 5
      }));
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-xl mx-auto py-4">
      <div className="mb-8 flex justify-between items-center px-2">
        <h2 className="text-xl font-bold text-stone-800">{t('field_context')}</h2>
        <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{t('step')} {step} {t('of')} 5</span>
      </div>

      <div className="bg-white rounded-[40px] p-10 shadow-sm border border-stone-100">
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-xl font-bold mb-6">{t('which_crop')}</label>
              <div className="grid grid-cols-2 gap-3">
                {CROPS.map(c => (
                  <button
                    key={c}
                    onClick={() => { setFormData({ ...formData, crop: c }); next(); }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.crop === c ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-50 bg-stone-50 text-stone-500 hover:border-emerald-200'}`}
                  >
                    <span className="font-bold">{c}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-xl font-bold mb-6">{t('cultivation_area')}</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) })}
                className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl p-6 text-2xl font-black text-emerald-700 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={prev} className="flex-1 py-4 font-bold text-stone-400">{t('back')}</button>
              <button onClick={next} className="flex-2 bg-emerald-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:bg-emerald-700">{t('continue')}</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-xl font-bold mb-6">{t('soil_type')}</label>
              <div className="grid grid-cols-1 gap-3">
                {SOIL_TYPES.map(s => (
                  <button
                    key={s}
                    onClick={() => { setFormData({ ...formData, soilType: s }); next(); }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.soilType === s ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-50 bg-stone-50 text-stone-500 hover:border-emerald-200'}`}
                  >
                    <span className="font-bold">{s}</span>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={prev} className="w-full py-2 font-bold text-stone-400">{t('back')}</button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-xl font-bold mb-6">{t('growing_season')}</label>
              <div className="grid grid-cols-1 gap-3">
                {SEASONS.map(s => (
                  <button
                    key={s}
                    onClick={() => { setFormData({ ...formData, season: s }); next(); }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${formData.season === s ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-stone-50 bg-stone-50 text-stone-500 hover:border-emerald-200'}`}
                  >
                    <span className="font-bold">{s}</span>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={prev} className="w-full py-2 font-bold text-stone-400">{t('back')}</button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-xl font-bold mb-4">{t('crop_image')} (Batch)</label>
              <p className="text-xs text-stone-400 mb-6">Upload up to 5 images for disease and nutrient analysis.</p>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-stone-200 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 transition-all bg-stone-50"
              >
                <i className="fas fa-images text-stone-300 text-3xl mb-3"></i>
                <span className="text-sm font-bold text-stone-500">{t('upload_click')}</span>
                <span className="text-[10px] text-stone-400 mt-1">{t('upload_limit')}</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload}
                />
              </div>

              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-6">
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 shadow-sm">
                      <img src={img} className="w-full h-full object-cover" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                        className="absolute top-1 right-1 bg-white/80 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-red-500 shadow-sm"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="pt-4 space-y-3">
              <button 
                onClick={() => onSubmit(formData)} 
                className="w-full bg-emerald-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-emerald-700 transition-all transform active:scale-95"
              >
                {t('generate_advice')}
              </button>
              <button onClick={prev} className="w-full py-2 font-bold text-stone-400">{t('back')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextGathering;
