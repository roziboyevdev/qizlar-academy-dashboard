import { Vacancy, VacancyType } from "./types";
export const getVacancy = (item?: Vacancy) => {
  return {
    id: item?.id ?? "",
    description: item?.description ?? "",
    title: item?.title ?? "",
    company: item?.company ?? "",
    salary: item?.salary ?? 0,
    from_experience: item?.from_experience ?? 0,
    to_experience: item?.to_experience ?? 0,
    type: item?.type ?? VacancyType.EMPTY,
    tags: item?.tags ?? [""]
  };
};

export const getVacanciesList = (data?: Vacancy[]) => {
  return data?.length
    ? data.map((item) => {
        return getVacancy(item);
      })
    : [];
};
