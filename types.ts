
export enum DeploymentStep {
  SPEC = 'SPEC',
  PLAN = 'PLAN',
  TASKS = 'TASKS',
  IMPLEMENT = 'IMPLEMENT'
}

export interface TodoItem {
  id: string;
  text: string;
  status: 'pending' | 'completed';
  category: 'frontend' | 'backend' | 'infra';
}

export interface PodStatus {
  name: string;
  status: 'Running' | 'Pending' | 'Error';
  restarts: number;
  age: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  type: 'text' | 'command' | 'status';
}
