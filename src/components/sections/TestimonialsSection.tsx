import { useRef } from 'react';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import { Star, Quote, ChevronRight, ChevronLeft } from 'lucide-react';

const TestimonialsSection = () => {
  const sliderRef = useRef<Slider>(null);

  const testimonials = [
    {
      id: 1,
      name: 'أحمد محمد',
      role: 'رائد أعمال',
      image: '👨‍💼',
      rating: 5,
      text: 'خدمة ممتازة وسريعة! استطعت حجز موعدي بسهولة والحصول على الخدمة في الوقت المحدد. فريق العمل محترف جداً ويهتم بأدق التفاصيل.',
      company: 'شركة التقنية المتقدمة',
    },
    {
      id: 2,
      name: 'فاطمة علي',
      role: 'مديرة تسويق',
      image: '👩‍💼',
      rating: 5,
      text: 'تجربة رائعة من البداية للنهاية. النظام سهل الاستخدام والخدمة عالية الجودة. أنصح الجميع بتجربتها بدون تردد.',
      company: 'مؤسسة الإبداع',
    },
    {
      id: 3,
      name: 'خالد سعيد',
      role: 'مطور برمجيات',
      image: '👨‍💻',
      rating: 5,
      text: 'أفضل منصة حجز جربتها! واجهة مستخدم جميلة وتفاعلية، والخدمة سريعة وفعالة. شكراً لكم على هذا العمل الرائع والمتميز.',
      company: 'استوديو البرمجة',
    },
    {
      id: 4,
      name: 'سارة أحمد',
      role: 'مصممة جرافيك',
      image: '👩‍🎨',
      rating: 5,
      text: 'خدمة احترافية بكل المقاييس. سهولة الحجز والدفع جعلت التجربة ممتعة جداً. بالتأكيد سأستخدمها مرة أخرى وأنصح بها.',
      company: 'وكالة التصميم',
    },
    {
      id: 5,
      name: 'محمد حسن',
      role: 'مهندس معماري',
      image: '👨‍🔧',
      rating: 5,
      text: 'منصة موثوقة وسهلة الاستخدام. الدعم الفني ممتاز والاستجابة سريعة. تجربة تستحق التقدير والثناء.',
      company: 'مكتب الهندسة',
    },
    {
      id: 6,
      name: 'ليلى عبدالله',
      role: 'مديرة مشاريع',
      image: '👩‍💼',
      rating: 5,
      text: 'خدمة متميزة وفريق عمل رائع. كل شيء منظم ومرتب والتواصل واضح. أنصح بها بشدة لكل من يبحث عن الجودة.',
      company: 'شركة المشاريع',
    },
  ];

  // Slick settings
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    rtl: true,
    arrows: false,
    cssEase: 'ease-in-out',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const nextSlide = () => {
    sliderRef.current?.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-primary/5 via-white to-primary/5 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl transform -rotate-45 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl transform rotate-45 animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-primary/10 rounded-full mb-3 md:mb-4 lg:mb-6 backdrop-blur-sm border border-primary/20">
            <Star className="text-primary fill-primary" size={16} />
            <span className="text-primary font-bold text-xs md:text-sm">شهادات العملاء</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-3 md:mb-4 lg:mb-6 leading-tight px-4">
            ماذا يقول
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark mt-1 md:mt-2">
              عملاؤنا
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            آلاف العملاء الراضين يثقون بنا في تقديم أفضل الخدمات
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          <Slider ref={sliderRef} {...settings} className="testimonials-slider">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-2 sm:px-3">
                <div className="testimonial-card relative group bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-5 sm:p-6 md:p-8 border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-500 min-h-[320px] sm:min-h-[360px]">
                  {/* Quote Icon with 3D Effect */}
                  <div className="absolute top-4 sm:top-5 md:top-6 right-4 sm:right-5 md:right-6 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <Quote className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-primary/60" />
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 sm:gap-1 mb-4 sm:mb-5 md:mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-6 md:mb-8 font-medium">
                    "{testimonial.text}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-5 md:pt-6 border-t-2 border-gray-100 mt-auto">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-2xl sm:text-3xl transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      {testimonial.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base sm:text-lg font-black text-gray-900 mb-0.5 sm:mb-1 truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 font-semibold truncate">
                        {testimonial.role}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 truncate">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* 3D Hover Glow */}
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl lg:rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                  {/* Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-primary to-primary-dark rounded-b-xl md:rounded-b-2xl lg:rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
                </div>
              </div>
            ))}
          </Slider>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="hidden sm:flex absolute top-1/2 -right-4 md:-right-6 lg:-right-12 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-white border-2 border-primary/30 items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl z-10"
            aria-label="السابق"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden sm:flex absolute top-1/2 -left-4 md:-left-6 lg:-left-12 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-white border-2 border-primary/30 items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl z-10"
            aria-label="التالي"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;

