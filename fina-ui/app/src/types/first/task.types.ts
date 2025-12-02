/**
 * Task/Workflow module types
 */
import { AuditFields, TaskState } from './common.types';

// Task
export interface Task extends AuditFields {
  id: string;
  processId: string;
  processDefinitionId: string;
  processDefinitionKey: string;
  name: string;
  description?: string;
  assignee?: string;
  owner?: string;
  state: TaskState;
  priority?: number;
  startedAt: string;
  endedAt?: string;
  dueAt?: string;
  taskVariables?: Record<string, any>;
  taskForm?: TaskForm;
}

// Task form
export interface TaskForm {
  id: string;
  fields: TaskFormField[];
}

// Task form field
export interface TaskFormField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'boolean' | 'dropdown' | 'file';
  label: string;
  required: boolean;
  value?: any;
  options?: { label: string; value: any }[];
  validation?: Record<string, any>;
}

// Process definition
export interface ProcessDefinition {
  id: string;
  key: string;
  name: string;
  description?: string;
  version: number;
  deploymentId: string;
  diagramResourceName?: string;
  category?: string;
}

// Process instance
export interface ProcessInstance {
  id: string;
  processDefinitionId: string;
  processDefinitionKey: string;
  businessKey?: string;
  startedAt: string;
  endedAt?: string;
  startUserId?: string;
  variables?: Record<string, any>;
}

// Workflow filters
export interface TaskFilters {
  assignee?: string;
  state?: TaskState[];
  processDefinitionKey?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}
