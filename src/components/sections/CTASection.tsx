import AuthButtons from '../AuthButtons';
import type { ConsultationBookingData } from '../../storeApi/api/home.api';
import { useThemeStore } from '../../storeApi/store/theme.store';

interface CTASectionProps {
  data?: ConsultationBookingData;
}

const CTASection = ({ data }: CTASectionProps) => {
  const { isDarkMode } = useThemeStore();
  // ... state ...
  const heading = data?.heading;
  const description = data?.description;
  const backgroundImage = data?.background_image;
  const buttons = (data?.buttons || [
    {
      title: 'احجز استشارة',
      link: '/consultation',
      target: '_self' as const,
      style: 'primary' as const
    },
    {
      title: 'تواصل معنا',
      link: '/contact-us',
      target: '_self' as const,
      style: 'secondary' as const
    }
  ]).map(btn => {
    // Remove navigation for request-service and contact links
    if (btn.link === '/request-service' || btn.link === '/contact' || btn.link === '/contact-us') {
      return {
        ...btn,
        link: '#',
      };
    }
    return btn;
  });

  return (
    <section className={`flex items-center justify-center h-auto py-8 md:py-12 lg:h-[70vh] lg:py-0 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'
      }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-0 w-full h-full flex items-center justify-center ">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl w-full lg:h-[90%] ">
          {/* Left Section - Image */}
          <div className="lg:col-span-3 relative h-64 sm:h-80 md:h-96 lg:min-h-[400px] lg:h-full order-2 lg:order-1">
            <div className="absolute inset-0 bg-gradient-to-r from-[#114C5A]/20 to-transparent z-10"></div>
            <img
              src={backgroundImage}
              alt="Modern office with AI technology"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image doesn't exist
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.style.background = 'linear-gradient(135deg, #114C5A 0%, #0d3a44 100%)';
              }}
            />
            {/* Digital Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-orange-500/20 to-transparent mix-blend-overlay z-20 pointer-events-none"></div>
          </div>

          {/* Right Section - Text and CTA */}
          <div className="lg:col-span-3 bg-[#114C5A] p-6 sm:p-8 md:p-10 lg:p-2 flex flex-col justify-center order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 md:mb-6 !leading-tight">
              {heading}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 leading-relaxed font-thin">
              {description}
            </p>

            {/* CTA Buttons */}
            <AuthButtons
              buttons={buttons.map((btn) => ({
                label: btn.title,
                link: btn.link,
                target: btn.target,
                variant: btn.style === 'primary' ? 'primary' : 'secondary',
                icon: btn.style === 'primary' ? 'arrow' : undefined
              }))}
              className="flex-col sm:flex-row"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

