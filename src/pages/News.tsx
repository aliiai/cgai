import { useState } from 'react';
import { LayoutGrid, FileText, TrendingUp, ListPlus, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const News = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = [
        { id: 'all', label: 'الكل', icon: LayoutGrid },
        { id: 'latest', label: 'أحدث التقنيات', icon: FileText },
        { id: 'best', label: 'أفضل التقنيات', icon: TrendingUp },
        { id: 'add', label: 'أضف محتوى', icon: ListPlus },
    ];

    const newsItems = [
        {
            id: 1,
            title: "Agentic AI",
            category: "Generative AI",
            description: "تُعد هذه التقنية الأبرز في 2026، حيث لم يعد الذكاء الاصطناعي يقتصر على الرد على الأسئلة، بل أصبح 'وكيلاً' يقوم بتنفيذ مهام كاملة عبر تطبيقات متعددة بشكل مستقل، مثل التخطيط للسفر، إدارة جداول الأعمال، أو البرمجة الذاتية دون تدخل بشري مستمر.",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
            link: "#"
        },
        {
            id: 2,
            title: "Future of Robots",
            category: "Robotics",
            description: "تطور الروبوتات في السنوات القادمة سيشهد طفرة كبيرة في القدرة على التفاعل مع البيئة المحيطة بشكل طبيعي أكثر، مما يفتح آفاقاً جديدة في مجالات الصناعة والخدمات المنزلية.",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
            link: "#"
        },
        {
            id: 3,
            title: "Quantum Computing",
            category: "Computing",
            description: "الحوسبة الكمومية تعد بإحداث ثورة في كيفية معالجة البيانات، مما يسمح بحل مشكلات معقدة كانت تعتبر مستحيلة سابقاً في ثوانٍ معدودة.",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop",
            link: "#"
        }
    ];

    return (
        <div className="news-page bg-white min-h-screen" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
                {/* Main Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 text-center">
                    آخر أخبار الذكاء الاصطناعي        </h1>

                {/* Subtitle */}
                <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-8 text-center">
                    أحدث أخبار، أحداث، وتقارير تقنيات الذكاء الاصطناعي في مكان واحد.        </p>

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
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12" dir="rtl">
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
                            <div className="px-8 pb-8 pt-2" dir="rtl">
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
