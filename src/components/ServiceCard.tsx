interface ServiceCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  index: number;
}

const ServiceCard = ({ title, description, image, index }: ServiceCardProps) => {
  // Determine colors based on index (even = yellow, odd = dark teal)
  const isEven = index % 2 === 0;
  const bgColor = isEven ? 'bg-[#FDB103]' : 'bg-[#114C5A]';
  const textColor = isEven ? 'text-black' : 'text-white';

  return (
    <div className="!flex items-center justify-center px-2 sm:px-3 md:px-1">
      <div
        className={`${bgColor} rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow py-4 px-3 sm:py-5 sm:px-4 md:py-6 md:px-2 duration-300 flex ${isEven ? 'flex-col m-0' : 'flex-col-reverse mt-0 sm:mt-8 md:mt-16 lg:mt-32'} w-full max-w-full sm:max-w-[350px] md:max-w-[400px]`}
      >
        {/* Image Section */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-2xl md:rounded-3xl"
          />
        </div>

        {/* Content Section */}
        <div className={`p-4 sm:p-5 md:p-6 lg:p-8 flex-1 flex flex-col justify-center items-center ${textColor}`}>
          <h3 className="text-xl sm:text-2xl md:text-2xl font-bold mb-3 sm:mb-4 text-center">
            {title}
          </h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-thin leading-relaxed text-center">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

