export interface TeacherType {
  id: string;
  fullname: string;
  photo: string;
  bio: string;
  isActive?: boolean;
}

/** POST /teacher va PATCH /teacher/:id uchun body */
export interface TeacherInputType {
  fullname: string;
  photo: string;
  bio: string;
}

export interface TeacherEditBodyType {
  id: string;
  values: TeacherInputType;
}

