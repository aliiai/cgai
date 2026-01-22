import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, FileText, TrendingUp, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTechnologiesContent, type TechnologyContent } from '../storeApi/api/home.api';

interface Technology {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
}

const News = () => {
    const { i18n, t } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [activeFilter, setActiveFilter] = useState('all');
    const [latestTechnologies, setLatestTechnologies] = useState<Technology[]>([]);
    const [bestTechnologies, setBestTechnologies] = useState<Technology[]>([]);
    const [loading, setLoading] = useState(true);

    const filters = [
        { id: 'all', label: t('news.filters.all') || 'الكل', icon: LayoutGrid },
        { id: 'latest', label: t('news.filters.latest') || 'أحدث التقنيات', icon: FileText },
        { id: 'best', label: t('news.filters.best') || 'أفضل التقنيات', icon: TrendingUp },
    ];

    const fetchTechnologies = useCallback(async () => {
        try {
            setLoading(true);
            const locale = i18n.language === 'ar' ? 'ar' : 'en';
            const response = await getTechnologiesContent(locale);
            
            if (response.success && response.data) {
                // Convert API data to Technology format
                const convertToTechnology = (item: TechnologyContent): Technology => {
                    // Use first image from images array, or image, or placeholder
                    const imageUrl = item.images && item.images.length > 0 
                        ? item.images[0] 
                        : (item.image || 'https://via.placeholder.com/800x400?text=No+Image');
                    
                    return {
                        id: item.id,
                        title: item.name,
                        description: item.description || item.short_description || '',
                        image: imageUrl,
                        category: item.category.name,
                    };
                };

                const latestTechs = (response.data.latest_technologies as unknown as TechnologyContent[]) || [];
                const bestTechs = (response.data.best_technologies_of_month as unknown as TechnologyContent[]) || [];
                
                const latest = latestTechs.map(convertToTechnology);
                const best = bestTechs.map(convertToTechnology);
                
                setLatestTechnologies(latest);
                setBestTechnologies(best);
            }
        } catch (error) {
            console.error('Error fetching technologies:', error);
        } finally {
            setLoading(false);
        }
    }, [i18n.language]);

    useEffect(() => {
        fetchTechnologies();
    }, [fetchTechnologies]);

    // Refetch when language changes
    useEffect(() => {
        const handleLanguageChanged = async () => {
            await fetchTechnologies();
        };

        i18n.on('languageChanged', handleLanguageChanged);
        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, [i18n, fetchTechnologies]);

    // Get filtered items
    const getFilteredItems = (): Technology[] => {
        if (activeFilter === 'latest') {
            return latestTechnologies;
        } else if (activeFilter === 'best') {
            return bestTechnologies;
        } else {
            // Combine and remove duplicates
            const combined = [...latestTechnologies, ...bestTechnologies];
            const unique = combined.filter((item, index, self) => 
                index === self.findIndex(t => t.id === item.id)
            );
            return unique;
        }
    };

    const newsItems = getFilteredItems();

    return (
        <div className="news-page bg-white min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
                {/* Main Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 text-center">
                    {t('news.title') || 'آخر أخبار الذكاء الاصطناعي'}
                </h1>

                {/* Subtitle */}
                <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-8 text-center">
                    {t('news.subtitle') || 'أحدث أخبار، أحداث، وتقارير تقنيات الذكاء الاصطناعي في مكان واحد.'}
                </p>

                {/* Gradient Line */}
                <div className="w-full max-w-4xl mx-auto mb-8">
                    <div
                        className="h-[7px] rounded-[50%]"
                        style={{
                            background: 'linear-gradient(to right, #FFB200 0%, #FFB200 50%, rgba(253, 177, 3, 0.3) 100%)'
                        }}
                    ></div>
                </div>

                {/* Filters Section */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12" dir={isRTL ? 'rtl' : 'ltr'}>
                    {filters.map((filter) => {
                        const Icon = filter.icon;
                        const isActive = activeFilter === filter.id;
                        return (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 border-2 font-bold text-lg
                                    ${isActive
                                        ? 'bg-[#FFB200] text-white border-[#FFB200] shadow-lg shadow-orange-200/50 scale-105'
                                        : 'bg-white text-[#FFB200] border-[#FFB200] hover:bg-[#FFB200] hover:text-white hover:shadow-lg hover:shadow-orange-200/50'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{filter.label}</span>
                            </button>
                        );
                    })}
                </div>





                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-[#FFB200] animate-spin" />
                    </div>
                ) : newsItems.length > 0 ? (
                    /* Cards Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {newsItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-[16px] border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            {/* Image Container */}
                            <div className="mb-4">
                                <div className="relative aspect-[16/8] overflow-hidden rounded-[16px]">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="px-8 pb-8 pt-2" dir={isRTL ? 'rtl' : 'ltr'}>
                                {/* Badge */}
                                <div className="flex justify-start mb-4">
                                    <span className="bg-[#FFB200] text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                        {item.category}
                                    </span>
                                </div>

                                {/* Title with Icon - Adjusted for RTL to match image */}
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-2xl font-extrabold text-[#2D3142]">
                                        {item.title}
                                    </h3>
                                    <ExternalLink className="w-6 h-6 text-[#FFB200]" />
                                </div>

                                {/* Description */}
                                <p className="text-gray-500 leading-relaxed text-md font-medium text-justify">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-lg">لا توجد تقنيات متاحة حالياً</p>
                    </div>
                )}
            </div>




            <div>
                
            </div>
        </div>
    );
};

export default News;
