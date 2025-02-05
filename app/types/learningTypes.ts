export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  lastAccessed: string;
  sectionsCompleted: string[];
  score?: number;
}

export interface LearningPathType {
  id: string;
  name: string;
  description: string;
  modules: string[];
  order: string[];
}

export interface UserLearningProgress {
  selectedPath: string;
  currentModule: string;
  progress: { [moduleId: string]: ModuleProgress };
  recommendations: string[];
  lastUpdated: string;
}
