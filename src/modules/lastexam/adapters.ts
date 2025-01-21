import {
  Option,
  Question,
  Quiz,
} from './types';

export const getQuiz = (item?: Quiz) => {
  return {
    id: item?.id ?? '',
    question: item?.question ?? "",
    course: item?.course ?? "",
    options: item?.options?.length
      ? item.options.map(option => getOptionsList(option))
      : [],
  };
};

export const getQuizzesList = (data?: Quiz[]) => {
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
    is_correct: item?.is_correct ?? false,
  };
}

