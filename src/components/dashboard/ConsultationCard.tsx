import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Consultation } from '../../types/types';
import CategoryIcon from './CategoryIcon';
import ConsultationPopup from './ConsultationPopup';
import { useLocalized } from '../../hooks/useLocalized';
import { useLocalizedName } from '../../hooks/useLocalized';
import { useThemeStore } from '../../storeApi/store/theme.store';

interface ConsultationCardProps {
  consultation: Consultation;
}

const ConsultationCard = ({ consultation }: ConsultationCardProps) => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const [open, setOpen] = useState(false);
  const localizedConsultation = useLocalized(consultation, ['name', 'description']);
  const categoryName = useLocalizedName(consultation.category);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`group relative backdrop-blur-xl rounded-3xl p-7 border shadow-lg hover:shadow-xl transition cursor-pointer ${
          isDarkMode 
            ? 'bg-slate-800/60 border-slate-700/40 hover:border-primary/40' 
            : 'bg-white/60 border-white/40 hover:border-primary/40'
        }`}
      >
        <CategoryIcon item={consultation} />

        <h3 className={`text-xl font-bold mt-5 mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {localizedConsultation.name}
        </h3>

        <p className={`text-sm mb-4 ${
          isDarkMode ? 'text-slate-300' : 'text-gray-600'
        }`}>
          {localizedConsultation.description || ''}
        </p>

        {consultation.category && (
          <div className="mb-4">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              {categoryName}
            </span>
          </div>
        )}

          <div className="flex items-center justify-between mt-auto">
          <div className="text-xl font-black text-primary">
            {consultation.fixed_price || consultation.price} {t('dashboard.stats.currency')}
          </div>
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <span>{t('dashboard.consultation.book')}</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Popup */}
      {open && (
        <ConsultationPopup consultation={consultation} onClose={() => setOpen(false)} />
      )}
    </>
  );
};

export default ConsultationCard;

