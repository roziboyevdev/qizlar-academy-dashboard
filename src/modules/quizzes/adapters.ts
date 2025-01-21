import {
  Option,
  OptionValue,
  Question,
  Quiz,
  QuizContentType,
  QuizType,
} from './types';

export const getQuiz = (item?: Quiz) => {
  return {
    id: item?.id ?? '',
    question: item?.question?.length
      ? item.question.map(question => getQuestionsList(question))
      : [],
    type: item?.type ?? QuizType.SINGLE_SELECT,
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
    type: item?.type ?? QuizContentType.TEXT,
    content: item?.content ?? '',
  };
}

function getOptionsList(item: Option) {
  return {
    id: item?.id ?? '',
    value: item?.value?.length
      ? item.value.map(value => getOptionsValuesList(value))
      : [],
    is_correct: item?.is_correct ?? false,
  };
}

function getOptionsValuesList(item: OptionValue) {
  return {
    id: item?.id ?? '',
    type: item?.type ?? QuizContentType.TEXT,
    content: item?.content ?? '',
  };
}
