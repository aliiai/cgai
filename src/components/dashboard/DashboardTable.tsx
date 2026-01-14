import { useThemeStore } from '../../storeApi/store/theme.store';
import type { TableRowData, DashboardTableProps } from '../../types/types';

const TableRow = ({ name, status, date, getStatusColor }: TableRowData & { getStatusColor?: (status: string) => string }) => {
  const { isDarkMode } = useThemeStore();
  
  const getStatusStyles = (status: string) => {
    // إذا تم تمرير getStatusColor، استخدمه
    if (getStatusColor) {
      return getStatusColor(status);
    }
    
    // دعم الحالات المترجمة الشائعة
    const statusMap: Record<string, string> = {
      'نشط': isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'موقوف': isDarkMode ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-600 border-rose-100',
      'معلق': isDarkMode ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-100',
      // الحالات المترجمة من translations
      'قيد الانتظار': isDarkMode ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200',
      'مؤكد': isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'قيد التنفيذ': isDarkMode ? 'bg-primary/20 text-primary border-primary/30' : 'bg-primary/10 text-primary border-primary/20',
      'مكتمل': isDarkMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200',
      'ملغي': isDarkMode ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-50 text-rose-700 border-rose-200',
      'مفتوح': isDarkMode ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200',
      'تم الحل': isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'مغلق': isDarkMode ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' : 'bg-slate-50 text-slate-700 border-slate-200',
    };
    
    return statusMap[status] || (isDarkMode 
      ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' 
      : 'bg-slate-50 text-slate-600 border-slate-100');
  };

  return (
    <tr className={`border-t transition-all duration-300 group ${
      isDarkMode 
        ? 'border-slate-700 hover:bg-slate-700/50' 
        : 'border-slate-50 hover:bg-slate-50/50'
    }`}>
      <td className="p-3 sm:p-4 lg:p-6 text-right">
        <span className={`text-sm sm:text-base font-black group-hover:text-primary transition-colors ${
          isDarkMode ? 'text-white' : 'text-slate-700'
        }`}>{name}</span>
      </td>
      <td className="p-3 sm:p-4 lg:p-6">
        <span
          className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border shadow-sm inline-block ${getStatusStyles(
            status
          )}`}
        >
          {status}
        </span>
      </td>
      <td className="p-3 sm:p-4 lg:p-6 text-right">
        <span className={`text-xs sm:text-sm font-bold whitespace-nowrap ${
          isDarkMode ? 'text-slate-400' : 'text-slate-400'
        }`}>{date}</span>
      </td>
    </tr>
  );
};

const DashboardTable = ({
  data = [],
  columns = [],
  getStatusColor,
}: DashboardTableProps) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className={isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50/50'}>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-right p-3 sm:p-4 lg:p-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] first:rounded-tr-xl sm:first:rounded-tr-2xl lg:first:rounded-tr-[24px] last:rounded-tl-xl sm:last:rounded-tl-2xl lg:last:rounded-tl-[24px] ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-400'
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={isDarkMode ? 'divide-y divide-slate-700' : 'divide-y divide-slate-50'}>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={index} {...row} getStatusColor={getStatusColor} />
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={`p-6 sm:p-8 lg:p-10 text-center font-bold uppercase tracking-widest text-[10px] sm:text-xs ${
                isDarkMode ? 'text-slate-400' : 'text-slate-400'
              }`}>
                لا توجد بيانات ليتم عرضها حالياً
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;

