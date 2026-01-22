import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AuthButton {
  label: string;
  path?: string;
  link?: string;
  target?: '_self' | '_blank';
  variant?: 'primary' | 'secondary';
  icon?: 'arrow';
}

interface AuthButtonsProps {
  buttons?: AuthButton[];
  className?: string;
}

const AuthButtons = ({ 
  buttons,
  className = '' 
}: AuthButtonsProps) => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const defaultButtons: AuthButton[] = [
    { label: t('header.register'), path: '/register', variant: 'secondary' },
    { label: t('header.login'), path: '/login', variant: 'primary' },
  ];
  
  const buttonsToUse = buttons || defaultButtons;
  
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {buttonsToUse.map((button, index) => {
        const href = button.link || button.path || '#';
        const isExternal = href.startsWith('http://') || href.startsWith('https://');
        const target = button.target || (isExternal ? '_blank' : undefined);
        const useLink = !button.link && button.path && !isExternal; // استخدم Link فقط للروابط الداخلية بدون link
        
        const buttonContent = (
          <button 
            className={`relative px-[40px] py-[8px] border border-primary text-primary rounded-full !font-normal text-[16px] overflow-hidden group flex items-center gap-2`}
          >
            <span className="relative z-10 transition-colors duration-100 group-hover:text-white">
              {button.label}
            </span>
            {button.icon === 'arrow' && (
              isRTL ? (
                <ArrowLeft className="w-5 h-5 relative z-10 transition-colors duration-100 group-hover:text-white group-hover:translate-x-[-4px] transition-transform" />
              ) : (
                <ArrowRight className="w-5 h-5 relative z-10 transition-colors duration-100 group-hover:text-white group-hover:translate-x-1 transition-transform" />
              )
            )}
            <span 
              className="absolute inset-0 translate-x-full group-hover:translate-x-0 transition-transform duration-100 ease-in-out" 
              style={{
                background: 'linear-gradient(to left, #E38500 0%, #FDB103 100%)'
              }}
            ></span>
          </button>
        );

        // Prevent navigation for request-service and contact links
        const shouldPreventNavigation = href === '#' || href === '/request-service' || href === '/contact' || href === '/contact-us';
        
        // إذا كان link موجود أو external أو target محدد، استخدم <a>
        if (button.link || isExternal || target === '_blank' || target === '_self') {
          return (
            <a 
              key={index} 
              href={shouldPreventNavigation ? '#' : href} 
              target={target}
              rel={target === '_blank' ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                if (shouldPreventNavigation) {
                  e.preventDefault();
                  // Do nothing - prevent navigation
                }
              }}
            >
              {buttonContent}
            </a>
          );
        }

        // إذا كان path داخلي فقط، استخدم Link
        if (useLink) {
          return (
            <Link key={index} to={href}>
              {buttonContent}
            </Link>
          );
        }

        // Fallback: استخدم <a> للروابط الداخلية أيضاً
        return (
          <a key={index} href={href}>
            {buttonContent}
          </a>
        );
      })}
    </div>
  );
};

export default AuthButtons;

