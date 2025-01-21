import http from 'services/api';
import { DateRange } from 'react-day-picker';
import { PuzzleDifficulty } from 'modules/puzzles/types';

export const GetOverview = async () => {
  return await http.get(`/statistics/overview`);
};

export const GetNewUsers = async (date?: DateRange) => {
  const startDate = date?.from ? date.from : '';
  const endDate = date?.to ? date.to : '';
  return await http.get(
    `/statistics/daily-user-count?start_date=${startDate}&end_date=${endDate}`
  );
};

export const GetDailyPuzzleSubmission = async (
  puzzleType?: PuzzleDifficulty,
  date?: DateRange
) => {
  const type = puzzleType ? puzzleType : '';
  const startDate = date?.from ? date.from : '';
  const endDate = date?.to ? date.to : '';
  return await http.get(
    `/statistics/daily-puzzle-submission?puzzle_type=${type}&start_date=${startDate}&end_date=${endDate}`
  );
};
