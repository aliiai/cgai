import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { useThemeStore } from '../../storeApi/store/theme.store';
import { Search, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getHelpGuide, type HelpGuideItem } from '../../storeApi/api/help.api';
import { localizeField } from '../../utils/localization';

const Help = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [helpData, setHelpData] = useState<HelpGuideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const { i18n } = useTranslation();
  
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
    navigate('/dashboard/support');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <DashboardPageHeader title={t('dashboard.help.title')} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
            <p className={`font-bold ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>{t('dashboard.help.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <DashboardPageHeader title={t('dashboard.help.title')} />
        <div className="bg-red-50 border border-red-200 rounded-[32px] p-8 text-center">
          <p className="text-red-600 font-bold">{error}</p>
          <button
            onClick={fetchHelpGuide}
            className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all"
          >
            {t('common.reload') || 'إعادة المحاولة'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <DashboardPageHeader title={t('dashboard.help.title')} subtitle={t('dashboard.help.subtitle')} />
      
      {/* Search Help */}
      <div className={`rounded-2xl p-6 border shadow-sm ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="relative">
          <Search className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-400'
          }`} />
          <input
            type="text"
            placeholder={t('dashboard.help.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pr-12 pl-4 py-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' 
                : 'bg-slate-50 border-slate-200'
            }`}
          />
        </div>
      </div>

      {/* Help Guide Items - Accordion Style */}
      {filteredData.length === 0 ? (
        <div className={`rounded-2xl p-12 border shadow-sm text-center ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          <p className={`font-bold text-lg ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>{t('dashboard.help.noDataMessage')}</p>
        </div>
      ) : (
        <div className={`rounded-2xl border shadow-sm overflow-hidden ${
          isDarkMode 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-slate-200'
        }`}>
          {filteredData.map((item, index) => {
            const isExpanded = expandedItems.has(item.id);
            const title = localizeField(item.title, item.title_en);
            const content = localizeField(item.content, item.content_en);
            const isLast = index === filteredData.length - 1;

            return (
              <div
                key={item.id}
                className={`border-b last:border-b-0 transition-all ${
                  isDarkMode 
                    ? `border-slate-700 ${isExpanded ? 'bg-slate-700/50' : 'bg-slate-800 hover:bg-slate-700/30'}`
                    : `border-slate-200 ${isExpanded ? 'bg-slate-50/50' : 'bg-white hover:bg-slate-50/30'}`
                }`}
              >
                <button
                  onClick={() => toggleExpand(item.id)}
                  className={`w-full px-6 py-5 flex items-center justify-between gap-4 text-right transition-colors group ${
                    isDarkMode 
                      ? 'hover:bg-slate-700/50' 
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <i className={`${getIconClass(item.icon)} text-lg`}></i>
                    </div>
                    <h3 className={`text-lg font-black flex-1 text-right group-hover:text-primary transition-colors ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {title}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className={`w-5 h-5 group-hover:text-primary transition-colors ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-400'
                      }`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 group-hover:text-primary transition-colors ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-400'
                      }`} />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 pr-20 animate-fadeIn">
                    <div className={`text-sm leading-relaxed whitespace-pre-line border-r-4 border-primary/20 pr-4 py-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
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
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black mb-1">{t('dashboard.help.contactTitle')}</h3>
            <p className="text-white/80 text-sm">{t('dashboard.help.contactSubtitle')}</p>
          </div>
        </div>
        <button
          onClick={handleContactSupport}
          className="mt-4 px-6 py-3 bg-white text-primary rounded-xl font-bold hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl"
        >
          {t('dashboard.help.contactButton')}
        </button>
      </div>
    </div>
  );
};

export default Help;
