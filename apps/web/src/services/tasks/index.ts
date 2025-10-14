import type {
  CreateTaskRequest,
  Task,
  FetchTasksRequestData,
  TaskComment,
  RichTask,
} from "./interface";
import api from "../api";

export const createTaskRequest = async (
  requestData: CreateTaskRequest
): Promise<Task> => {
  const { data } = await api.post(`/task`, requestData);
  return data;
};

export const createTaskCommentRequest = async ({
  taskId,
  content,
}: {
  taskId: string;
  content: string;
}): Promise<TaskComment> => {
  const { data } = await api.post(`/task/${taskId}/comments`, { content });
  return data;
};

export const fetchTasksRequest = async (
  requestData: FetchTasksRequestData
): Promise<RichTask[]> => {
  const params = new URLSearchParams({
    page: requestData.page.toString(),
    size: requestData.size.toString(),
  });

  if (requestData.status) {
    params.append('status', requestData.status);
  }

  if (requestData.priority) {
    params.append('priority', requestData.priority);
  }

  if (requestData.sortBy) {
    params.append('sortBy', requestData.sortBy);
  }

  const { data } = await api.get(`/task?${params.toString()}`);
  return data;
};

export const fetchSingleTaskRequest = async (
  taskId: string
): Promise<RichTask> => {
  const { data } = await api.get(`/task/${taskId}`);
  return data;
};

export const updateTaskRequest = async ({
  taskId,
  requestData,
}: {
  taskId: string;
  requestData: Partial<CreateTaskRequest>;
}): Promise<Task> => {
  const { data } = await api.put(`/task/${taskId}`, requestData);
  return data;
};

export const deleteTaskRequest = async (taskId: string): Promise<void> => {
  const { data } = await api.delete(`/task/${taskId}`);
  return data;
};

export const fetchTasksComments = async (
  taskId: string
): Promise<TaskComment[]> => {
  const { data } = await api.get(`/task/${taskId}/comments`);
  return data;
};
