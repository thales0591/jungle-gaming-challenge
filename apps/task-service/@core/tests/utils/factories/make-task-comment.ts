import { TaskComment, TaskCommentProps } from '@core/domain/entities/task-comment';
import { UniqueId } from '@core/domain/value-objects/unique-id';

export function makeTaskComment(
  override: Partial<TaskCommentProps> = {},
  id?: UniqueId,
): TaskComment {
  return TaskComment.create(
    {
      taskId: UniqueId.create(),
      authorId: UniqueId.create(),
      content: 'Test comment content',
      ...override,
    },
    id,
  );
}
