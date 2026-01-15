import { useThemeStore } from '../storeApi/store/theme.store';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeader = ({ title, subtitle, className = '' }: SectionHeaderProps) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={`text-center max-w-7xl mx-auto px-6 mt-24 ${className}`}>
      <h1 className={`text-3xl md:text-6xl lg:text-[64px] xl:text-[58px] 2xl:text-[64px] mb-6 font-bold lg:font-extrabold !leading-normal ${isDarkMode ? 'text-white' : 'text-black'
        }`}>
        {title}
      </h1>
      {subtitle && (
        <p className={`text-[lg] md:text-[24px] lg:text-[26px] xl:text-[28px] 2xl:text-[30px] mb-10 leading-relaxed mx-auto font-thin max-w-4xl lg:max-w-5xl xl:max-w-6xl ${isDarkMode ? 'text-white/80' : 'text-black'
          }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;

