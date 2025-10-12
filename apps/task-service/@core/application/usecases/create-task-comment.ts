import { UniqueId } from '@core/domain/value-objects/unique-id';
import { TaskRepository, UserReadModelRepository } from '@core/domain/ports';
import { NotFoundException } from '@nestjs/common';
import { TaskComment } from '@core/domain/entities/task-comment';
import { TaskCommentRepository } from '@core/domain/ports/task-comments-repository';
import { EventPublisher } from '../ports/event-publisher';

export interface CreateTaskCommentProps {
  taskId: UniqueId;
  authorId: UniqueId;
  content: string;
}

export class CreateTaskCommentUseCase {
  constructor(
    private readonly taskCommentRepository: TaskCommentRepository,
    private readonly userReadModelRepository: UserReadModelRepository,
    private readonly taskRepository: TaskRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({
    taskId,
    authorId,
    content,
  }: CreateTaskCommentProps): Promise<TaskComment> {
    const user = await this.userReadModelRepository.findById(authorId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new NotFoundException('User not found');
    }

    const taskComment = TaskComment.create({
      content,
      authorId,
      taskId,
    });

    await this.taskCommentRepository.create(taskComment);

    await this.eventPublisher.emit('comment.new', {
      id: taskComment.id.toString(),
      taskId: taskComment.taskId.toString(),
      authorId: taskComment.authorId.toString(),
      content: taskComment.content,
      createdAt: taskComment.createdAt,
      taskAuthorId: task.authorId.toString(),
      taskAssignedUserIds: task.assignedUserIds.map(id => id.toString()),
    });

    return taskComment;
  }
}
