interface ServiceGridCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  imagePosition: 'left' | 'right';
  index: number;
}

const ServiceGridCard = ({ title, description, image, imagePosition, index }: ServiceGridCardProps) => {
  const isImageRight = imagePosition === 'left';
  // Alternate colors: even index = #FFB200, odd index = #114C5A
  const titleColor = index % 2 === 0 ? '#FFB200' : '#114C5A';

  return (
    <div
      className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-8 ${
        isImageRight ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Image Section */}
      <div className="w-full lg:w-1/2 flex-shrink-0">
        <div className="relative w-full h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <h3
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          style={{ color: titleColor }}
        >
          {title}
        </h3>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-thin">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ServiceGridCard;

