import type {
  CreateTaskRequest,
  Task,
  FetchTasksRequestData,
} from "./interface";
import api from "../api";

export const createTaskRequest = async (
  requestData: CreateTaskRequest
): Promise<Task> => {
  const { data } = await api.post(`/task`, requestData);
  return data;
};

export const createTaskCommentRequest = async (
  taskId: string,
  content: string
): Promise<Task> => {
  const { data } = await api.post(`/task/${taskId}/comments`, content);
  return data;
};

export const fetchTasksRequest = async (
  requestData: FetchTasksRequestData
): Promise<Task[]> => {
  const { data } = await api.get(
    `/task?page=${requestData.page}&size=${requestData.size}`
  );
  return data;
};

export const updateTaskRequest = async (
  taskId: string,
  requestData: Partial<CreateTaskRequest>
): Promise<Task> => {
  const { data } = await api.put(`/task/${taskId}`, requestData);
  return data;
};

export const deleteTaskRequest = async (taskId: string): Promise<void> => {
  const { data } = await api.delete(`/task/${taskId}`);
  return data;
};
