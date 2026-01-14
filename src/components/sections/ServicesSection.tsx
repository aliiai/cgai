import { useMemo, useState, useEffect } from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import serviceImage from '../../assets/images/bgHero.jpg';
import SectionHeader from '../SectionHeader';
import ServicesSlider from '../ServicesSlider';
import ServicesGrid from '../ServicesGrid';
import { getCompanyLogos, type CompanyLogo } from '../../storeApi/api/home.api';

const ServicesSection = () => {
  // State for company logos data
  const [companyLogosData, setCompanyLogosData] = useState<{
    heading: string;
    logos: CompanyLogo[];
  } | null>(null);
  const [loadingLogos, setLoadingLogos] = useState(true);

  // Fetch company logos from API
  useEffect(() => {
    const fetchCompanyLogos = async () => {
      try {
        setLoadingLogos(true);
        const response = await getCompanyLogos();
        if (response.success && response.data) {
          setCompanyLogosData({
            heading: response.data.heading,
            logos: response.data.logos,
          });
        }
      } catch (error) {
        console.error('Error fetching company logos:', error);
      } finally {
        setLoadingLogos(false);
      }
    };

    fetchCompanyLogos();
  }, []);

  // Array of company logos (from API)
  const companies = useMemo(() => {
    if (!companyLogosData?.logos) return [];
    return companyLogosData.logos.map((logo, index) => ({
      id: index + 1,
      logo: logo.image,
      link: logo.link,
      name: logo.name,
    }));
  }, [companyLogosData]);

  // Array of services for slider
  const services = useMemo(() => [
    {
      id: 1,
      title: 'تصميم وتجربة مستخدم',
      description: 'واجهات بسيطة وفعالة تركّز على المستخدم.',
      image: serviceImage,
    },
    {
      id: 2,
      title: 'أنظمة برمجية ذكية',
      description: 'أنظمة مرنة تدعم الأتمتة وتحسين الأداء.',
      image: serviceImage,
    },
    {
      id: 3,
      title: 'حلول ذكاء اصطناعي',
      description: 'نماذج جاهزة ومخصصة قابلة للتطبيق الفوري.',
      image: serviceImage,
    },

  ], []);

  // Array of service cards for grid display
  const serviceCards = useMemo(() => [
    {
      id: 1,
      title: 'الذكاء الاصطناعي',
      description: 'نوفر نماذج جاهزة أو مخصصة تساعدك على تحسين الأداء واتخاذ قرارات ذكية بشكل عملي وسهل.',
      image: serviceImage,
      imagePosition: 'right' as const, // Image on right, text on left
    },
    {
      id: 2,
      title: 'تطوير البرمجيات',
      description: 'تصميم وتطوير أنظمة ومنصات رقمية متقدمة، مع دمج الذكاء الاصطناعي لتعزيز الأتمتة وتحسين العمليات اليومية.',
      image: serviceImage,
      imagePosition: 'left' as const, // Image on left, text on right
    },
    {
      id: 3,
      title: 'التصميم وتجربة المستخدم',
      description: 'تصميم واجهات وتجارب مستخدم جذابة وبسيطة، تركز على التفاعل السلس وسهولة الاستخدام.',
      image: serviceImage,
      imagePosition: 'right' as const, // Image on right, text on left
    },
    {
      id: 4,
      title: 'البيانات والتحليلات',
      description: 'تحليل وتنظيم البيانات وتحويلها إلى رؤى واضحة وتقارير دقيقة لدعم اتخاذ القرارات الاستراتيجية.',
      image: serviceImage,
      imagePosition: 'left' as const, // Image on left, text on right
    },
  ], []);

  // Repeat companies multiple times for seamless infinite loop
  const repeatedCompanies = useMemo(() => {
    // Repeat enough times to ensure seamless scrolling
    return [...companies, ...companies, ...companies, ...companies, ...companies];
  }, [companies]);

  // Slick settings for marquee effect
  const settings: Settings = useMemo(() => ({
    infinite: true,
    speed: 5000, // Slow speed for continuous movement
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // Continuous movement without delay
    cssEase: 'linear', // Linear easing for constant speed
    arrows: false,
    dots: false,
    pauseOnHover: false,
    pauseOnFocus: false,
    swipe: false,
    draggable: false,
    touchMove: false,
    variableWidth: true,
    rtl: false,
    useCSS: true, // Use CSS transitions for smoother animation
    useTransform: true, // Use transform for better performance
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  }), []);


  // Handle logo click - navigate to link
  const handleLogoClick = (link: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white min-h-screen lg:h-auto">
      {/* Companies Marquee */}
      {companyLogosData && (
        <>
          <p className='text-center text-[18px] md:text-[24px] lg:text-[40px] font-thin text-black mb-10'>
            {companyLogosData.heading}
          </p>
          {!loadingLogos && companies.length > 0 && (
            <div className="relative w-full overflow-hidden bg-primary py-2 md:py-8">
              <Slider {...settings} className="companies-marquee-slider">
                {repeatedCompanies.map((company, index) => (
                  <div
                    key={`${company.id}-${index}`}
                    className="!flex items-center justify-center px-8"
                  >
                    <div 
                      className="flex items-center justify-center h-16 md:h-20 cursor-pointer"
                      onClick={() => handleLogoClick(company.link)}
                    >
                      <img
                        src={company.logo}
                        alt={company.name || `Company logo ${company.id}`}
                        className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </>
      )}

      <SectionHeader
        title="نبني حلول رقمية ذكية تُحدث فرقًا حقيقيًا"
        subtitle="حلول ذكاء اصطناعي وأنظمة ذكية وتجارب مستخدم مصممة لاحتياجات أعمالك."
      />

      {/* Services Slider */}
      <ServicesSlider services={services} />

      <SectionHeader
        title="خدماتنا"
        subtitle="حلول متكاملة لدعم أعمالك بالذكاء الاصطناعي، البرمجة، التصميم، وتحليل البيانات."
      />

      {/* Services Grid Cards */}
      <ServicesGrid serviceCards={serviceCards} />

    </section>
  );
};

export default ServicesSection;

