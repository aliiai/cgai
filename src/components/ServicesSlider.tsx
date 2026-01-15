import { useMemo, useRef } from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { useThemeStore } from '../storeApi/store/theme.store';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface ServicesSliderProps {
  services: Service[];
}

const ServicesSlider = ({ services }: ServicesSliderProps) => {
  const { isDarkMode } = useThemeStore();
  const sliderRef = useRef<Slider>(null);

  const duplicatedServices = useMemo(() => {
    const repetitions = 60;
    const repeated = [];
    for (let i = 0; i < repetitions; i++) {
      repeated.push(...services);
    }
    return repeated;
  }, [services]);

  const servicesSettings: Settings = useMemo(() => ({
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'ease-in-out',
    arrows: true,
    dots: false,
    pauseOnHover: true,
    pauseOnFocus: true,
    swipe: true,
    draggable: true,
    touchMove: true,
    variableWidth: false,
    rtl: false,
    useCSS: true,
    useTransform: true,
    waitForAnimate: false,
    initialSlide: 30,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          initialSlide: 30,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          initialSlide: 30,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          initialSlide: 30,
        },
      },
    ],
  }), []);

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 mt-8 sm:mt-12 md:mt-16">
      <div className="relative px-16 w-full">
        <button
          onClick={handlePrev}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-50 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-primary' : 'bg-white hover:bg-gray-100 text-blue-600'
            }`}
          aria-label="Previous slide"
          type="button"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <Slider ref={sliderRef} {...servicesSettings} className="services-slider containerCardService">
          {duplicatedServices.map((service, index) => (
            <ServiceCard
              key={`service-${index}`}
              id={service.id}
              title={service.title}
              description={service.description}
              image={service.image}
              index={index}

            />
          ))}
        </Slider>

        <button
          onClick={handleNext}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-50 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-primary' : 'bg-white hover:bg-gray-100 text-blue-600'
            }`}
          aria-label="Next slide"
          type="button"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ServicesSlider;