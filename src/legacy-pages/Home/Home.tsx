import Overview from './Overview';
import NewUsersChart from 'components/charts/NewUsers';
import MonthlyOverview from './MonthlyOverview';
import UzbekistanMapStats from './UzbekistanMap/UzbekistanMapStats';

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-center">Umumiy malumotlar</h2>
      <Overview />
      <UzbekistanMapStats />
      <MonthlyOverview />
      <NewUsersChart />
    </div>
  );
};

export default Home;
