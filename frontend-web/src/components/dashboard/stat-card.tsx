import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'primary' | 'success' | 'warning' | 'secondary';
}

const colorClasses = {
  primary: 'bg-[rgb(var(--primary-500)/0.1)] text-[rgb(var(--primary-500))]',
  success: 'bg-[rgb(var(--accent-500)/0.1)] text-[rgb(var(--accent-500))]',
  warning: 'bg-[rgb(var(--secondary-500)/0.1)] text-[rgb(var(--secondary-500))]',
  secondary: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'primary',
}: StatCardProps) {
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </h3>
            {trend && (
              <p className="mt-2 flex items-center gap-1 text-sm">
                <span
                  className={cn(
                    'font-semibold',
                    trend.value >= 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.value >= 0 ? '+' : ''}
                  {trend.value}%
                </span>
                <span className="text-gray-500">{trend.label}</span>
              </p>
            )}
          </div>
          <div className={cn('rounded-full p-3', colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
