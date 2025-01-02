export interface ColumnBoard {
  id: number;
  title: string;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assigned_to: string;
  deadline: Date;
  priority: 'High' | 'Medium' | 'Low';
  subtasks: Subtask[];
}

export interface Subtask {
  id: number;
  title: string;
  isCompleted: boolean;
}
