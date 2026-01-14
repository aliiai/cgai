import { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Headphones, Award, Users, TrendingUp, Lock, Sparkles } from 'lucide-react';

const WhyChooseUsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      id: 1,
      title: 'أمان عالي',
      description: 'نحمي بياناتك ومعلوماتك بأحدث تقنيات الأمان والتشفير المتقدمة',
      icon: Shield,
      stat: '100%',
      statLabel: 'أمان',
    },
    {
      id: 2,
      title: 'سرعة فائقة',
      description: 'حجز سريع في دقائق معدودة بدون تعقيدات أو انتظار طويل',
      icon: Zap,
      stat: '< 2 دقيقة',
      statLabel: 'للحجز',
    },
    {
      id: 3,
      title: 'دعم فني 24/7',
      description: 'فريق دعم متاح على مدار الساعة لمساعدتك في أي وقت تحتاجه',
      icon: Headphones,
      stat: '24/7',
      statLabel: 'دعم',
    },
    {
      id: 4,
      title: 'جودة مضمونة',
      description: 'خدمات عالية الجودة من فريق محترف وذو خبرة واسعة في المجال',
      icon: Award,
      stat: '100%',
      statLabel: 'رضا',
    },
    {
      id: 5,
      title: 'آلاف العملاء',
      description: 'أكثر من 10,000 عميل راضٍ يثقون بنا في خدماتهم اليومية',
      icon: Users,
      stat: '10K+',
      statLabel: 'عميل',
    },
    {
      id: 6,
      title: 'نمو مستمر',
      description: 'نطور خدماتنا باستمرار لنقدم لك الأفضل دائماً وأبداً',
      icon: TrendingUp,
      stat: '99%',
      statLabel: 'نمو',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.feature-card');
      cards.forEach((card) => observer.observe(card));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-white via-gray-50 to-primary/5 relative overflow-hidden">
      {/* 3D Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 rounded-full mb-3 md:mb-4 lg:mb-6 backdrop-blur-sm border border-primary/20">
            <Sparkles className="text-primary" size={16} />
            <span className="text-primary font-bold text-xs md:text-sm">لماذا نحن</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-3 md:mb-4 lg:mb-6 leading-tight px-4">
            لماذا تختار
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark mt-1 md:mt-2">
              منصتنا؟
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            نقدم لك تجربة فريدة تجمع بين السهولة والجودة والأمان
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className={`
                  feature-card relative group
                  bg-white rounded-xl md:rounded-2xl lg:rounded-3xl 
                  p-5 sm:p-6 md:p-8
                  border-2 transition-all duration-500
                  min-h-[280px] sm:min-h-[300px] md:min-h-0
                  ${hoveredIndex === index
                    ? 'border-primary shadow-xl shadow-primary/30'
                    : 'border-gray-100 shadow-lg hover:shadow-2xl hover:border-primary/50'
                  }
                `}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(index)}
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon with 3D Effect */}
                <div className={`
                  relative mb-4 sm:mb-5 md:mb-6
                  w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 
                  rounded-lg sm:rounded-xl md:rounded-2xl
                  bg-gradient-to-br from-primary to-primary-dark
                  flex items-center justify-center
                  text-white
                  shadow-md md:shadow-lg shadow-primary/20
                  group-hover:shadow-xl group-hover:shadow-primary/40
                  transform 
                  group-hover:scale-110 
                  group-hover:rotate-3
                  transition-all duration-500
                `}>
                  <div className={`
                    absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl
                    bg-gradient-to-br from-primary to-primary-dark
                    opacity-30 blur-xl -z-10
                    group-hover:opacity-50 transition-opacity duration-500
                  `} />
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" />
                </div>

                {/* Stat Badge */}
                <div className="absolute top-4 sm:top-5 md:top-6 left-4 sm:left-5 md:left-6 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white/90 backdrop-blur-sm rounded-lg md:rounded-xl border-2 border-gray-100 shadow-md md:shadow-lg transform group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300">
                  <div className="text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">
                    {feature.stat}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600 font-bold">
                    {feature.statLabel}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-2 md:mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-primary to-primary-dark rounded-b-xl md:rounded-b-2xl lg:rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />

                {/* Decorative Corner Element */}
                <div className="absolute bottom-0 right-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-gradient-to-tr from-primary/5 to-transparent rounded-tl-2xl md:rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 md:mt-12 lg:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-5 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl md:rounded-2xl border-2 border-primary/20 backdrop-blur-sm">
            <Lock className="text-primary flex-shrink-0" size={20} />
            <div className="text-center sm:text-right">
              <p className="text-base sm:text-lg md:text-xl font-black text-gray-900">ضمان 100% للأمان والجودة</p>
              <p className="text-xs sm:text-sm text-gray-600">نحمي بياناتك ونضمن رضاك التام</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;

