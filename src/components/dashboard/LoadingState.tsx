import { Loader2 } from 'lucide-react';
import { useThemeStore } from '../../storeApi/storeApi';

const LoadingState = () => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className={`w-8 h-8 animate-spin transition-colors duration-300 ${
        isDarkMode ? 'text-[#FFB200]' : 'text-primary'
      }`} />
    </div>
  );
};

export default LoadingState;

