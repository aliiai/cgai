import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import SectionHeader from '../SectionHeader';
import ServicesSlider from '../ServicesSlider';
import ServicesGrid from '../ServicesGrid';
import { getCompanyLogos, getServicesSection, getReadyAppsSection, type CompanyLogo, type ServicesSectionData, type ReadyAppsSectionData } from '../../storeApi/api/home.api';

import { useThemeStore } from '../../storeApi/store/theme.store';

const ServicesSection = () => {
  const { isDarkMode } = useThemeStore();
  const { i18n } = useTranslation();
  // ... state ...
  const [companyLogosData, setCompanyLogosData] = useState<{
    heading: string;
    logos: CompanyLogo[];
  } | null>(null);
  const [servicesData, setServicesData] = useState<ServicesSectionData | null>(null);
  const [readyAppsData, setReadyAppsData] = useState<ReadyAppsSectionData | null>(null);
  const [loadingLogos, setLoadingLogos] = useState(true);

  // Fetch company logos from API
  const fetchCompanyLogos = useCallback(async () => {
    try {
      setLoadingLogos(true);
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const response = await getCompanyLogos(locale);
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
  }, [i18n.language]);

  const fetchServicesData = useCallback(async () => {
    try {
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const response = await getServicesSection(locale);
      if (response.success && response.data) {
        setServicesData(response.data);
      }
    } catch (error) {
      console.error('Error fetching services data:', error);
    }
  }, [i18n.language]);

  const fetchReadyAppsData = useCallback(async () => {
    try {
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const response = await getReadyAppsSection(locale);
      if (response.success && response.data) {
        setReadyAppsData(response.data);
      }
    } catch (error) {
      console.error('Error fetching ready apps data:', error);
    }
  }, [i18n.language]);

  // جلب البيانات عند التحميل الأولي وعند تغيير اللغة
  useEffect(() => {
    console.log('Language changed to:', i18n.language, '- Refetching services data...');
    fetchCompanyLogos();
    fetchServicesData();
    fetchReadyAppsData();
  }, [i18n.language, fetchCompanyLogos, fetchServicesData, fetchReadyAppsData]);

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

  // Array of services for slider (from API only)
  const sliderServices = useMemo(() => {
    if (!servicesData?.categories || servicesData.categories.length === 0) {
      return [];
    }
    return servicesData.categories.map(cat => ({
      id: cat.id,
      title: cat.name,
      description: cat.description,
      image: cat.image
    }));
  }, [servicesData]);

  // Array of service cards for grid display (from API only)
  const serviceCards = useMemo(() => {
    if (!readyAppsData?.categories || readyAppsData.categories.length === 0) {
      return [];
    }
    return readyAppsData.categories.map((cat, index) => ({
      id: cat.id,
      title: cat.name,
      description: cat.description,
      image: cat.image,
      imagePosition: index % 2 === 0 ? 'right' as const : 'left' as const
    }));
  }, [readyAppsData]);

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
    <section className={`py-8 sm:py-12 md:py-16 lg:py-20 min-h-screen lg:h-auto transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'
      }`}>
      {/* Companies Marquee */}
      {companyLogosData && (
        <>
          <p className={`text-center text-[18px] md:text-[24px] lg:text-[40px] font-thin mb-10 ${isDarkMode ? 'text-white' : 'text-black'
            }`}>
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

      {/* Services Section - Only show if data exists */}
      {servicesData && (
        <>
          <SectionHeader
            title={servicesData.heading}
            subtitle={servicesData.description}
          />

          {/* Services Slider - Only show if there are services */}
          {sliderServices.length > 0 && (
            <ServicesSlider services={sliderServices} />
          )}
        </>
      )}

      {/* Ready Apps Section - Only show if data exists */}
      {readyAppsData && (
        <>
          <SectionHeader
            title={readyAppsData.heading}
            subtitle={readyAppsData.description}
          />

          {/* Services Grid Cards - Only show if there are cards */}
          {serviceCards.length > 0 && (
            <ServicesGrid serviceCards={serviceCards} />
          )}
        </>
      )}

    </section>
  );
};

export default ServicesSection;

