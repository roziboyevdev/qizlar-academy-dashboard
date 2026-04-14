export interface Module {
  id: string;
  title: string;
  courseId: string;
  isActive: boolean;
  description?: string;
  icon?: string;
}

export interface ModuleCreateInput {
  title: string;
  description: string;
  icon: string | File;
  courseId: string;
  isActive: boolean;
}

export interface ModuleEditInput {
  title: string;
  description: string;
  icon: string | File;
  isActive: boolean;
}

export interface ModuleEditBody {
  id: string;
  values: ModuleEditInput;
}
