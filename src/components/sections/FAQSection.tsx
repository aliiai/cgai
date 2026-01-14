import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { getFAQs, type FAQ } from '../../storeApi/api';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [faqsData, setFaqsData] = useState<{ [category: string]: FAQ[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      try {
        const response = await getFAQs();
        if (response.success && response.data) {
          setFaqsData(response.data);
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

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
    <section className="py-12 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-white via-gray-50 to-primary/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black text-gray-900 mb-3 md:mb-4 lg:mb-6 leading-tight px-4">
          الأسئلة الشائعة
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

                    return (
                      <div
                        key={faqId}
                        className={`
                          bg-[#EEEEEE] rounded-xl md:rounded-2xl transition-all duration-300`}
                      >
                        <button
                          className="w-full p-2 text-right flex justify-between items-center gap-4 transition-all duration-300 group"
                          onClick={() => toggleFAQ(faqId)}
                        >
                          <span className={`
                            text-sm sm:text-base md:text-lg font-bold 
                            transition-colors duration-300
                          `}>
                            {faq.question}
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
                              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                                {faq.answer}
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
                  <p className="text-gray-500 text-sm md:text-base">لا توجد أسئلة في هذه الفئة</p>
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

