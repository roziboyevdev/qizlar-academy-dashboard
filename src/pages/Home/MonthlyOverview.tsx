import { BadgeCheck, Crown, HandCoins, Puzzle, Users, Video, View } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';
import { numToSum } from 'utils/numberFormat';
import { useMonthlyOverview } from 'modules/statistics/hooks/useMonthlyOverview';

export default function MonthlyOverview() {
  const { data: overview, isLoading } = useMonthlyOverview();
  console.log(overview, 'overview');

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Foydalanuvchilar</CardTitle>
          <Users className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : overview?.users}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Video darslar</CardTitle>
          <Video className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : overview?.lessons}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kurslar</CardTitle>
          <Puzzle className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : overview?.courses}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sertifikat olganlar</CardTitle>
          <Crown className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : overview?.certificates}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ko'rishlar soni</CardTitle>
          <View className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : overview?.views}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Testlar</CardTitle>
          <BadgeCheck className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : overview?.quizes}</div>
        </CardContent>
      </Card>

      <Card className="grid-cols-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jins boyicha</CardTitle>
          <Users className="size-4" />
        </CardHeader>
        <CardContent className="flex gap-2 justify-between ">
          <div className="text-xl  flex gap-1 font-bold">
            Ayol: <span> {isLoading ? <Skeleton className="h-8 w-20" /> : overview?.gender?.Ayol}</span>
          </div>

          <div className="text-xl  flex gap-1 font-bold">
            Erkak:
            <span> {isLoading ? <Skeleton className="h-8 w-20" /> : overview?.gender?.Erkak}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
