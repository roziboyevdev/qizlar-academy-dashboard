import Overview from './Overview';
import NewUsersChart from 'components/charts/NewUsers';
import DonationStatistics from 'components/charts/DonationStatistics';
import MonthlyOverview from './MonthlyOverview';

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-center">Umumiy malumotlar</h2>

      <Overview />

      <MonthlyOverview />
      <NewUsersChart />
      <DonationStatistics />
    </div>
  );
};

export default Home;
