import PuzzleSubmissionChart from 'components/charts/PuzzleSubmission';
import Overview from './Overview';
import NewUsersChart from 'components/charts/NewUsers';

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <Overview />
      <NewUsersChart />
      <PuzzleSubmissionChart />
    </div>
  );
};

export default Home;
