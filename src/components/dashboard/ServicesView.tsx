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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onOpenConsultations={onOpenConsultations}
          // onBook={onBookService}
        />
      ))}
    </div>
  );
};

export default ServicesView;

