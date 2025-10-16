import { TaskComment } from '@core/domain/entities/task-comment';
import { UniqueId } from '@core/domain/value-objects/unique-id';

describe('TaskComment', () => {
  it('should be able to create a new task comment', () => {
    const taskId = UniqueId.create();
    const authorId = UniqueId.create();
    const comment = TaskComment.create({
      taskId,
      authorId,
      content: 'Test comment',
    });

    expect(comment).toBeDefined();
    expect(comment.content).toBe('Test comment');
    expect(comment.taskId.value).toBe(taskId.value);
    expect(comment.authorId.value).toBe(authorId.value);
  });

  it('should be able to update comment content', () => {
    const taskId = UniqueId.create();
    const authorId = UniqueId.create();
    const comment = TaskComment.create({
      taskId,
      authorId,
      content: 'Test comment',
    });

    comment.updateContent('Updated content');

    expect(comment.content).toBe('Updated content');
  });

  it('should not be able to create comment with empty content', () => {
    const taskId = UniqueId.create();
    const authorId = UniqueId.create();

    expect(() =>
      TaskComment.create({
        taskId,
        authorId,
        content: '',
      }),
    ).toThrow();
  });

  it('should not be able to update with empty content', () => {
    const taskId = UniqueId.create();
    const authorId = UniqueId.create();
    const comment = TaskComment.create({
      taskId,
      authorId,
      content: 'Test comment',
    });

    expect(() => comment.updateContent('')).toThrow();
  });
});
