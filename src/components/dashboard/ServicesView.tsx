import type { Service } from '../../types/types';
import ServiceCard from './ServiceCard';

interface ServicesViewProps {
  services: Service[];
  onOpenConsultations?: () => void;
  // onBookService?: (service: Service) => void;
}

const ServicesView = ({ services, onOpenConsultations }: ServicesViewProps) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onOpenConsultations={onOpenConsultations}
        />
      ))}
    </div>
  );
};

export default ServicesView;

