import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import LanguageSelector from '../../LanguageSelector';
import AuthButtons from '../../AuthButtons';

interface HeaderActionsProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    variants: any;
}

const HeaderActions = ({
    isDarkMode,
    toggleDarkMode,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    variants,
}: HeaderActionsProps) => {
    return (
        <motion.div
            className="flex items-center gap-2 sm:gap-4 flex-shrink-0"
            variants={variants}
            initial="hidden"
            animate="visible"
        >
            {/* Language Selector */}
            <div className="hidden sm:block">
                <LanguageSelector />
            </div>

            {/* Theme Toggle */}
            <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${isDarkMode
                    ? 'hover:bg-slate-800 text-amber-500'
                    : 'hover:bg-gray-100 text-gray-700'
                    }`}
                title={isDarkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex">
                <AuthButtons />
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`sm:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                    }`}
                aria-label="Menu"
            >
                {isMobileMenuOpen ? (
                    <svg
                        className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg
                        className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>
        </motion.div>
    );
};

export default HeaderActions;
