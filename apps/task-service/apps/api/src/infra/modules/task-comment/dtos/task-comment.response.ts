import { TaskComment } from '@core/domain/entities/task-comment';

export class TaskCommentResponse {
  constructor(
    readonly id: string,
    readonly taskId: string,
    readonly authorId: string,
    readonly content: string,
    readonly createdAt: Date | null,
  ) {}

  static from(domain: TaskComment): TaskCommentResponse {
    return new TaskCommentResponse(
      domain.id.value,
      domain.taskId.toString(),
      domain.authorId.toString(),
      domain.content,
      domain.createdAt ?? null,
    );
  }
}
