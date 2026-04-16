import { GraduationCap, PlayCircle, UserCheck, Users } from 'lucide-react';
import { useOverview } from 'modules/statistics/hooks/useOverview';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';
import { formatIntegerCount } from 'utils/numberFormat';

export default function Overview() {
  const { data: overview, isLoading } = useOverview();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-2xl border-border/80 bg-card shadow-lg hover:border-primary/20 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Foydalanuvchilar</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="size-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {isLoading ? <Skeleton className="h-8 w-20 bg-muted" /> : formatIntegerCount(overview?.users)}
          </div>
          <p className="text-xs text-primary mt-1 flex items-center font-medium">
            +12.5% <span className="text-muted-foreground ml-1 font-normal">Oxirgi oydan</span>
          </p>
        </CardContent>
      </Card>
      
      <Card className="rounded-2xl border-border/80 bg-card shadow-lg hover:border-primary/20 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Kursni boshlaganlar</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <UserCheck className="size-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {isLoading ? <Skeleton className="h-8 w-20 bg-muted" /> : formatIntegerCount(overview?.startedStudents)}
          </div>
          <p className="text-xs text-primary mt-1 flex items-center font-medium">
            +5.29% <span className="text-muted-foreground ml-1 font-normal">Oxirgi oydan</span>
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/80 bg-card shadow-lg hover:border-primary/20 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Kursni tugatganlar</CardTitle>
          <div className="p-2 bg-orange-500/10 rounded-full">
            <GraduationCap className="size-5 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {isLoading ? <Skeleton className="h-8 w-20 bg-muted" /> : formatIntegerCount(overview?.completedStudents)}
          </div>
          <p className="text-xs text-orange-500 mt-1 flex items-center font-medium">
            +2.1% <span className="text-muted-foreground ml-1 font-normal">Oxirgi oydan</span>
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/80 bg-card shadow-lg hover:border-primary/20 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Videolar</CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <PlayCircle className="size-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {isLoading ? <Skeleton className="h-8 w-20 bg-muted" /> : formatIntegerCount(overview?.videos)}
          </div>
          <p className="text-xs text-primary mt-1 flex items-center font-medium">
            +18 yangi <span className="text-muted-foreground ml-1 font-normal">Oxirgi oydan</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
