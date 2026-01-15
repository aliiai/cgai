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
      'نشط': isDarkMode ? 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/30' : 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/30',
      'موقوف': isDarkMode ? 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/30' : 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/30',
      'معلق': isDarkMode ? 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/30' : 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/30',
      // الحالات المترجمة من translations
      'قيد الانتظار': isDarkMode ? 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/30' : 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/30',
      'مؤكد': isDarkMode ? 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/30' : 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/30',
      'قيد التنفيذ': isDarkMode ? 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/30' : 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/30',
      'مكتمل': isDarkMode ? 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/30' : 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/30',
      'ملغي': isDarkMode ? 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/30' : 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/30',
      'مفتوح': isDarkMode ? 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/30' : 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/30',
      'تم الحل': isDarkMode ? 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/30' : 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/30',
      'مغلق': isDarkMode ? 'bg-[#FBFBFB] text-[#333333] border-[#114C5A]/20' : 'bg-[#FBFBFB] text-[#333333] border-[#114C5A]/20',
    };
    
    return statusMap[status] || (isDarkMode 
      ? 'bg-[#FBFBFB] text-[#333333] border-[#114C5A]/20' 
      : 'bg-[#FBFBFB] text-[#333333] border-[#114C5A]/20');
  };

  return (
    <tr className={`border-t-2 transition-all duration-300 group ${
      isDarkMode 
        ? 'border-[#114C5A]/20 hover:bg-[#FBFBFB]/50' 
        : 'border-[#114C5A]/20 hover:bg-[#FBFBFB]/50'
    }`}>
      <td className="p-4 sm:p-6 lg:p-8 text-right">
        <span className={`text-sm sm:text-base font-black group-hover:text-[#114C5A] transition-colors ${
          isDarkMode ? 'text-[#333333]' : 'text-[#333333]'
        }`}>{name}</span>
      </td>
      <td className="p-4 sm:p-6 lg:p-8">
        <span
          className={`px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 rounded-full text-[10px] font-black uppercase tracking-wider border-2 shadow-sm inline-block ${getStatusStyles(
            status
          )}`}
        >
          {status}
        </span>
      </td>
      <td className="p-4 sm:p-6 lg:p-8 text-right">
        <span className={`text-xs sm:text-sm font-bold whitespace-nowrap ${
          isDarkMode ? 'text-[#333333]/70' : 'text-[#333333]/70'
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
          <tr className={isDarkMode ? 'bg-[#114C5A]/10' : 'bg-[#114C5A]/10'}>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-right p-4 sm:p-6 lg:p-8 text-[10px] font-black uppercase tracking-[0.2em] first:rounded-tr-2xl sm:first:rounded-tr-3xl lg:first:rounded-tr-[24px] last:rounded-tl-2xl sm:last:rounded-tl-3xl lg:last:rounded-tl-[24px] ${
                  isDarkMode ? 'text-[#333333]/70' : 'text-[#333333]/70'
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={isDarkMode ? 'divide-y-2 divide-[#114C5A]/20' : 'divide-y-2 divide-[#114C5A]/20'}>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={index} {...row} getStatusColor={getStatusColor} />
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={`p-8 sm:p-10 lg:p-12 text-center font-black uppercase tracking-widest text-xs sm:text-sm ${
                isDarkMode ? 'text-[#333333]/70' : 'text-[#333333]/70'
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
