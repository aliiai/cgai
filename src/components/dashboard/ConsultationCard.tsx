import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Consultation } from '../../types/types';
import CategoryIcon from './CategoryIcon';
import ConsultationPopup from './ConsultationPopup';
import { useLocalized } from '../../hooks/useLocalized';
import { useLocalizedName } from '../../hooks/useLocalized';

interface ConsultationCardProps {
  consultation: Consultation;
}

const ConsultationCard = ({ consultation }: ConsultationCardProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const localizedConsultation = useLocalized(consultation, ['name', 'description']);
  const categoryName = useLocalizedName(consultation.category);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="group bg-white border border-[#114C5A]/20 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#114C5A]/40 transition-all cursor-pointer"
      >
        <CategoryIcon item={consultation} />

        <h3 className="text-lg font-semibold text-[#114C5A] mt-4 mb-2">
          {localizedConsultation.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {localizedConsultation.description || ''}
        </p>

        {consultation.category && (
          <div className="mb-3">
            <span className="inline-block bg-[#114C5A]/10 text-[#114C5A] px-3 py-1 rounded-lg text-xs font-medium border border-[#114C5A]/20">
              {categoryName}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[#114C5A]/10">
          <div className="text-lg font-semibold text-[#114C5A]">
            {consultation.fixed_price || consultation.price} {t('dashboard.stats.currency')}
          </div>
          <div className="flex items-center gap-2 text-[#114C5A] font-medium text-sm">
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
