import { Clock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/store/theme.store';
import type { DashboardStats } from '../../types/types';

interface DashboardHeroProps {
  userName: string;
  userEmail: string;
  userPhone: string;
  stats: DashboardStats;
}

const DashboardHero = ({ userName, userEmail, userPhone, stats }: DashboardHeroProps) => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
  
  const activeBookings = (stats.bookings?.confirmed || 0) + (stats.bookings?.pending || 0) + (stats.bookings?.in_progress || 0);
  
  return (
    <div className={`relative overflow-hidden rounded-3xl lg:rounded-[40px] p-8 md:p-10 lg:p-12 shadow-2xl transition-all duration-700 group ${
      isDarkMode 
        ? 'bg-[#114C5A] border border-[#114C5A]/80' 
        : 'bg-[#114C5A] border border-[#114C5A]/80'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB200]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFB200]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Geometric Shapes */}
        <div className={`absolute top-1/4 right-1/4 w-32 h-32 border-2 rounded-full rotate-45 transform group-hover:scale-110 group-hover:rotate-90 transition-transform duration-1000 ${
          isDarkMode ? 'border-[#FFB200]/20' : 'border-[#FFB200]/20'
        }`}></div>
        <div className={`absolute bottom-1/3 left-1/4 w-48 h-48 border-2 rounded-[40px] -rotate-12 transform group-hover:rotate-12 transition-transform duration-1000 ${
          isDarkMode ? 'border-[#FFB200]/15' : 'border-[#FFB200]/15'
        }`}></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
          {/* Left Side - Welcome Message */}
          <div className="flex-1 space-y-5 w-full">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 backdrop-blur-xl border-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#FFB200] shadow-lg ${
              isDarkMode 
                ? 'bg-[#114C5A]/50 border-[#FFB200]/30' 
                : 'bg-[#114C5A]/50 border-[#FFB200]/30'
            }`}>
              <div className="w-2 h-2 rounded-full bg-[#FFB200] animate-ping"></div>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('dashboard.hero.advancedStats')}</span>
            </div>

            {/* Greeting Section */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight text-[#FBFBFB]">
                {t('dashboard.hero.welcome')} <br />
                <span className="bg-gradient-to-l from-[#FFB200] via-[#FFB200] to-[#FFB200]/80 bg-clip-text text-transparent italic drop-shadow-sm">
                  {userName || t('dashboard.hero.guest')}
                </span>
              </h1>

              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-x-6 sm:gap-y-2 opacity-90">
                {userEmail && (
                  <div className="flex items-center gap-2 text-sm font-bold text-[#FBFBFB]/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFB200]"></div>
                    <span>{userEmail}</span>
                  </div>
                )}
                {userPhone && (
                  <div className="flex items-center gap-2 text-sm font-bold text-[#FBFBFB]/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFB200]"></div>
                    <span>{userPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Stats Card */}
          <div className="w-full lg:w-auto lg:min-w-[280px] xl:min-w-[320px]">
            <div className={`backdrop-blur-[20px] border-2 rounded-3xl p-6 lg:p-8 relative overflow-hidden group/card shadow-2xl ${
              isDarkMode 
                ? 'bg-[#FBFBFB]/10 border-[#FFB200]/30' 
                : 'bg-[#FBFBFB]/10 border-[#FFB200]/30'
            }`}>
              {/* Card Background Decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFB200]/20 blur-2xl rounded-full -translate-y-10 translate-x-10"></div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#FFB200] to-[#FFB200]/80 rounded-2xl flex items-center justify-center text-[#114C5A] shadow-lg shadow-[#FFB200]/25 ring-2 ring-[#FFB200]/20 transform transition-transform group-hover/card:scale-110 duration-500">
                    <Clock className="w-8 h-8 lg:w-10 lg:h-10" />
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${
                      isDarkMode ? 'text-[#FBFBFB]/60' : 'text-[#FBFBFB]/60'
                    }`}>{t('dashboard.hero.activeBookings')}</p>
                    <div className={`flex items-end gap-2 text-3xl lg:text-4xl xl:text-5xl font-black leading-none ${
                      isDarkMode ? 'text-[#FBFBFB]' : 'text-[#FBFBFB]'
                    }`}>
                      {activeBookings}
                      <span className={`text-xs lg:text-sm font-bold pb-1 ${
                        isDarkMode ? 'text-[#FBFBFB]/50' : 'text-[#FBFBFB]/50'
                      }`}>{t('dashboard.hero.appointments')}</span>
                    </div>
                  </div>
                </div>

                <div className={`pt-4 border-t ${
                  isDarkMode ? 'border-[#FFB200]/20' : 'border-[#FFB200]/20'
                }`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className={`flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5 ${
                        isDarkMode ? 'text-[#FBFBFB]/60' : 'text-[#FBFBFB]/60'
                      }`}>
                        <span>{t('dashboard.hero.readiness')}</span>
                        <span className="text-[#FFB200]">{t('dashboard.hero.readinessValue')}</span>
                      </div>
                      <div className={`h-2 w-full rounded-full overflow-hidden ${
                        isDarkMode ? 'bg-[#114C5A]/50' : 'bg-[#114C5A]/50'
                      }`}>
                        <div className="h-full w-full bg-gradient-to-r from-[#FFB200] to-[#FFB200]/80 rounded-full"></div>
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FFB200] transition-colors cursor-pointer ${
                      isDarkMode 
                        ? 'bg-[#114C5A]/50 text-[#FFB200] hover:text-[#114C5A]' 
                        : 'bg-[#114C5A]/50 text-[#FFB200] hover:text-[#114C5A]'
                    }`}>
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
