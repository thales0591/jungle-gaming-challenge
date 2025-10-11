import { UniqueId } from '@core/domain/value-objects/unique-id';
import { TaskRepository, UserReadModelRepository } from '@core/domain/ports';
import { NotFoundException } from '@nestjs/common';
import { TaskComment } from '@core/domain/entities/task-comment';
import { TaskCommentRepository } from '@core/domain/ports/task-comments-repository';

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

    return taskComment;
  }
}
