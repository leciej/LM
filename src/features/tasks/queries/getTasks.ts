import { getTasksSnapshot } from '../commands';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export function getTasks(): Task[] {
  return getTasksSnapshot();
}
