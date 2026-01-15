import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, FileText, TrendingUp, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface Technology {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
}

// Static data
const latestTechnologies: Technology[] = [
    {
        id: 1,
        title: 'تطورات جديدة في الذكاء الاصطناعي',
        description: 'اكتشف أحدث التطورات في مجال الذكاء الاصطناعي والتعلم الآلي التي ستغير مستقبل التكنولوجيا.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=400',
        category: 'ذكاء اصطناعي'
    },
    {
        id: 2,
        title: 'مستقبل التعلم الآلي',
        description: 'كيف سيغير التعلم الآلي طريقة عملنا وحياتنا اليومية في السنوات القادمة.',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800&h=400',
        category: 'تعلم آلي'
    },
    {
        id: 3,
        title: 'تطبيقات الذكاء الاصطناعي في الطب',
        description: 'استكشف كيف يساعد الذكاء الاصطناعي في تحسين الرعاية الصحية والتشخيص الطبي.',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800&h=400',
        category: 'صحة'
    },
    {
        id: 4,
        title: 'الذكاء الاصطناعي في التعليم',
        description: 'كيف يمكن للذكاء الاصطناعي أن يحدث ثورة في مجال التعليم والتعلم.',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800&h=400',
        category: 'تعليم'
    }
];

const bestTechnologies: Technology[] = [
    {
        id: 5,
        title: 'أفضل أدوات الذكاء الاصطناعي لعام 2024',
        description: 'تعرف على أفضل وأحدث أدوات الذكاء الاصطناعي التي يجب أن تعرفها هذا العام.',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800&h=400',
        category: 'أدوات'
    },
    {
        id: 6,
        title: 'الذكاء الاصطناعي في الأعمال',
        description: 'كيف تستخدم الشركات الذكاء الاصطناعي لتحسين عملياتها وزيادة الإنتاجية.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=400',
        category: 'أعمال'
    },
    {
        id: 7,
        title: 'أمان الذكاء الاصطناعي',
        description: 'التحديات والحلول المتعلقة بأمان أنظمة الذكاء الاصطناعي وحماية البيانات.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800&h=400',
        category: 'أمان'
    },
    {
        id: 8,
        title: 'الذكاء الاصطناعي والبيئة',
        description: 'كيف يمكن للذكاء الاصطناعي أن يساعد في حل المشاكل البيئية والاستدامة.',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800&h=400',
        category: 'بيئة'
    }
];

const News = () => {
    const { t } = useTranslation();
    const isRTL = true; // Always RTL for Arabic content
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = [
        { id: 'all', label: t('news.filters.all') || 'الكل', icon: LayoutGrid },
        { id: 'latest', label: t('news.filters.latest') || 'أحدث التقنيات', icon: FileText },
        { id: 'best', label: t('news.filters.best') || 'أفضل التقنيات', icon: TrendingUp },
    ];

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





                {/* Cards Grid */}
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
            </div>
        </div>
    );
};

export default News;
