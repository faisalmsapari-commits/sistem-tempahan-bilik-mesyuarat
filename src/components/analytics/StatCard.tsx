import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  onClick
}) => {
  const colorStyles = {
    blue: {
      bg: 'from-blue-600/10 to-sky-600/5 border-blue-200/80',
      iconBg: 'bg-blue-600 text-white',
      valueColor: 'text-blue-950'
    },
    emerald: {
      bg: 'from-emerald-600/10 to-teal-600/5 border-emerald-200/80',
      iconBg: 'bg-emerald-600 text-white',
      valueColor: 'text-emerald-950'
    },
    amber: {
      bg: 'from-amber-600/10 to-yellow-600/5 border-amber-200/80',
      iconBg: 'bg-amber-600 text-white',
      valueColor: 'text-amber-950'
    },
    purple: {
      bg: 'from-purple-600/10 to-indigo-600/5 border-purple-200/80',
      iconBg: 'bg-purple-600 text-white',
      valueColor: 'text-purple-950'
    },
    rose: {
      bg: 'from-rose-600/10 to-red-600/5 border-rose-200/80',
      iconBg: 'bg-rose-600 text-white',
      valueColor: 'text-rose-950'
    },
    cyan: {
      bg: 'from-cyan-600/10 to-blue-600/5 border-cyan-200/80',
      iconBg: 'bg-cyan-600 text-white',
      valueColor: 'text-cyan-950'
    }
  }[color];

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-3xl bg-gradient-to-br ${colorStyles.bg} border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${colorStyles.valueColor}`}>
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl shadow-sm ${colorStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center justify-between text-xs pt-2 border-t border-slate-100/60">
          {subtitle && <span className="text-slate-500 text-[11px] font-medium">{subtitle}</span>}
          {trend && <span className="font-bold text-emerald-600 text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md">{trend}</span>}
        </div>
      )}
    </div>
  );
};
