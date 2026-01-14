import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Service } from '../../types/types';
import CategoryIcon from './CategoryIcon';
import ServicePopup from './ServicePopup ';
import { useLocalized } from '../../hooks/useLocalized';
import { useThemeStore } from '../../storeApi/store/theme.store';

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
        className={`group relative backdrop-blur-xl rounded-3xl p-7 border shadow-lg hover:shadow-xl transition cursor-pointer ${
          isDarkMode 
            ? 'bg-slate-800/60 border-slate-700/40 hover:border-primary/40' 
            : 'bg-white/60 border-white/40 hover:border-primary/40'
        }`}
      >
          <CategoryIcon item={service} />

        <h3 className={`text-xl font-bold mt-5 mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {localizedService.name}
        </h3>

        <p className={`text-sm mb-6 ${
          isDarkMode ? 'text-slate-300' : 'text-gray-600'
        }`}>
          {localizedService.description || ''}
        </p>

        <div className="flex items-center justify-between text-primary font-semibold">
          <span>{t('dashboard.services.book')}</span>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
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
