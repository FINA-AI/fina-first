/**
 * Task/Workflow API Service
 */
import firstAxios from './axios';
import {
  ApiResponse,
  Task,
  ProcessDefinition,
  ProcessInstance,
  TaskFilters,
  PaginationParams,
} from '../../../types/first';

const PREFIX = 'ecm/workflow';

// ===========================
// Tasks
// ===========================

export const loadTasks = (
  page: number,
  limit: number,
  filters?: TaskFilters
) => {
  return firstAxios.get<ApiResponse<Task>>(`${PREFIX}/tasks`, {
    params: { page, limit, ...filters },
  });
};

export const loadTaskById = (taskId: string) => {
  return firstAxios.get<Task>(`${PREFIX}/tasks/${taskId}`);
};

export const completeTask = (taskId: string, variables?: Record<string, any>) => {
  return firstAxios.post(`${PREFIX}/tasks/${taskId}/complete`, variables);
};

export const claimTask = (taskId: string) => {
  return firstAxios.post(`${PREFIX}/tasks/${taskId}/claim`);
};

export const unclaimTask = (taskId: string) => {
  return firstAxios.post(`${PREFIX}/tasks/${taskId}/unclaim`);
};

export const assignTask = (taskId: string, assignee: string) => {
  return firstAxios.post(`${PREFIX}/tasks/${taskId}/assign`, { assignee });
};

// ===========================
// Process Definitions
// ===========================

export const loadProcessDefinitions = () => {
  return firstAxios.get<ApiResponse<ProcessDefinition>>(`${PREFIX}/process/definitions`);
};

export const loadProcessDefinitionByKey = (key: string) => {
  return firstAxios.get<ProcessDefinition>(`${PREFIX}/process/definition/${key}`);
};

export const loadProcessDiagram = (processDefinitionId: string) => {
  return firstAxios.get(`${PREFIX}/process/definition/${processDefinitionId}/diagram`, {
    responseType: 'blob',
  });
};

// ===========================
// Process Instances
// ===========================

export const startProcess = (
  processDefinitionKey: string,
  businessKey?: string,
  variables?: Record<string, any>
) => {
  return firstAxios.post<ProcessInstance>(`${PREFIX}/process/start`, {
    processDefinitionKey,
    businessKey,
    variables,
  });
};

export const loadProcessInstance = (processInstanceId: string) => {
  return firstAxios.get<ProcessInstance>(`${PREFIX}/process/instance/${processInstanceId}`);
};

export const deleteProcessInstance = (processInstanceId: string, reason?: string) => {
  return firstAxios.delete(`${PREFIX}/process/instance/${processInstanceId}`, {
    params: { reason },
  });
};
