import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AuthButtons from '../AuthButtons';
import { getHero, type HeroData } from '../../storeApi/api/home.api';
import { Loader2 } from 'lucide-react';
import { useThemeStore } from '../../storeApi/store/theme.store';

const HeroSection = () => {
  const { isDarkMode } = useThemeStore();
  const { i18n } = useTranslation();
  // ... state ...
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const fetchHeroData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const response = await getHero(locale);
      if (response.success && response.data) {
        setHeroData(response.data);
      } else {
        setError(response.message || 'فشل في جلب البيانات');
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      setError('حدث خطأ أثناء جلب البيانات');
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchHeroData();
  }, [fetchHeroData]);

  // إعادة جلب البيانات عند تغيير اللغة
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching hero data...');
      await fetchHeroData();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchHeroData]);
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: isDarkMode ? 0.85 : 0.7,
      transition: {
        duration: 1.2,
        ease: 'easeOut' as const,
      },
    },
  };

  // Use API data or fallback to default
  const heading = heroData?.heading || 'نبني حلول ذكاء اصطناعي';
  const subheading = heroData?.subheading || 'تحوّل أفكارك إلى واقع';
  const description = heroData?.description || 'الدليل الشامل منصة متكاملة تجمع تقنيات الذكاء الاصطناعي، الخدمات البرمجية، التصميم، والبيانات، مع حلول جاهزة ومخصصة وحجز خبراء بالساعة لتنفيذ المشاريع بكفاءة ومرونة.';

  // Handle background image with fallback
  const getBackgroundImage = () => {
    if (imageError || !heroData?.background_image) {
      return;
    }
    return heroData.background_image;
  };

  const backgroundImage = getBackgroundImage();

  // Handle buttons with validation
  const buttons = heroData?.buttons && heroData.buttons.length > 0
    ? heroData.buttons.map(btn => {
        // Remove navigation for request-service and contact links
        if (btn.link === '/request-service' || btn.link === '/contact' || btn.link === '/contact-us') {
          return {
            ...btn,
            link: '#',
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              // Do nothing - prevent navigation
            }
          };
        }
        return btn;
      })
    : [
      {
        title: 'ابدأ الآن',
        link: '/register',
        target: '_self' as const,
        style: 'primary' as const
      },
      {
        title: 'تواصل معنا',
        link: '#',
        target: '_self' as const,
        style: 'secondary' as const
      }
    ];

  // Convert API buttons to AuthButtons format with validation
  const authButtons = buttons
    .filter(btn => btn && btn.title && btn.link) // Filter out invalid buttons
    .map(btn => ({
      label: btn.title,
      path: btn.link.startsWith('http') ? btn.link : btn.link,
      variant: btn.style === 'primary' ? 'primary' as const : 'secondary' as const,
      icon: btn.style === 'primary' ? 'arrow' as const : undefined,
    }));

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <section className="w-full h-[90vh] relative overflow-hidden bg-cover bg-center flex items-center justify-center" >
        <div className={`absolute inset-0 z-0 transition-colors duration-500 opacity-70 ${isDarkMode ? 'bg-black' : 'bg-gradient-to-bottom from-[#134755] to-[#634500]'
          }`}></div>
        <div className="relative z-10 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <p className="text-white/80 text-sm">جاري تحميل المحتوى...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-[90vh] lg:h-[100vh] relative overflow-hidden bg-cover bg-center flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-500"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        onError={handleImageError}
      >
        {/* Preload image to check if it exists */}
        <img
          src={heroData?.background_image}
          alt=""
          className="hidden"
          onError={handleImageError}
          onLoad={() => setImageError(false)}
        />
      </div>

      {/* Gradient Overlay with Animation */}
      <motion.div
        className="absolute inset-0 z-0 transition-colors duration-500"
        style={{
          background: isDarkMode
            ? 'linear-gradient(to bottom, #020617 0%, #0f172a 100%)'
            : 'linear-gradient(to bottom, #134755 0%, #634500 100%)',
        }}
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      ></motion.div>

      {/* Error Message */}
      {error && !heroData && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Content Container with Animation */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center lg:max-w-6xl xl:max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Headline with Animation */}
        <motion.h1
          className="text-3xl md:text-6xl lg:text-[64px] xl:text-[72px] 2xl:text-[80px] text-white mb-6 font-extrabold sm:!leading-normal lg:!leading-normal"
          variants={itemVariants}
        >
          {heading && (
            <span className='text-[#FFB200] font-extrabold'> {heading} </span>
          )}
          {subheading && (
            <span className="ml-2">{subheading}</span>
          )}
        </motion.h1>

        {/* Description with Animation */}
        {description && (
          <motion.p
            className="text-[md] md:text-[24px] lg:text-[26px] xl:text-[28px] 2xl:text-[30px] text-white mb-10 leading-relaxed mx-auto font-thin max-w-4xl lg:max-w-5xl xl:max-w-6xl"
            variants={itemVariants}
          >
            {description}
          </motion.p>
        )}

        {/* Call to Action Buttons with Animation */}
        {authButtons.length > 0 && (
          <motion.div
            className="flex items-center justify-center gap-4 flex-wrap lg:gap-6 xl:gap-8"
            variants={itemVariants}
          >
            <AuthButtons buttons={authButtons} />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default HeroSection;

