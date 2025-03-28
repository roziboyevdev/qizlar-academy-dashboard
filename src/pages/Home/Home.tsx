import Overview from './Overview';
import NewUsersChart from 'components/charts/NewUsers';
import DonationStatistics from 'components/charts/DonationStatistics';

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <Overview />
      <NewUsersChart />
      <DonationStatistics />
    </div>
  );
};

export default Home;
