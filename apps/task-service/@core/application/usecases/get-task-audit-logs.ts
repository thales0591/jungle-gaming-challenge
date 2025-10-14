import { DEFAULT_PAGE, DEFAULT_SIZE } from '../constants';
import { TaskAuditLogRepository } from '@core/domain/ports/task-audit-log-repository';
import { UniqueId } from '@core/domain/value-objects/unique-id';
import { TaskAuditLogWithUser } from '@core/domain/ports/types';

export interface GetTaskAuditLogsUseCaseRequest {
  taskId: UniqueId;
  size: number;
  page: number;
}

export class GetTaskAuditLogsUseCase {
  constructor(
    private readonly taskAuditLogRepository: TaskAuditLogRepository,
  ) {}

  async execute(
    props: GetTaskAuditLogsUseCaseRequest,
  ): Promise<TaskAuditLogWithUser[]> {
    const page = Math.max(1, props.page ?? DEFAULT_PAGE);
    const size = Math.max(1, props.size ?? DEFAULT_SIZE);
    return this.taskAuditLogRepository.findManyByTaskIdWithUser(
      props.taskId,
      page,
      size,
    );
  }
}
