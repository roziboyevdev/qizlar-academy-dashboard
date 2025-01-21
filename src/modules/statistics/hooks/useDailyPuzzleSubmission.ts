import { useQuery } from '@tanstack/react-query';
import { get } from 'lodash';
import { GetDailyPuzzleSubmission } from '../api';
import { DateRange } from 'react-day-picker';
import { PuzzleDifficulty } from 'modules/puzzles/types';

export const useDailyPuzzleSubmission = (
  puzzleType?: PuzzleDifficulty,
  date?: DateRange
) => {
  const { data, ...args } = useQuery({
    queryKey: ['daily_puzzle_submission', puzzleType, date],
    queryFn: () => GetDailyPuzzleSubmission(puzzleType, date),
    select: data => ({
      data: get(data, 'data.data'),
    }),
  });

  return {
    ...data,
    ...args,
  };
};
