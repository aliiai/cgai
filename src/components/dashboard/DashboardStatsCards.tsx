import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useThemeStore } from '../../storeApi/store/theme.store';

interface StatCard {
  title: string;
  value: string;
  icon: ReactNode;
  color: 'blue' | 'emerald' | 'amber' | 'rose';
}

interface DashboardStatsCardsProps {
  stats: StatCard[];
}

const DashboardStatsCards = ({ stats }: DashboardStatsCardsProps) => {
  const { isDarkMode } = useThemeStore();
  
  const getColorStyles = (color: StatCard['color']) => {
    const styles = {
      blue: {
        bg: 'bg-[#114C5A]/10',
        text: 'text-[#114C5A]',
        iconBg: 'bg-[#114C5A]',
        border: 'border-[#114C5A]/20',
        hover: 'hover:border-[#114C5A]/40 hover:shadow-[#114C5A]/20'
      },
      emerald: {
        bg: 'bg-[#114C5A]/10',
        text: 'text-[#114C5A]',
        iconBg: 'bg-[#114C5A]',
        border: 'border-[#114C5A]/20',
        hover: 'hover:border-[#114C5A]/40 hover:shadow-[#114C5A]/20'
      },
      amber: {
        bg: 'bg-[#FFB200]/10',
        text: 'text-[#FFB200]',
        iconBg: 'bg-[#FFB200]',
        border: 'border-[#FFB200]/20',
        hover: 'hover:border-[#FFB200]/40 hover:shadow-[#FFB200]/20'
      },
      rose: {
        bg: 'bg-[#FFB200]/10',
        text: 'text-[#FFB200]',
        iconBg: 'bg-[#FFB200]',
        border: 'border-[#FFB200]/20',
        hover: 'hover:border-[#FFB200]/40 hover:shadow-[#FFB200]/20'
      }
    };
    return styles[color];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => {
        const style = getColorStyles(stat.color);
        return (
          <div
            key={idx}
            className={`
              relative rounded-3xl p-6 lg:p-8 border-2 shadow-lg 
              hover:shadow-2xl transition-all duration-500 group cursor-default
              hover:-translate-y-1 flex flex-col justify-between overflow-hidden
              ${style.hover}
              ${style.border}
              ${isDarkMode 
                ? 'bg-[#114C5A]/30 border-[#114C5A]/40' 
                : 'bg-[#FBFBFB] border-[#114C5A]/20'
              }
            `}
          >
            {/* Accent Bar */}
            <div className={`absolute top-0 right-0 w-1 h-0 group-hover:h-full transition-all duration-500 ${style.iconBg}`}></div>

            {/* Background Decorative Pattern */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500 ${style.text}`}>
              {stat.icon}
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center 
                  text-white shadow-lg transition-transform duration-500
                  group-hover:scale-110 group-hover:rotate-3
                  ${style.iconBg}
                `}>
                  {stat.icon}
                </div>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 group-hover:bg-[#FFB200] group-hover:border-[#FFB200] transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-[#114C5A]/50 border-[#114C5A]/50' 
                    : 'bg-[#FBFBFB] border-[#114C5A]/20'
                }`}>
                  <ArrowUpRight className={`w-4 h-4 group-hover:text-[#114C5A] transition-colors ${
                    isDarkMode ? 'text-[#FBFBFB]/60' : 'text-[#333333]/60'
                  }`} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${style.iconBg}`} />
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                    isDarkMode ? 'text-[#FBFBFB]/70' : 'text-[#333333]/70'
                  }`}>{stat.title}</p>
                </div>
                <h4 className={`text-3xl lg:text-4xl font-black tracking-tight ${
                  isDarkMode ? 'text-[#FBFBFB]' : 'text-[#333333]'
                }`}>
                  {stat.value}
                </h4>
              </div>
            </div>

            {/* Bottom Glow Decoration */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${style.iconBg}`} />
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStatsCards;
