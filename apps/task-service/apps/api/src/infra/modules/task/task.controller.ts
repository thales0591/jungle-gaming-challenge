import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  FindTaskByIdUseCase,
  GetPaginatedTasksUseCase,
  UpdateTaskUseCase,
} from '@core/application/usecases';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTaskRequest } from './dtos/create-task.request';
import { TaskResponse } from './dtos/task.response';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { GetPaginatedTasksQuery } from './dtos/get-paginated-tasks.request';
import { UpdateTaskRequest } from './dtos/update-task.request';

@Controller('task')
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly findTaskByIdUseCase: FindTaskByIdUseCase,
    private readonly getPaginatedTasksUseCase: GetPaginatedTasksUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
  ) {}

  @Post()
  async create(
    @Body()
    {
      assignedUserIds,
      authorId,
      description,
      priority,
      status,
      title,
      dueDate,
    }: CreateTaskRequest,
  ): Promise<TaskResponse> {
    const task = await this.createTaskUseCase.execute({
      authorId: UniqueId.create(authorId),
      assignedUserIds: assignedUserIds.map((id) => UniqueId.create(id)),
      title,
      description,
      priority,
      status,
      dueDate,
    });

    return TaskResponse.from(task);
  }

  @Get()
  async getPaginated(
    @Query() { page, size }: GetPaginatedTasksQuery,
  ): Promise<TaskResponse[]> {
    const tasks = await this.getPaginatedTasksUseCase.execute({
      page,
      size,
    });
    return tasks.map(TaskResponse.from);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TaskResponse> {
    const task = await this.findTaskByIdUseCase.execute(UniqueId.create(id));
    return TaskResponse.from(task);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    {
      assignedUserIds,
      description,
      dueDate,
      priority,
      status,
      title,
    }: UpdateTaskRequest,
  ): Promise<TaskResponse> {
    const task = await this.updateTaskUseCase.execute({
      id: UniqueId.create(id),
      title,
      description,
      status,
      assignedUserIds: assignedUserIds?.length
        ? assignedUserIds.map((id) => UniqueId.create(id))
        : [],
      dueDate,
      priority,
    });
    return TaskResponse.from(task);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteTaskUseCase.execute(UniqueId.create(id));
  }
}
