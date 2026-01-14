import { useState, useEffect, useRef } from 'react';
import { CheckCircle, Calendar, CreditCard, Sparkles, ArrowRight, Clock } from 'lucide-react';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    {
      id: 1,
      title: 'اختر الخدمة',
      description: 'تصفح قائمة خدماتنا المتنوعة واختر الخدمة التي تناسب احتياجاتك بكل سهولة',
      icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />,
      color: 'from-primary to-primary-dark',
      shadowColor: 'shadow-primary/20',
      hoverShadow: 'group-hover:shadow-primary/40',
    },
    {
      id: 2,
      title: 'احجز موعدك',
      description: 'اختر التاريخ والوقت المناسبين لك من الأوقات المتاحة بسهولة تامة',
      icon: <Calendar className="w-6 h-6 md:w-8 md:h-8" />,
      color: 'from-primary to-primary-dark',
      shadowColor: 'shadow-primary/20',
      hoverShadow: 'group-hover:shadow-primary/40',
    },
    {
      id: 3,
      title: 'أكمل الدفع',
      description: 'ادفع بسهولة وأمان عبر بوابات الدفع الإلكتروني المتعددة والموثوقة',
      icon: <CreditCard className="w-6 h-6 md:w-8 md:h-8" />,
      color: 'from-primary to-primary-dark',
      shadowColor: 'shadow-primary/20',
      hoverShadow: 'group-hover:shadow-primary/40',
    },
    {
      id: 4,
      title: 'استمتع بالخدمة',
      description: 'احصل على خدمتك في الوقت المحدد واستمتع بتجربة استثنائية ومميزة',
      icon: <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />,
      color: 'from-primary to-primary-dark',
      shadowColor: 'shadow-primary/20',
      hoverShadow: 'group-hover:shadow-primary/40',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.step-card');
      cards.forEach((card) => observer.observe(card));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-gray-50 via-white to-primary/5 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl transform rotate-12 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl transform -rotate-12 animate-pulse-slow" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 rounded-full mb-3 md:mb-4 lg:mb-6 backdrop-blur-sm border border-primary/20">
            <Clock className="text-primary" size={16} />
            <span className="text-primary font-bold text-xs md:text-sm">كيف يعمل</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-3 md:mb-4 lg:mb-6 leading-tight px-4">
            خطوات بسيطة
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark mt-1 md:mt-2">
              لخدمة ممتازة
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            عملية حجز سهلة وسريعة في 4 خطوات بسيطة فقط
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 mb-10 md:mb-12 lg:mb-16">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`
                step-card relative group
                bg-white rounded-xl md:rounded-2xl lg:rounded-3xl 
                p-5 sm:p-6 md:p-8
                border-2 transition-all duration-500
                min-h-[280px] sm:min-h-[320px] md:min-h-0
                ${activeStep === index
                  ? 'border-primary shadow-xl shadow-primary/30'
                  : 'border-gray-100 shadow-lg hover:shadow-2xl hover:border-primary/50'
                }
              `}
              onMouseEnter={() => setActiveStep(index)}
              onTouchStart={() => setActiveStep(index)}
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 rounded-xl md:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Step Number Badge */}
              <div className={`
                absolute -top-2.5 -right-2.5 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 
                w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 
                rounded-lg sm:rounded-xl md:rounded-2xl
                bg-gradient-to-br ${step.color}
                flex items-center justify-center
                text-white font-black text-base sm:text-lg md:text-xl lg:text-2xl
                shadow-lg md:shadow-xl ${step.shadowColor}
                transform rotate-12 group-hover:rotate-0 group-hover:scale-110
                transition-all duration-500
                z-10
              `}>
                {step.id}
              </div>

              {/* Icon Container */}
              <div className={`
                relative mb-3 sm:mb-4 md:mb-6
                w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 
                rounded-lg sm:rounded-xl md:rounded-2xl
                bg-gradient-to-br ${step.color}
                flex items-center justify-center
                text-white
                shadow-md md:shadow-lg ${step.shadowColor} ${step.hoverShadow}
                transform group-hover:scale-110 group-hover:rotate-3
                transition-all duration-500
              `}>
                <div className={`
                  absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl
                  bg-gradient-to-br ${step.color}
                  opacity-30 blur-xl -z-10
                  group-hover:opacity-50 transition-opacity duration-500
                `} />
                {step.icon}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-2 md:mb-3 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow Connector - يظهر على sm (بين الكاردات في نفس الصف) */}
              {/* على sm: يظهر السهم بعد الكارد الأول فقط (index 0) */}
              {/* على lg: يظهر بعد كل كارد ماعدا الأخير */}
              {((index === 0 && window.innerWidth >= 640 && window.innerWidth < 1024) ||
                (index < steps.length - 1 && window.innerWidth >= 1024)) && (
                  <div className="hidden sm:block absolute top-1/2 -left-3 md:-left-4 transform -translate-y-1/2 z-20">
                    <div className={`
                    w-6 h-6 md:w-8 md:h-8 rounded-full 
                    bg-white border-2 border-primary/30
                    flex items-center justify-center 
                    shadow-md md:shadow-lg
                    group-hover:border-primary group-hover:scale-110
                    transition-all duration-300
                  `}>
                      <ArrowRight size={14} className="text-primary transform rotate-180 md:w-4 md:h-4" />
                    </div>
                  </div>
                )}

              {/* Bottom Accent Line */}
              <div className={`
                absolute bottom-0 left-0 right-0 h-0.5 md:h-1 
                bg-gradient-to-r ${step.color}
                rounded-b-xl md:rounded-b-2xl lg:rounded-b-3xl
                transform scale-x-0 group-hover:scale-x-100
                transition-transform duration-500
                origin-right
              `} />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="
            group relative
            px-6 sm:px-8 md:px-10 
            py-3 sm:py-4 md:py-5 
            rounded-lg sm:rounded-xl md:rounded-2xl
            bg-gradient-to-r from-primary to-primary-dark
            text-white font-black 
            text-sm sm:text-base md:text-lg
            shadow-lg md:shadow-xl shadow-primary/30
            hover:shadow-2xl hover:shadow-primary/40
            hover:scale-105
            active:scale-95
            transition-all duration-300
            overflow-hidden
          ">
            <span className="relative z-10 flex items-center gap-2 md:gap-3">
              <span>ابدأ الآن</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

