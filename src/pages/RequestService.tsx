import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../storeApi/storeApi';
import { getServicesSection, type ServicesSectionData } from '../storeApi/api/home.api';
import { STORAGE_BASE_URL } from '../storeApi/config/constants';
import { Loader2 } from 'lucide-react';

const RequestService = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [servicesData, setServicesData] = useState<ServicesSectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServicesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const response = await getServicesSection(locale);
      if (response.success && response.data) {
        setServicesData(response.data);
      } else {
        setError(response.message || t('requestService.errorFetching'));
      }
    } catch (err) {
      setError(t('requestService.errorOccurred'));
      console.error('Error fetching services data:', err);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchServicesData();
  }, [fetchServicesData]);

  // Refetch when language changes
  useEffect(() => {
    const handleLanguageChanged = async () => {
      await fetchServicesData();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchServicesData]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Main Title */}
        <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {servicesData?.heading || t('header.requestService')}
        </h1>

        {/* Description */}
        {servicesData?.description && (
          <p className={`text-base md:text-lg lg:text-xl mb-8 text-center transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {servicesData.description}
          </p>
        )}

        {/* Gradient Line */}
        <div className="w-full max-w-4xl mx-auto mb-12">
          <div
            className="h-[7px] rounded-[50%]"
            style={{
              background: 'linear-gradient(to right, #FFB200 0%, #FFB200 50%, rgba(253, 177, 3, 0.3) 100%)'
            }}
          ></div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-[#FFB200] animate-spin" />
            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('requestService.loading')}</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className={`text-red-500 mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
            <button
              onClick={fetchServicesData}
              className="px-6 py-2 bg-[#FFB200] text-black rounded-full font-bold hover:bg-[#FDB103] transition-colors"
            >
              {t('requestService.retry')}
            </button>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && servicesData?.categories && servicesData.categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
            {servicesData.categories.map((category) => {
              const imageUrl = category.image && category.image.startsWith('http') 
                ? category.image 
                : `${STORAGE_BASE_URL}${category.image}`;

              return (
                <div
                  key={category.id}
                  className={`rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                >
                  {/* Image Section */}
                  <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  </div>

                  {/* Content Section */}
                  <div className={`p-6 flex-1 flex flex-col justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                    <h3 className={`text-xl md:text-2xl font-bold mb-3 text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {category.name}
                    </h3>
                    <p className={`text-sm md:text-base leading-relaxed text-center mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {category.description}
                    </p>
                    <button
                      onClick={() => navigate(`/discover-services?category_id=${category.id}`)}
                      className="mt-auto w-full py-2.5 px-4 bg-[#FFB200] hover:bg-[#FDB103] text-black font-semibold rounded-lg transition-colors duration-300"
                    >
                      {t('requestService.discoverServices')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Services Message */}
        {!loading && !error && (!servicesData?.categories || servicesData.categories.length === 0) && (
          <div className="text-center py-20">
            <p className={`text-lg transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('requestService.noServices')}
            </p>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <section className={`mt-20 py-16 md:py-20 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Title */}
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {t('requestService.footerTitle')}
            </h2>
            
            {/* Description */}
            <p className={`text-lg md:text-xl mb-8 leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('requestService.footerDescription')}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FFB200] hover:bg-[#FDB103] text-black font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('requestService.registerNow')}
              </button>
              <button
                onClick={() => navigate('/contact')}
                className={`w-full sm:w-auto px-8 py-3.5 border-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'border-[#FFB200] text-[#FFB200] hover:bg-[#FFB200] hover:text-black' 
                    : 'border-[#114C5A] text-[#114C5A] hover:bg-[#114C5A] hover:text-white'
                }`}
              >
                {t('requestService.contactUs')}
              </button>
            </div>

            {/* Decorative Element */}
            <div className={`mt-12 pt-12 border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-700' : 'border-gray-300/30'}`}>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#FFB200]"></div>
                <div className="w-2 h-2 rounded-full bg-[#FFB200]"></div>
                <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-[#FFB200] via-[#FFB200]/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestService;

