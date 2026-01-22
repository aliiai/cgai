import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bgSubCard from '../assets/images/bgSubCard.png';
import { useThemeStore } from '../storeApi/store/theme.store';
import { useTranslation } from 'react-i18next';

interface PricingPlan {
  id: number;
  name: string;
  price: string;
  currency: string;
  features: string[];
  isPopular: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
}

const PricingCard = ({ plan }: PricingCardProps) => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { t } = useTranslation();

  return (
    <div
      className={`group relative transition-all duration-500 flex flex-col ${plan.isPopular
        ? 'bg-[#FFB200] rounded-3xl py-32 px-8'
        : `rounded-3xl py-24 px-8 shadow-lg hover:shadow-xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-[#114C5A]'
        }`
        }`}
      style={plan.isPopular ? {
        boxShadow: 'rgb(255 183 18) 0px 0px 15px 3px, rgba(255, 178, 0, 0.1) 0px 0px 0px 1px',
        backgroundImage: `url(${bgSubCard})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#FFB200',
        transform: 'translateY(-2rem)',
      } : {
        transform: 'translateY(2rem)',
      }}
    >
      {/* Plan Name */}
      <div className="flex flex-col items-start justify-center w-[70%] mx-auto">
        <h3 className={`text-2xl md:text-4xl font-extrabold transition-colors duration-300 ${plan.isPopular ? 'text-white' : (isDarkMode ? 'text-white' : 'text-[#114C5A]')
          }`}>
          {plan.name}
        </h3>

        {/* Pricing */}
        <p className={`text-sm font-thin mb-16 transition-colors duration-300 ${plan.isPopular ? 'text-white' : (isDarkMode ? 'text-white/70' : 'text-[#114C5A]')
          }`}>
          {t('pricing.startsFrom') || 'يبدأ من'}
        </p>
        <div className="flex items-center justify-center gap-2 w-auto mb-8">
          <span className={`text-4xl md:text-5xl font-extrabold leading-none transition-colors duration-300 ${plan.isPopular ? 'text-white' : (isDarkMode ? 'text-white' : 'text-[#114C5A]')
            }`}>
            {plan.price}
          </span>
          <span className={`text-lg font-bold text-center transition-colors duration-300 ${plan.isPopular ? 'text-white' : (isDarkMode ? 'text-white' : 'text-[#114C5A]')
            }`}>
            {plan.currency}
          </span>
        </div>
      </div>

      {/* Features List */}
      <ul className="space-y-4 mb-8 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className={`w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300 ${plan.isPopular
              ? 'text-black'
              : (isDarkMode ? 'text-white' : 'text-[#114C5A]')
              }`}>
              <Star className="w-5 h-5 fill-current" />
            </span>
            <span className={`text-base leading-relaxed transition-colors duration-300 ${plan.isPopular ? 'text-white font-semibold' : (isDarkMode ? 'text-white/80 font-medium' : 'text-gray-700 font-medium')
              }`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <button 
        onClick={() => navigate('/register')}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 transform active:scale-95 ${plan.isPopular
          ? 'bg-white text-[#114C5A] hover:bg-gray-50 shadow-lg'
          : isDarkMode
            ? 'bg-primary text-white hover:bg-primary/90 shadow-lg'
            : 'bg-[#114C5A] text-white hover:bg-[#0d3a44] shadow-lg'
          }`}>
        {t('pricing.subscribeNow') || 'اشترك الآن'}
      </button>
    </div>
  );
};

export default PricingCard;

