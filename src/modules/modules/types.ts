export interface Module {
  id: string;
  title: string;
  courseId: string;
  isActive: boolean;
}


export interface ModuleCreateInput {
  title: string;
  courseId: string;
  isActive: boolean;

}

export interface ModuleEditInput {
  title: string;
  courseId: string;
  isActive: boolean;
}

export interface ModuleEditBody {
  id: string;
  values: ModuleEditInput;
}
