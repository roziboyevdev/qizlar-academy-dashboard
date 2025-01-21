export interface Seo {
  title: string;
  description: string;
  image: string;
  keywords: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  seo: Seo | null;
  banner: string;
  icon: string;
  slug: string;
  planLessonCount?: number;
  type: string;
  degree: string;
  teacherId: string;
}

export interface CourseInput {
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  banner: string;
  icon: string;
  slug: string;
  planLessonCount: number;
  type: string;
  degree: string;
  teacherId: string;
  seo?: Seo | null;

}

export interface CourseEditBody {
  id: string;
  values: CourseInput;
}
