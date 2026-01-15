import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { Search, MessageCircle, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { getHelpGuide, type HelpGuideItem } from '../../storeApi/api/help.api';
import { localizeField } from '../../utils/localization';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';

const Help = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  const [helpData, setHelpData] = useState<HelpGuideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  
  const fetchHelpGuide = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getHelpGuide();
      
      if (response.success) {
        // ترتيب البيانات حسب sort_order
        const sortedData = [...response.data].sort((a, b) => a.sort_order - b.sort_order);
        setHelpData(sortedData);
        // توسيع أول عنصر افتراضياً
        if (sortedData.length > 0) {
          setExpandedItems(new Set([sortedData[0].id]));
        }
      } else {
        setError(response.message || t('dashboard.help.errorMessage'));
      }
    } catch (err) {
      console.error('Error fetching help guide:', err);
      setError(t('dashboard.help.errorMessage'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchHelpGuide();
  }, [fetchHelpGuide]);

  // إعادة جلب البيانات عند تغيير اللغة
  useEffect(() => {
    fetchHelpGuide();
  }, [i18n.language, fetchHelpGuide]);

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredData = helpData.filter((item) => {
    if (!searchTerm) return true;
    const title = localizeField(item.title, item.title_en);
    const content = localizeField(item.content, item.content_en);
    const searchLower = searchTerm.toLowerCase();
    return title.toLowerCase().includes(searchLower) || content.toLowerCase().includes(searchLower);
  });

  const getIconClass = (icon: string) => {
    // دعم Font Awesome icons
    if (icon.startsWith('fas ') || icon.startsWith('far ') || icon.startsWith('fab ')) {
      return icon;
    }
    // إذا لم تكن Font Awesome، نستخدم icon افتراضي
    return 'fas fa-info-circle';
  };

  const handleContactSupport = () => {
    navigate('/admin/support');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader title={t('dashboard.help.title')} />
        <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm p-12">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader title={t('dashboard.help.title')} />
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center shadow-sm">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchHelpGuide}
            className="px-6 py-3 bg-[#114C5A] text-white rounded-xl font-semibold hover:bg-[#114C5A]/90 transition-all shadow-md hover:shadow-lg"
          >
            {t('common.reload') || 'إعادة المحاولة'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader title={t('dashboard.help.title')} subtitle={t('dashboard.help.subtitle')} />
      
      {/* Search Help */}
      <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm p-4">
        <div className="relative group">
          <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#114C5A] transition-colors`} />
          <input
            type="text"
            placeholder={t('dashboard.help.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-[#114C5A]/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] transition-all bg-gray-50 text-gray-900 placeholder:text-gray-400`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      {/* Help Guide Items - Accordion Style */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm p-12">
          <EmptyState 
            message={t('dashboard.help.noDataMessage') || 'لا توجد نتائج'}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm overflow-hidden">
          {filteredData.map((item, index) => {
            const isExpanded = expandedItems.has(item.id);
            const title = localizeField(item.title, item.title_en);
            const content = localizeField(item.content, item.content_en);

            return (
              <div
                key={item.id}
                className={`border-b last:border-b-0 transition-all ${
                  isExpanded 
                    ? 'bg-[#114C5A]/5 border-[#114C5A]/20' 
                    : 'bg-white hover:bg-gray-50/50 border-gray-100'
                }`}
              >
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isExpanded
                        ? 'bg-[#114C5A] text-white'
                        : 'bg-[#114C5A]/10 text-[#114C5A] group-hover:bg-[#114C5A]/20'
                    }`}>
                      <i className={`${getIconClass(item.icon)} text-lg`}></i>
                    </div>
                    <h3 className={`text-base font-bold flex-1 transition-colors ${
                      isRTL ? 'text-right' : 'text-left'
                    } ${
                      isExpanded ? 'text-[#114C5A]' : 'text-gray-900 group-hover:text-[#114C5A]'
                    }`}>
                      {title}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className={`w-5 h-5 transition-colors ${
                        isExpanded ? 'text-[#114C5A]' : 'text-gray-400'
                      }`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 transition-colors ${
                        isExpanded ? 'text-[#114C5A]' : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className={`px-6 pb-6 ${isRTL ? 'pr-20' : 'pl-20'} animate-fadeIn`}>
                    <div className={`text-sm leading-relaxed whitespace-pre-line border-[#114C5A]/20 py-2 text-gray-700 ${
                      isRTL ? 'border-r-4 pr-4' : 'border-l-4 pl-4'
                    }`}>
                      {content}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-[#114C5A] to-[#114C5A]/90 rounded-xl p-8 text-white shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{t('dashboard.help.contactTitle')}</h3>
            <p className="text-white/90 text-sm">{t('dashboard.help.contactSubtitle')}</p>
          </div>
        </div>
        <button
          onClick={handleContactSupport}
          className="px-6 py-3 bg-white text-[#114C5A] rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
        >
          {t('dashboard.help.contactButton')}
        </button>
      </div>
    </div>
  );
};

export default Help;
