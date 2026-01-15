import { Plus } from 'lucide-react';
import { useThemeStore } from '../../storeApi/store/theme.store';

interface DashboardPageHeaderProps {
    title: string;
    subtitle?: string;
    actionButtonText?: string;
    onAction?: () => void;
}

const DashboardPageHeader = ({
    title,
    subtitle,
    actionButtonText,
    onAction
}: DashboardPageHeaderProps) => {
    const { isDarkMode } = useThemeStore();
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-[#FBFBFB]' : 'text-[#333333]'}`}>{title}</h1>
                {subtitle && (
                    <p className={`max-w-2xl text-lg ${isDarkMode ? 'text-[#FBFBFB]/70' : 'text-[#333333]/70'}`}>
                        {subtitle}
                    </p>
                )}
            </div>

            {actionButtonText && onAction && (
                <button
                    onClick={onAction}
                    className="
            flex items-center justify-center gap-2 
            bg-[#114C5A] text-white 
            px-6 py-3 rounded-xl 
            font-bold shadow-lg shadow-[#114C5A]/30 
            hover:bg-[#114C5A]/90 hover:shadow-[#114C5A]/40 
            active:scale-95 transition-all duration-300
          "
                >
                    <Plus size={20} className="stroke-3" />
                    <span>{actionButtonText}</span>
                </button>
            )}
        </div>
    );
};

export default DashboardPageHeader;
