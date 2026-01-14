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
  
  return (
    <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl transition-all duration-700 group ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' 
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900'
    }`}>
      {/* Dynamic Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Abstract Floating Shapes */}
        <div className={`absolute top-1/4 right-1/4 w-32 h-32 border rounded-full rotate-45 transform group-hover:scale-110 group-hover:rotate-90 transition-transform duration-1000 ${
          isDarkMode ? 'border-white/5' : 'border-slate-300/20'
        }`}></div>
        <div className={`absolute bottom-1/3 left-1/4 w-48 h-48 border rounded-[40px] -rotate-12 transform group-hover:rotate-12 transition-transform duration-1000 ${
          isDarkMode ? 'border-white/5' : 'border-slate-300/20'
        }`}></div>

        {/* Subtle Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,173,181,0.15),transparent)] opacity-50"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 lg:gap-8">
          {/* Left Side - Welcome Message */}
          <div className="flex-1 space-y-4 sm:space-y-6 w-full">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 backdrop-blur-xl border px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-lg ${
              isDarkMode 
                ? 'bg-white/10 border-white/20' 
                : 'bg-slate-100/80 border-slate-200/50'
            }`}>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-ping"></div>
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{t('dashboard.hero.advancedStats')}</span>
            </div>

            {/* Greeting Section */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight">
                {t('dashboard.hero.welcome')} <br />
                <span className="bg-gradient-to-l from-primary via-blue-400 to-primary bg-clip-text text-transparent italic drop-shadow-sm">
                  {userName || t('dashboard.hero.guest')}
                </span>
              </h1>

              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-x-4 sm:gap-y-2 opacity-70">
                {userEmail && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                    <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                      isDarkMode ? 'bg-white/40' : 'bg-slate-500/60'
                    }`}></div>
                    <span className={isDarkMode ? 'text-white/80' : 'text-slate-600'}>{userEmail}</span>
                  </div>
                )}
                {userPhone && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                    <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                      isDarkMode ? 'bg-white/40' : 'bg-slate-500/60'
                    }`}></div>
                    <span className={isDarkMode ? 'text-white/80' : 'text-slate-600'}>{userPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Stats Card */}
          <div className="w-full lg:w-auto lg:min-w-[260px] xl:min-w-[280px]">
            <div className={`backdrop-blur-[20px] border rounded-xl sm:rounded-2xl lg:rounded-[24px] p-4 sm:p-5 lg:p-6 relative overflow-hidden group/card shadow-2xl ${
              isDarkMode 
                ? 'bg-white/10 border-white/20' 
                : 'bg-white/80 border-slate-200/50'
            }`}>
              {/* Card Background Decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 blur-2xl rounded-full -translate-y-8 sm:-translate-y-10 translate-x-8 sm:translate-x-10"></div>

              <div className="relative z-10 space-y-4 sm:space-y-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 lg:w-16 sm:h-14 lg:h-16 bg-gradient-to-br from-primary to-primary-dark rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/25 ring-2 ring-primary/20 transform transition-transform group-hover/card:scale-110 duration-500">
                    <Clock className="w-6 h-6 sm:w-7 lg:w-8 sm:h-7 lg:h-8" />
                  </div>
                  <div>
                    <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${
                      isDarkMode ? 'text-white/50' : 'text-slate-500'
                    }`}>{t('dashboard.hero.activeBookings')}</p>
                    <div className={`flex items-end gap-1.5 sm:gap-2 text-2xl sm:text-3xl lg:text-4xl font-black leading-none ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {(stats.bookings?.confirmed || 0) + (stats.bookings?.pending || 0) + (stats.bookings?.in_progress || 0)}
                      <span className={`text-[10px] sm:text-xs font-bold pb-1 ${
                        isDarkMode ? 'text-white/40' : 'text-slate-500'
                      }`}>{t('dashboard.hero.appointments')}</span>
                    </div>
                  </div>
                </div>

                <div className={`pt-3 sm:pt-4 border-t ${
                  isDarkMode ? 'border-white/10' : 'border-slate-200/50'
                }`}>
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="space-y-1 flex-1">
                      <div className={`flex justify-between text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1 sm:mb-1.5 ${
                        isDarkMode ? 'text-white/50' : 'text-slate-500'
                      }`}>
                        <span>{t('dashboard.hero.readiness')}</span>
                        <span className="text-primary">{t('dashboard.hero.readinessValue')}</span>
                      </div>
                      <div className={`h-1 sm:h-1.5 w-full rounded-full overflow-hidden ${
                        isDarkMode ? 'bg-white/10' : 'bg-slate-200'
                      }`}>
                        <div className="h-full w-full bg-gradient-to-r from-primary to-blue-500"></div>
                      </div>
                    </div>
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer ${
                      isDarkMode 
                        ? 'bg-white/10 text-white/60 hover:text-white' 
                        : 'bg-slate-100 text-slate-500 hover:text-white'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

