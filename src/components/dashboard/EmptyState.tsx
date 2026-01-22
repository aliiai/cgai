import { Inbox } from 'lucide-react';
import { useThemeStore } from '../../storeApi/storeApi';

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className="text-center py-16">
      <div className={`w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-4 border transition-colors duration-300 ${
        isDarkMode
          ? 'bg-[#114C5A]/20 border-[#114C5A]/30'
          : 'bg-[#114C5A]/10 border-[#114C5A]/20'
      }`}>
        <Inbox className={`w-10 h-10 transition-colors duration-300 ${
          isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
        }`} />
      </div>
      <p className={`text-base font-medium transition-colors duration-300 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>{message}</p>
    </div>
  );
};

export default EmptyState;
