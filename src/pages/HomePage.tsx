import { useEffect, useState } from 'react';
import HeroSection from '../components/sections/HeroSection';
import ServicesSection from '../components/sections/ServicesSection';
import PricingSection from '../components/sections/PricingSection';
import CTASection from '../components/sections/CTASection';
import FAQSection from '../components/sections/FAQSection';
import NewsletterSection from '../components/sections/NewsletterSection';
import { getConsultationBooking, type ConsultationBookingData, getTechnologiesSection, type TechnologiesSectionData } from '../storeApi/api/home.api';

const HomePage = () => {
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
  useEffect(() => {
    const fetchCtaData = async () => {
      try {
        const response = await getConsultationBooking();
        if (response.success && response.data) {
          setCtaData(response.data);
        }
      } catch (error) {
        console.error('Error fetching CTA data:', error);
      }
    };

    fetchCtaData();
  }, []);

  // جلب بيانات Technologies Section
  useEffect(() => {
    const fetchTechnologiesData = async () => {
      try {
        const response = await getTechnologiesSection();
        if (response.success && response.data) {
          setTechnologiesData(response.data);
        }
      } catch (error) {
        console.error('Error fetching Technologies data:', error);
      }
    };

    fetchTechnologiesData();
  }, []);

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

