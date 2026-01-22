import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Service } from '../../types/types';
import CategoryIcon from './CategoryIcon';
import ServicePopup from './ServicePopup ';
import { useLocalized } from '../../hooks/useLocalized';
import { useThemeStore } from '../../storeApi/storeApi';

interface ServiceCardProps {
  service: Service;
  onOpenConsultations?: () => void;
}

const ServiceCard = ({ service, onOpenConsultations }: ServiceCardProps) => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const [open, setOpen] = useState(false);
  const localizedService = useLocalized(service, ['name', 'description']);

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
          <CategoryIcon item={service} />

        <h3 className={`text-lg font-semibold mt-4 mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-[#114C5A]'
        }`}>
          {localizedService.name}
        </h3>

        <p className={`text-sm mb-4 line-clamp-2 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {localizedService.description || ''}
        </p>

        <div className={`flex items-center justify-between font-medium text-sm pt-3 border-t transition-colors duration-300 ${
          isDarkMode
            ? 'text-[#FFB200] border-slate-700'
            : 'text-[#114C5A] border-[#114C5A]/10'
        }`}>
          <span>{t('dashboard.services.book')}</span>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Popup */}
      {open && (
        <ServicePopup
          service={service}
          onClose={() => setOpen(false)}
          onOpenConsultations={onOpenConsultations}
        />
      )}
    </>
  );
};

export default ServiceCard;
