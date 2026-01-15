import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { getFAQs, type FAQ } from '../../storeApi/api';
import { useThemeStore } from '../../storeApi/store/theme.store';

const FAQSection = () => {
  const { isDarkMode } = useThemeStore();
  const { i18n, t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  // ... rest of the code ...
  const [faqsData, setFaqsData] = useState<{ [category: string]: FAQ[] }>({});
  const [loading, setLoading] = useState(true);

  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    try {
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const response = await getFAQs(locale);
      if (response.success && response.data) {
        setFaqsData(response.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  // إعادة جلب البيانات عند تغيير اللغة
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching FAQs...');
      await fetchFAQs();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchFAQs]);

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  // Collect all FAQs from all categories into a single array
  const allFAQs: Array<FAQ & { category: string }> = [];
  Object.keys(faqsData).forEach((category) => {
    faqsData[category].forEach((faq) => {
      allFAQs.push({ ...faq, category });
    });
  });

  return (
    <section className={`py-12 md:py-16 lg:py-20 xl:py-24 relative overflow-hidden transition-colors duration-300 ${isDarkMode
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-800'
      : 'bg-gradient-to-br from-white via-gray-50 to-primary/5'
      }`}>
      {/* Background Elements */}
      <div className={`absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slow ${isDarkMode ? 'bg-primary/5' : 'bg-gradient-to-br from-primary/10 to-transparent'
        }`} />
      <div className={`absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full blur-3xl animate-pulse-slow ${isDarkMode ? 'bg-primary/5' : 'bg-gradient-to-tr from-primary/10 to-transparent'
        }`} style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black text-gray-900 mb-3 md:mb-4 lg:mb-6 leading-tight px-4  ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('home.faq.title')}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* FAQs List */}
            <div className="max-w-7xl mx-auto">
              {allFAQs.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {allFAQs.map((faq) => {
                    const faqId = `${faq.category}-${faq.id}`;
                    const isOpen = openIndex === faqId;
                    
                    // عرض البيانات مباشرة كما تأتي من API
                    const question = faq.question_en || faq.question || '';
                    const answer = faq.answer_en || faq.answer || '';

                    return (
                      <div
                        key={faqId}
                        className={`
                          rounded-xl md:rounded-2xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-[#EEEEEE]'
                          }`}
                      >
                        <button
                          className="w-full p-2 text-right flex justify-between items-center gap-4 transition-all duration-300 group"
                          onClick={() => toggleFAQ(faqId)}
                        >
                          <span className={`
                            text-sm sm:text-base md:text-lg font-bold 
                            transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
                            }
                          `}>
                            {question}
                          </span>
                          <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                            <svg
                              className={`transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
                              width="32"
                              height="32"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8 12L2.5 5H13.5L8 12Z"
                                fill="#FFB200"
                                rx="1"
                                style={{
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                                }}
                              />
                            </svg>
                          </div>
                        </button>

                        <div
                          className={`
                            overflow-hidden transition-all duration-300
                            ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                          `}
                        >
                          <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 ">
                            <div className=" ">
                              <p className={`text-xs sm:text-sm md:text-base leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                {answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 md:py-16">
                  <p className="text-gray-500 text-sm md:text-base">{t('home.faq.noQuestions')}</p>
                </div>
              )}
            </div>

          </>
        )}
      </div>
    </section>
  );
};

export default FAQSection;

