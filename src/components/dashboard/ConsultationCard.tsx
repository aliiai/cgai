import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Consultation } from '../../types/types';
import CategoryIcon from './CategoryIcon';
import ConsultationPopup from './ConsultationPopup';
import { useLocalized } from '../../hooks/useLocalized';
import { useLocalizedName } from '../../hooks/useLocalized';
import { useThemeStore } from '../../storeApi/storeApi';

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
        className={`group rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${
          isDarkMode
            ? 'bg-slate-800 border border-slate-700 hover:border-slate-600'
            : 'bg-white border border-[#114C5A]/20 hover:border-[#114C5A]/40'
        }`}
      >
        <CategoryIcon item={consultation} />

        <h3 className={`text-lg font-semibold mt-4 mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-[#114C5A]'
        }`}>
          {localizedConsultation.name}
        </h3>

        <p className={`text-sm mb-3 line-clamp-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {localizedConsultation.description || ''}
        </p>

        {consultation.category && (
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border transition-colors duration-300 ${
              isDarkMode
                ? 'bg-[#114C5A]/20 text-[#FFB200] border-[#114C5A]/30'
                : 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/20'
            }`}>
              {categoryName}
            </span>
          </div>
        )}

        <div className={`flex items-center justify-between pt-3 border-t transition-colors duration-300 ${
          isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
        }`}>
          <div className={`text-lg font-semibold transition-colors duration-300 ${
            isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
          }`}>
            {consultation.fixed_price || consultation.price} {t('dashboard.stats.currency')}
          </div>
          <div className={`flex items-center gap-2 font-medium text-sm transition-colors duration-300 ${
            isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
          }`}>
            <span>{t('dashboard.consultation.book')}</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
