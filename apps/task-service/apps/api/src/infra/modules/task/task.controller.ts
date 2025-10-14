import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  FindTaskByIdUseCase,
  GetPaginatedTasksUseCase,
  UpdateTaskUseCase,
} from '@core/application/usecases';
import { GetTaskAuditLogsUseCase } from '@core/application/usecases/get-task-audit-logs';
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
import { LoggedUserId } from '../../decorators/logged-user.decorator';
import { TaskWithUsersResponse } from './dtos/task-with-user.response';
import { TaskAuditLogResponse } from './dtos/task-audit-log.response';

@Controller('task')
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly findTaskByIdUseCase: FindTaskByIdUseCase,
    private readonly getPaginatedTasksUseCase: GetPaginatedTasksUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly getTaskAuditLogsUseCase: GetTaskAuditLogsUseCase,
  ) {}

  @Post()
  async create(
    @LoggedUserId() userId: string,
    @Body()
    {
      assignedUserIds,
      description,
      priority,
      status,
      title,
      dueDate,
    }: CreateTaskRequest,
  ): Promise<TaskResponse> {
    const task = await this.createTaskUseCase.execute({
      authorId: UniqueId.create(userId),
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
    @Query() { page, size, status, priority, sortBy }: GetPaginatedTasksQuery,
    @LoggedUserId() userId: string
  ): Promise<TaskWithUsersResponse[]> {
    const tasks = await this.getPaginatedTasksUseCase.execute({
      userId,
      page,
      size,
      status,
      priority,
      sortBy,
    });
    return tasks.map(TaskWithUsersResponse.from);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<TaskWithUsersResponse> {
    const task = await this.findTaskByIdUseCase.execute(UniqueId.create(id));
    return TaskWithUsersResponse.from(task);
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

  @Get(':id/audit-logs')
  async getAuditLogs(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<TaskAuditLogResponse[]> {
    const auditLogs = await this.getTaskAuditLogsUseCase.execute({
      taskId: UniqueId.create(id),
      page,
      size,
    });
    return auditLogs.map(TaskAuditLogResponse.from);
  }
}
