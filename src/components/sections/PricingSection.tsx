import PricingCard from '../PricingCard';

const PricingSection = () => {
  const plans = [
    {
      id: 1,
      name: 'الباقة الأساسية',
      price: '1,500',
      currency: 'SAR',
      features: [
        'حلول ذكاء اصطناعي (نماذج جاهزة)',
        'تطوير برمجيات أساسي',
        'تصميم وتجربة مستخدم أساسية',
        'بيانات وتحليلات محدودة',
        'دعم أساسي'
      ],
      isPopular: false
    },
    {
      id: 2,
      name: 'الباقة الاحترافية',
      price: '4,500',
      currency: 'SAR',
      features: [
        'حلول ذكاء اصطناعي مخصصة',
        'تطوير برمجيات متقدم',
        'تصميم وتجربة مستخدم احترافية',
        'بيانات وتحليلات متقدمة',
        'حجز خبراء بالساعة',
        'أولوية في الدعم'
      ],
      isPopular: true
    },
    {
      id: 3,
      name: 'باقة الأعمال',
      price: '9,000',
      currency: 'SAR',
      features: [
        'حلول ذكاء اصطناعي متقدمة',
        'أنظمة برمجية جاهزة أو مخصصة',
        'تصميم وتجربة مستخدم مخصص',
        'تحليلات وبيانات شاملة',
        'حجز خبراء',
        'دعم تقني مستمر'
      ],
      isPopular: false
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#114C5A] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-auto bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -ml-48 -mb-32"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-5 md:mb-6 leading-tight px-2">
            اختر الباقة المناسبة لك
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 font-thin leading-relaxed max-w-3xl mx-auto px-4">
            باقات مرنة تتيح لك الاستفادة من خدمات متكاملة وحلول ذكية حسب حجم مشروعك واحتياجاتك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
