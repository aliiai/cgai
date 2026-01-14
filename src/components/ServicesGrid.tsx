import ServiceGridCard from './ServiceGridCard';

interface ServiceCard {
  id: number;
  title: string;
  description: string;
  image: string;
  imagePosition: 'left' | 'right';
}

interface ServicesGridProps {
  serviceCards: ServiceCard[];
}

const ServicesGrid = ({ serviceCards }: ServicesGridProps) => {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-16 mb-24">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 lg:gap-12">
        {serviceCards.map((card, index) => (
          <ServiceGridCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            image={card.image}
            imagePosition={card.imagePosition}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesGrid;

