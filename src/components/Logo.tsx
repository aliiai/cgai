import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import logoWhite from '../assets/images/logoWhite.png';
import { useThemeStore } from '../storeApi/storeApi';

interface LogoProps {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-[40px] h-[40px]',
  md: 'w-[60px] h-[60px]',
  lg: 'w-[100px] h-[100px]',
};

const Logo = ({ onClick, className = '', size = 'lg' }: LogoProps) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`flex items-center gap-3 flex-shrink-0 ${className}`}>
      <Link
        to="/"
        onClick={onClick}
        className="flex items-center gap-3 no-underline group"
      >
        <img
          src={isDarkMode ? logoWhite : logo}
          alt="logo"
          className={`${sizeClasses[size]} transition-transform duration-300 ${isDarkMode ? 'scale-[0.75]' : 'scale-100'}`}
        />
      </Link>
    </div>
  );
};

export default Logo;

