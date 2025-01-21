import { Crown, Puzzle, Users, Video } from 'lucide-react';
import { useOverview } from 'modules/statistics/hooks/useOverview';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';

export default function Overview() {
  const { data: overview, isLoading } = useOverview();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Foydalanuvchilar
          </CardTitle>
          <Users className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              overview?.all_users
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Video darslar</CardTitle>
          <Video className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              overview?.all_lessons
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Boshqotirmalar</CardTitle>
          <Puzzle className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              overview?.all_puzzles
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Bajarilgan boshqotirmalar
          </CardTitle>
          <Crown className="size-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              overview?.all_puzzle_submitted
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
