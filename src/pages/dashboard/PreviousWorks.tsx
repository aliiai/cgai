import { Briefcase, ExternalLink, Calendar, Star } from 'lucide-react';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';

// بيانات تجريبية للأعمال السابقة
const PREVIOUS_WORKS = [
    {
        id: 1,
        title: 'تطوير تطبيق توصيل طلبات',
        category: 'برمجة وتطوير',
        completionDate: '2024-11-15',
        rating: 5,
        client: 'شركة الانطلاق السريع',
        description: 'تم تطوير تطبيق كامل لمنصة توصيل طلبات باستخدام React Native و Node.js.',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=300&h=200',
    },
    // ... items as before
    {
        id: 2,
        title: 'تصميم هوية بصرية',
        category: 'تصميم جرافيك',
        completionDate: '2024-10-01',
        rating: 4.5,
        client: 'مقهى القهوة المختصة',
        description: 'تصميم شعار ومطبوعات وهوية كاملة لمشروع مقهى جديد.',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?auto=format&fit=crop&q=80&w=300&h=200',
    },
    {
        id: 3,
        title: 'حملة تسويقية إلكترونية',
        category: 'تسويق رقمي',
        completionDate: '2024-09-20',
        rating: 5,
        client: 'متجر الأزياء العصرية',
        description: 'إدارة حملة إعلانية على منصات التواصل الاجتماعي حققت مبيعات عالية.',
        image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=300&h=200',
    }
];

const PreviousWorks = () => {
    return (
        <div className="space-y-6">
            <DashboardPageHeader
                title="أعمالي السابقة"
                subtitle="معرض للأعمال والمشاريع التي تم إنجازها بنجاح"
                actionButtonText="إضافة عمل جديد"
                onAction={() => { }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PREVIOUS_WORKS.map((work) => (
                    <div key={work.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                        {/* Image Cover */}
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={work.image}
                                alt={work.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                                <span className="text-white text-sm font-medium bg-black/30 backdrop-blur-md px-3 py-1 rounded-full">
                                    {work.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                                    {work.title}
                                </h3>
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-bold text-yellow-700">{work.rating}</span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                {work.description}
                            </p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Briefcase size={16} className="text-primary/60" />
                                    <span>العميل: <span className="font-semibold text-gray-800">{work.client}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar size={16} className="text-primary/60" />
                                    <span>تاريخ الإنجاز: <span className="font-medium">{work.completionDate}</span></span>
                                </div>
                            </div>

                            <button className="w-full py-2.5 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                                <span>عرض التفاصيل</span>
                                <ExternalLink size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PreviousWorks;
