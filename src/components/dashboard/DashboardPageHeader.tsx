import { Plus } from 'lucide-react';

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
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                {subtitle && (
                    <p className="text-gray-500 max-w-2xl text-lg">
                        {subtitle}
                    </p>
                )}
            </div>

            {actionButtonText && onAction && (
                <button
                    onClick={onAction}
                    className="
            flex items-center justify-center gap-2 
            bg-primary text-white 
            px-6 py-3 rounded-xl 
            font-bold shadow-lg shadow-primary/30 
            hover:bg-primary-dark hover:shadow-primary/40 
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
