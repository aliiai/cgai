import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/sections/HeroSection';
import ServicesSection from '../components/sections/ServicesSection';
import PricingSection from '../components/sections/PricingSection';
import CTASection from '../components/sections/CTASection';
import FAQSection from '../components/sections/FAQSection';
import NewsletterSection from '../components/sections/NewsletterSection';
import { getConsultationBooking, type ConsultationBookingData, getTechnologiesSection, type TechnologiesSectionData } from '../storeApi/api/home.api';

const HomePage = () => {
  const { i18n } = useTranslation();
  const [ctaData, setCtaData] = useState<ConsultationBookingData | undefined>(undefined);
  const [technologiesData, setTechnologiesData] = useState<TechnologiesSectionData | undefined>(undefined);

  // التأكد من أن الصفحة تبدأ من الأعلى عند التحميل
  useEffect(() => {
    // إزالة hash من URL عند تحميل الصفحة
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    
    // التمرير إلى الأعلى
    window.scrollTo(0, 0);
  }, []);

  // جلب بيانات Consultation Booking Section
  const fetchCtaData = useCallback(async () => {
    try {
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const response = await getConsultationBooking(locale);
      if (response.success && response.data) {
        setCtaData(response.data);
      }
    } catch (error) {
      console.error('Error fetching CTA data:', error);
    }
  }, [i18n.language]);

  // جلب بيانات Technologies Section
  const fetchTechnologiesData = useCallback(async () => {
    try {
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const response = await getTechnologiesSection(locale);
      if (response.success && response.data) {
        setTechnologiesData(response.data);
      }
    } catch (error) {
      console.error('Error fetching Technologies data:', error);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchCtaData();
  }, [fetchCtaData]);

  useEffect(() => {
    fetchTechnologiesData();
  }, [fetchTechnologiesData]);

  // إعادة جلب البيانات عند تغيير اللغة
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching home page data...');
      await fetchCtaData();
      await fetchTechnologiesData();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchCtaData, fetchTechnologiesData]);

  return (
    <div className="home-page">
      <section id="hero">
        <HeroSection />
      </section>
      <section id="services">
        <ServicesSection />
      </section>
      <section id="pricing">
        <PricingSection />
      </section>
      <section id="cta">
        <CTASection data={ctaData} />
      </section>
      <section id="faq">
        <FAQSection />
      </section>
      <section id="newsletter">
        <NewsletterSection data={technologiesData} />
      </section>
    </div>
  );
};

export default HomePage;

