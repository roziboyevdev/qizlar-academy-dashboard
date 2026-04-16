import { useMemo, useState } from 'react';
import { useTheme } from 'providers/ThemeProvider';
import { DateRange } from 'react-day-picker';
import { useNewUsers } from 'modules/statistics/hooks/useNewUsers';
import { DailyData } from 'modules/statistics/types';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { DateRangePicker } from 'components/DataRangePicker';
import Chart from './Chart';
import { getDefaultDateRange } from 'utils/defaultDateRange';

export default function NewUsersChart() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [date, setDate] = useState<DateRange | undefined>(getDefaultDateRange());
  const validDate = date?.from && date.to ? date : getDefaultDateRange();
  const { data: newUsers } = useNewUsers(validDate);

  const options = useMemo(() => {
    return {
      series: [
        {
          name: 'Yangi foydalanuvchilar',
          data: newUsers?.map((item: DailyData) => item.count) ?? [],
        },
      ],
      chart: {
        height: 400,
        type: 'area',
        toolbar: { show: false },
        background: 'transparent',
        fontFamily: 'Inter, sans-serif',
      },
      theme: {
        mode: isDark ? 'dark' : 'light',
      },
      colors: ['#E8307D'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 100]
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['#ff4d94'],
        dropShadow: {
          enabled: true,
          color: '#E8307D',
          top: 4,
          left: 0,
          blur: 4,
          opacity: 0.2
        }
      },
      xaxis: {
        categories: newUsers?.map((item: DailyData) => item.date) ?? [],
        labels: {
          style: { colors: isDark ? '#94a3b8' : '#64748b' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: {
          stroke: {
            color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)'
          }
        },
      },
      yaxis: {
        labels: {
          style: { colors: isDark ? '#94a3b8' : '#64748b' }
        }
      },
      grid: {
        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)',
        strokeDashArray: 4,
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light'
      }
    };
  }, [newUsers, isDark]);


  return (
    <Card className="col-span-4 rounded-2xl border-border/80 bg-card shadow-lg hover:border-primary/20 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium text-foreground tracking-wide">Foydalanuvchilar O'sishi</CardTitle>
            <p className="text-sm text-muted-foreground">Oxirgi kungi statistika o'zgarishlari</p>
          </div>
          <DateRangePicker date={date} setDate={setDate} />
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <Chart options={options} />
      </CardContent>
    </Card>
  );
}
