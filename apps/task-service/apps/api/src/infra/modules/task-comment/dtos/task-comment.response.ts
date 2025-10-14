import { TaskCommentWithAuthor } from '@core/domain/ports/types';

export class TaskCommentResponse {
  constructor(
    readonly id: string,
    readonly taskId: string,
    readonly authorId: string,
    readonly authorName: string,
    readonly authorEmail: string,
    readonly content: string,
    readonly createdAt: Date | null,
  ) {}

  static from(domain: TaskCommentWithAuthor): TaskCommentResponse {
    return new TaskCommentResponse(
      domain.comment.id.value,
      domain.comment.taskId.toString(),
      domain.author.id,
      domain.author.name,
      domain.author.email,
      domain.comment.content,
      domain.comment.createdAt ?? null,
    );
  }
}
