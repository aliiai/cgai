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
        bg: 'bg-blue-500/10',
        text: 'text-blue-600',
        dot: 'bg-blue-500',
        glow: 'group-hover:shadow-blue-500/20',
        iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        accent: 'after:bg-blue-500'
      },
      emerald: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-600',
        dot: 'bg-emerald-500',
        glow: 'group-hover:shadow-emerald-500/20',
        iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        accent: 'after:bg-emerald-500'
      },
      amber: {
        bg: 'bg-amber-500/10',
        text: 'text-amber-600',
        dot: 'bg-amber-500',
        glow: 'group-hover:shadow-amber-500/20',
        iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
        accent: 'after:bg-amber-500'
      },
      rose: {
        bg: 'bg-rose-500/10',
        text: 'text-rose-600',
        dot: 'bg-rose-500',
        glow: 'group-hover:shadow-rose-500/20',
        iconBg: 'bg-gradient-to-br from-rose-500 to-rose-600',
        accent: 'after:bg-rose-500'
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
              relative rounded-3xl p-6 border shadow-lg 
              hover:shadow-2xl transition-all duration-500 group cursor-default
              hover:-translate-y-1 flex flex-col justify-between overflow-hidden
              ${style.glow}
              after:content-[''] after:absolute after:top-0 after:right-0 after:w-1 after:h-0 
              after:transition-all after:duration-500 hover:after:h-full ${style.accent}
              ${isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-100'
              }
            `}
          >
            {/* Background Decorative Pattern */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 ${style.text}`}>
              {stat.icon}
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center 
                  text-white shadow-lg transition-transform duration-500
                  group-hover:scale-110 group-hover:rotate-3
                  ${style.iconBg}
                `}>
                  {stat.icon}
                </div>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border group-hover:bg-primary group-hover:border-primary transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600' 
                    : 'bg-slate-50 border-slate-100'
                }`}>
                  <ArrowUpRight className={`w-4 h-4 group-hover:text-white transition-colors ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-400'
                  }`} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-400'
                  }`}>{stat.title}</p>
                </div>
                <h4 className={`text-3xl font-black tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {stat.value}
                </h4>
              </div>
            </div>

            {/* Bottom Glow Decoration */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${style.dot}`} />
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStatsCards;

