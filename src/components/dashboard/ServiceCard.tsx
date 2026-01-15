import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Service } from '../../types/types';
import CategoryIcon from './CategoryIcon';
import ServicePopup from './ServicePopup ';
import { useLocalized } from '../../hooks/useLocalized';

interface ServiceCardProps {
  service: Service;
  onOpenConsultations?: () => void;
}

const ServiceCard = ({ service, onOpenConsultations }: ServiceCardProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const localizedService = useLocalized(service, ['name', 'description']);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="group bg-white border border-[#114C5A]/20 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#114C5A]/40 transition-all cursor-pointer"
      >
          <CategoryIcon item={service} />

        <h3 className="text-lg font-semibold text-[#114C5A] mt-4 mb-2">
          {localizedService.name}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {localizedService.description || ''}
        </p>

        <div className="flex items-center justify-between text-[#114C5A] font-medium text-sm pt-3 border-t border-[#114C5A]/10">
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
