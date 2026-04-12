import {
  Option,
  Question,
  Quiz,
} from './types';

export const getQuiz = (item?: Quiz | Record<string, unknown>) => {
  const anyItem = item as Record<string, unknown> | undefined;
  const lessonId = String(anyItem?.lessonId ?? anyItem?.courseId ?? '');
  const rawOpts = anyItem?.options;
  const opts = Array.isArray(rawOpts) ? rawOpts : [];

  return {
    id: String(anyItem?.id ?? ''),
    question: String(anyItem?.question ?? ''),
    courseId: lessonId,
    options: opts.length ? opts.map((option) => getOptionsList(option as Option)) : [],
  };
};

export const getQuizzesList = (data?: (Quiz | Record<string, unknown>)[]) => {
  return data?.length
    ? data.map(item => {
      return getQuiz(item);
    })
    : [];
};

function getQuestionsList(item: Question) {
  return {
    id: item?.id ?? '',
    value: item?.value ?? '',
  };
}

function getOptionsList(item: Option) {
  return {
    value: item?.value ?? '',
    isCorrect: item?.isCorrect ?? false,
  };
}

