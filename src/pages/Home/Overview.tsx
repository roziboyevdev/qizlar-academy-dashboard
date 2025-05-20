import { BadgeCheck, Crown, HandCoins, Puzzle, Users, Video, View } from 'lucide-react';
import { useOverview } from 'modules/statistics/hooks/useOverview';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';
import { numToSum } from 'utils/numberFormat';

export default function Overview() {
  const { data: overview, isLoading } = useOverview();

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
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : overview?.courseViews}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Premium</CardTitle>
          <BadgeCheck className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : numToSum(overview?.premiumAmount)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Umumiy ehson</CardTitle>
          <HandCoins className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : numToSum(overview?.donationAmount)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Premium: to'langan / tekin </CardTitle>
          <View className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-20" /> : `${overview?.payedPremiums} / ${overview?.freePremiums}`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
