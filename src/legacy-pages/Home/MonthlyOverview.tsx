import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';
import { useMonthlyOverview } from 'modules/statistics/hooks/useMonthlyOverview';

export default function MonthlyOverview() {
  const { data: rows, isLoading } = useMonthlyOverview();

  return (
    <>
      <h2 className="font-semibold text-center">Faol foydalanuvchilar (oylik)</h2>
      <Card className="mt-2">
        <CardHeader>
          <CardTitle className="text-base">So‘nggi davr</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-4">Oy</th>
                    <th className="py-2">Soni</th>
                  </tr>
                </thead>
                <tbody>
                  {(rows ?? []).map((row) => (
                    <tr key={row.month} className="border-b border-border/60">
                      <td className="py-2 pr-4">{row.monthName || row.month}</td>
                      <td className="py-2 font-medium">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
