import { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { DailyData } from 'modules/statistics/types';
import { PuzzleDifficulty } from 'modules/puzzles/types';
import { useDailyPuzzleSubmission } from 'modules/statistics/hooks/useDailyPuzzleSubmission';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { DateRangePicker } from 'components/DataRangePicker';
import SelectOptions from 'components/SelectOptions';
import { puzzleDifficulties } from 'constants/index';
import Chart from './Chart';

export default function PuzzleSubmissionChart() {
  const [puzzleDifficulty, setPuzzleDifficulty] = useState<PuzzleDifficulty>();
  const [date, setDate] = useState<DateRange>();
  const validDate = date?.from && date.to ? date : undefined;
  const { data: puzzleSubmission } = useDailyPuzzleSubmission(
    puzzleDifficulty,
    validDate
  );

  const options = useMemo(() => {
    return {
      series: [
        {
          name: 'Bajarilgan boshqotirmalar',
          data: puzzleSubmission?.map((item: DailyData) => item.count) ?? [],
        },
      ],
      colors: ['#FE574F'],
      chart: {
        height: 400,
        type: 'area',
      },
      stroke: {
        curve: 'smooth',
      },
      markers: {
        size: 6,
      },
      grid: {
        borderColor: '#EFEFEF',
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: puzzleSubmission?.map((item: DailyData) => item.date) ?? [],
        position: 'bottom',
        axisTicks: {
          show: true,
        },
      },
      yaxis: {
        axisTicks: {
          show: true,
        },
        labels: {
          show: true,
          formatter: function (value: number) {
            return value;
          },
        },
      },
    };
  }, [puzzleSubmission, date]);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Bajarilgan boshqotirmalar</CardTitle>
          <SelectOptions
            value={puzzleDifficulty}
            setValue={setPuzzleDifficulty}
            data={puzzleDifficulties}
            placeholder="Boshqotirma darajasi"
            className="ml-auto"
          />
          <DateRangePicker date={date} setDate={setDate} />
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <Chart options={options} />
      </CardContent>
    </Card>
  );
}
