import type { Option, Quiz } from './types';
import { QuizOptionType } from './types';

const normOptionType = (t?: string): QuizOptionType => {
  if (t === 'IMAGE' || t === QuizOptionType.IMAGE) return QuizOptionType.IMAGE;
  if (t === 'AUDIO' || t === QuizOptionType.AUDIO) return QuizOptionType.AUDIO;
  return QuizOptionType.TEXT;
};

export const getQuiz = (item?: Quiz | Record<string, unknown>) => {
  const anyItem = item as Record<string, unknown> | undefined;
  const rawOpts = (anyItem?.options as Option[] | undefined) ?? [];
  const lessonId = String(anyItem?.lessonId ?? anyItem?.courseId ?? '');
  const sharedType = rawOpts[0] ? normOptionType(rawOpts[0].type) : QuizOptionType.TEXT;

  return {
    id: String(anyItem?.id ?? ''),
    question: String(anyItem?.question ?? ''),
    lessonId,
    courseId: lessonId,
    type: sharedType,
    kind: anyItem?.type as Quiz['kind'],
    mediaType: anyItem?.mediaType as Quiz['mediaType'],
    options: rawOpts.length ? rawOpts.map((option: Option) => getOptionsList(option)) : [],
  };
};

export const getQuizzesList = (data?: (Quiz | Record<string, unknown>)[]) => {
  return data?.length ? data.map((item) => getQuiz(item)) : [];
};

function getOptionsList(item: Option) {
  return {
    id: item?.id,
    type: item?.type ?? QuizOptionType.TEXT,
    value: item?.value ?? '',
    link: item?.link ?? '',
    isCorrect: item?.isCorrect ?? false,
  };
}
