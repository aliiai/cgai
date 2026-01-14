import type { StatCardProps } from '../../types/types';

const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-500 text-sm">{title}</p>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      {trend && (
        <p
          className={`text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </p>
      )}
    </div>
  );
};

import type { StatsCardsProps } from '../../types/types';

const StatsCards = ({
  stats = [
    { title: 'المستخدمين', value: '1,245' },
    { title: 'الطلبات', value: '320' },
    { title: 'الأرباح', value: '$12,450' },
  ],
}: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;

