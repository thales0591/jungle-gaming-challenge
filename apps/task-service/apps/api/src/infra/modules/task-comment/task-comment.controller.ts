import { GetPaginatedTaskCommentsUseCase } from '@core/application/usecases';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateTaskCommentUseCase } from '@core/application/usecases/create-task-comment';
import { LoggedUserId } from '../../decorators/logged-user.decorator';
import { CreateTaskCommentRequest } from './dtos/create-task-comment.request';
import { GetPaginatedTaskCommentsQuery } from './dtos/get-paginated-task-comments.request';
import { TaskCommentResponse } from './dtos/task-comment.response';
import { UniqueId } from '@core/domain/value-objects/unique-id';

@Controller('task/:id/comments')
export class TaskCommentController {
  constructor(
    private readonly createTaskCommentUseCase: CreateTaskCommentUseCase,
    private readonly getPaginatedTaskCommentsUseCase: GetPaginatedTaskCommentsUseCase,
  ) {}

  @Post()
  async create(
    @Param('id') taskId: string,
    @LoggedUserId() userId: string,
    @Body() { content }: CreateTaskCommentRequest,
  ): Promise<TaskCommentResponse> {
    const taskComment = await this.createTaskCommentUseCase.execute({
      authorId: UniqueId.create(userId),
      taskId: UniqueId.create(taskId),
      content,
    });

    return TaskCommentResponse.from(taskComment);
  }

  @Get()
  async getPaginated(
    @Param('id') taskId: string,
    @Query() { page, size }: GetPaginatedTaskCommentsQuery,
  ): Promise<TaskCommentResponse[]> {
    const tasks = await this.getPaginatedTaskCommentsUseCase.execute({
      taskId: UniqueId.create(taskId),
      page,
      size,
    });
    return tasks.map(TaskCommentResponse.from);
  }
}
